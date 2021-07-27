const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationsService, cacheService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
        this._cacheService = cacheService;
    }

    async addPlaylist(name, owner) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('gagal menambahkan playlists');
        }

        const x = await this._cacheService.delete(`playlists: ${owner}`);
        return result.rows[0].id;
    }

    async getAllPlaylistByOwner(owner) {
        try {
            const result = await this._cacheService.get(`playlists: ${owner}`);
            return JSON.parse(result);
        } catch (error) {
            const query = {
                text: `
                      SELECT p.id, p.name, users.username 
                      FROM (SELECT playlists.* FROM playlists
                      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                      WHERE playlists.owner = $1 OR collaborations.user_id = $1
                      GROUP BY playlists.id) p LEFT JOIN users ON users.id = p.owner
                `,
                values: [owner],
            };

            const result = await this._pool.query(query);
            const playlists = result.rows;

            await this._cacheService.set(`playlists: ${owner}`, JSON.stringify(playlists));

            return playlists;
        }
    }

    async verifyPlaylistsOwner(playlistId, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount < 1) {
            throw new NotFoundError('Playlist tidak ada');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak memiliki akses ini');
        }
    }

    async deletePlaylistByOwner(playlistId, owner) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING owner',
            values: [playlistId, owner],
        };

        const result = await this._pool.query(query);
        const { owner: idOwner } = result.rows[0];

        await this._cacheService.delete(`playlists: ${idOwner}`);
    }

    async addSongToPlaylistByOwner(playlistId, songId) {
        const id = `songplaylist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3)',
            values: [id, playlistId, songId],
        };

        return await this._pool.query(query);
    }

    async getAllSongToPlaylistByOwner(playlistId) {
        const query = {
            text: `
                SELECT playlistsongs.id, songs.title, songs.performer FROM playlistsongs
                INNER JOIN playlists ON playlistsongs.playlist_id = playlists.id
                INNER JOIN songs ON playlistsongs.song_id = songs.id
                WHERE playlists.id = $1
            `,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount < 1) {
            throw new NotFoundError('Data tidak ada');
        }
        return result.rows;
    }

    async deleteAllSongToPlaylistByOwner(playlistId, songId) {
        const queryDelete = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(queryDelete);

        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus dari playlist. Id lagu tidak ditemukan');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistsOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch (error) {
                throw new AuthorizationError('anda tidak memiliki akses ini');
            }
        }
    }
}

module.exports = PlaylistsService;
