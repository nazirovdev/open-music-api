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

    postSongsHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, performer, genre, duration } = request.payload;
            const songId = this._service.addSongs({ title, year, performer, genre, duration });
            return h.response({
                status: 'success',
                message: 'song berhasil disimpan',
                data: {
                    songId
                }
            }).code(201);
        }catch (error) {
            // return h.response({
            //     status: 'fail',
            //     message: 'song gagal disimpan',
            // }).code(404);
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

    getSongsHandler(request, h) {
        try {
            const songs = this._service.getSongs();
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

    getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = this._service.getSongById(id);
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

    putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;
            const { title, year, performer, genre, duration } = request.payload;
            this._service.editSongById(id, { title, year, performer, genre, duration });
            return h.response({
                status: 'success',
                message: 'song berhasil diupdate'
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

    deleteSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            this._service.deleteSongById(id);
            return h.response({
                status: 'success',
                message: 'song berhasil dihapus'
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