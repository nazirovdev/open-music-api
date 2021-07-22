const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
    constructor() {
        this._users = [];
    }

    async addUsers({ username, password, fullname }) {
        const id = `user-${nanoid(16)}`;
        const hashPassword = await bcrypt.hash(password, 10);

        const newUsers = {
            id, username, hashPassword, fullname,
        };

        const userIsExist = this._users.some((user) => user.username === username);

        this._users.push(newUsers);

        if (userIsExist) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
        return newUsers;
    }
}

module.exports = UsersService;
