const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._songs = [];
    }

    addSongs({
        title, year, performer, genre, duration,
    }) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();

        const newSongs = {
            id, title, year, performer, genre, duration, insertedAt, updatedAt: insertedAt,
        };

        this._songs.push(newSongs);

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Song gagal disimpan, ID tidak sama');
        }

        return id;
    }

    getSongs() {
        return this._songs;
    }

    getSongById(id) {
        const song = this._songs.filter((song) => song.id === id)[0];

        if (!song) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        return song;
    }

    editSongById(id, {
        title, year, performer, genre, duration,
    }) {
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new NotFoundError('gagal mengupdate song');
        }
        this._songs[index] = {
            ...this._songs[index],
            title,
            year: parseInt(year),
            performer,
            genre,
            duration,
            updatedAt: new Date().toISOString(),
        };
    }

    deleteSongById(id) {
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new NotFoundError('Lagu gagal dihapus');
        }

        this._songs.splice(index, 1);
    }
}

module.exports = SongsService;
