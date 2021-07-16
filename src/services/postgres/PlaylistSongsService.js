const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyOwnerPlaylist(playlistId, owner) {
        const query = {
            text: 'SELECT id, owner FROM playlists WHERE id = $1 AND owner = $2',
            values: [playlistId, owner],
        };

        const result = await this._pool.query(query);

        if (result.rows.length < 1) {
            throw new AuthorizationError('anda tidak memiliki akses ini');
        }
    }

    async addPlaylistSong(playlist_id, song_id) {
        const id = `playlist_song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3)',
            values: [id, playlist_id, song_id],
        };

        const result = await this._pool.query(query);

        return result;
    };
}

module.exports = PlaylistSongsService;