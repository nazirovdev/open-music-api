const ClientError = require('../../exceptions/ClientError');

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
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, performer, genre, duration } = request.payload;
            const songId = await this._service.addSongs({ title, year, performer, genre, duration });
            return h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId
                }
            }).code(201);
        }catch (error) {
            if (error instanceof ClientError) {
                return h.response({
                    status: 'fail',
                    message: error.message
                }).code(error.statusCode);
            }
            return h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            }).code(500);
        }
    }

    async getSongsHandler(request, h) {
        try {
            const songs = await this._service.getSongs();
            return h.response({
                status: 'success',
                data: {
                    songs: songs.map((song) => ({
                        id: song.id,
                        title: song.title,
                        performer: song.performer
                    }))
                }
            }).code(200);
        }catch (error) {
            if (error instanceof ClientError) {
                return h.response({
                    status: 'fail',
                    message: error.message
                }).code(error.statusCode);
            }
            return h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            }).code(500);
        }
    }

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return h.response({
                status: 'success',
                data: {
                    song: {
                        id: song.id,
                        title: song.title,
                        year: song.year,
                        performer: song.performer,
                        genre: song.genre,
                        duration: parseInt(song.duration),
                        insertedAt: song.insertedAt,
                        updatedAt: song.updatedAt
                    }
                }
            }).code(200);
        }catch (error) {
            if (error instanceof ClientError) {
                return h.response({
                    status: 'fail',
                    message: error.message
                }).code(error.statusCode);
            }
            return h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            }).code(500);
        }
    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;
            const { title, year, performer, genre, duration } = request.payload;
            await this._service.editSongById(id, { title, year, performer, genre, duration });
            return h.response({
                status: 'success',
                message: 'lagu berhasil diperbarui'
            }).code(200);
        }catch (error) {
            if (error instanceof ClientError) {
                return h.response({
                    status: 'fail',
                    message: error.message
                }).code(error.statusCode);
            }
            return h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            }).code(500);
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            await this._service.deleteSongById(id);
            return h.response({
                status: 'success',
                message: 'lagu berhasil dihapus'
            }).code(200);
        }catch (error) {
            if (error instanceof ClientError) {
                return h.response({
                    status: 'fail',
                    message: error.message
                }).code(error.statusCode);
            }
            return h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            }).code(500);
        }
    }
}

module.exports = SongsHandler;