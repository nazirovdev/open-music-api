const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist(name, owner) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAllPlaylists(owner) {
        const query = {
            text: 'SELECT playlists.id, playlists.name, users.username, playlists.owner FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
            values: [owner],
        };

        const results = await this._pool.query(query);

        return results.rows;
    }

    async deletePlaylists(playlistId, owner) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
            values: [playlistId, owner],
        };

        const result = await this._pool.query(query);

        if (result.rowCount < 1) {
            throw new AuthorizationError('Anda tidak memiliki akses ini');
        }
    }
}

module.exports = PlaylistsService;