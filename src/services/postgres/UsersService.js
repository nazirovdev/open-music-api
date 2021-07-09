const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUsers({ username, password, fullname }) {
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;
        const hashPassword = await bcrypt.hash(password, 10);

        const query = {
            text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashPassword, fullname]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }
}

module.exports = UsersService;
