const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongs({
        title, year, performer, genre, duration,
    }) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Song gagal disimpan, ID tidak sama');
        }

        return result.rows[0].id;
    }

    async getSongs() {
        const result = await this._pool.query('SELECT id, title, performer FROM songs');
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        return result.rows[0];
    }

    async editSongById(id, {
        title, year, performer, genre, duration,
    }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5 WHERE id = $6 RETURNING id',
            values: [title, year, performer, genre, duration, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal diupdate');
        }

        return result;
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus');
        }

        return result;
    }
}

module.exports = SongsService;
