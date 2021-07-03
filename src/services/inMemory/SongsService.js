const { nanoid } = require('nanoid');

class SongsService {
    constructor() {
        this._songs = [];
    }

    addSongs({ title, year, performer, genre, duration }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newSongs = {
            id, title, year, performer, genre, duration, insertedAt, updatedAt
        };

        this._songs.push(newSongs);

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

        if (!isSuccess) {
            throw new Error('Song gagal disimpan, ID tidak sama');
        }

        return id;
    };

    getSongs() {
        return this._songs;
    }

    getSongById(id) {
        const song = this._songs.filter((song) => song.id === id)[0];

        if (!song) {
            throw new Error('Song tidak ditemukan');
        }

        return song;
    }
}

module.exports = SongsService;