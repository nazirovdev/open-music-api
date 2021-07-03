class SongsHandler {
    constructor(service) {
        this._service = service;
        this.postSongsHandler = this.postSongsHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    }

    postSongsHandler(request, h) {
        try {
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
            return h.response({
                status: 'fail',
                message: 'song gagal disimpan',
            }).code(404);
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
            return h.response({
                status: 'success',
                message: error.message
            }).code(400);
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
            return h.response({
                status: 'fail',
                message: 'song tidak ada'
            }).code(400);
        }
    }
}

module.exports = SongsHandler;