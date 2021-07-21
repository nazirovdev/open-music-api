const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationsService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService
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

        return result.rows[0].id;
    }

    async getAllPlaylistByOwner(owner) {
        const query = {
            text: `
                SELECT playlists.id, playlists.name, users.username
                FROM playlists
                INNER JOIN users ON playlists.owner = users.id
                WHERE playlists.owner = $1
            `,
            values: [owner],
        };

        const result = await this._pool.query(query);

        if (result.rowCount < 1) {
            throw new NotFoundError('Playlist tidak ada');
        }

        return result.rows;
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
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
            values: [playlistId, owner],
        };

        return await this._pool.query(query);
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
        const query = {
            text: `
                SELECT * FROM playlistsongs WHERE song_id = $1
            `,
            values: [songId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount < 1) {
            throw new InvariantError('Data tidak ada');
        }

        const queryDelete = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId],
        };

        return await this._pool.query(queryDelete);
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
            }catch (error) {
                throw new AuthorizationError('anda tidak berhak mengakses');
            }
        }
    }
}

module.exports = PlaylistsService;
