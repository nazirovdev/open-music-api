const { mapSongById } = require('../../utils/songMap');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongsHandler = this.postSongsHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongsHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const {
            title, year, performer, genre, duration,
        } = request.payload;
        const songId = await this._service.addSongs({
            title, year, performer, genre, duration,
        });
        return h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        }).code(201);
    }

    async getSongsHandler(request, h) {
        const songs = await this._service.getSongs();
        return h.response({
            status: 'success',
            data: {
                songs: songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer
                })),
            },
        }).code(200);
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;
        const song = await this._service.getSongById(id);
        return h.response({
            status: 'success',
            data: {
                song: mapSongById(song)
            },
        }).code(200);
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;
        const {
            title, year, performer, genre, duration,
        } = request.payload;
        await this._service.editSongById(id, {
            title, year, performer, genre, duration,
        });
        return h.response({
            status: 'success',
            message: 'lagu berhasil diperbarui',
        }).code(200);
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;
        await this._service.deleteSongById(id);
        return h.response({
            status: 'success',
            message: 'lagu berhasil dihapus',
        }).code(200);
    }
}

module.exports = SongsHandler;
