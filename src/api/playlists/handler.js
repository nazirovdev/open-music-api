class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.PostPlaylistHandler = this.PostPlaylistHandler.bind(this);
        this.GetPlaylistHandler = this.GetPlaylistHandler.bind(this);
        this.DeletePlaylistHandler = this.DeletePlaylistHandler.bind(this);
        this.PostSongToPlaylistByOwnerHandler = this.PostSongToPlaylistByOwnerHandler.bind(this);
        this.GetSongToPlaylistByOwnerHandler = this.GetSongToPlaylistByOwnerHandler.bind(this);
        this.deleteAllSongToPlaylistByOwnerHandler = this.deleteAllSongToPlaylistByOwnerHandler.bind(this);
    }

    async PostPlaylistHandler(request, h) {
        this._validator.ValidatePostPlaylistPayload(request.payload);

        const { id: credentialsId } = request.auth.credentials;
        const { name } = request.payload;

        const playlistId = await this._service.addPlaylist(name, credentialsId);

        return h.response({
            status: 'success',
            message: 'Playlists berhasil disimpan',
            data: {
                playlistId
            }
        }).code(201);
    }

    async GetPlaylistHandler(request, h) {
        const { id: credentialsId } = request.auth.credentials;

        const playlists = await this._service.getAllPlaylistByOwner(credentialsId);
        return h.response({
            status: 'success',
            data: {
                playlists
            }
        }).code(200);
    }

    async DeletePlaylistHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: credentialsId } = request.auth.credentials;

        await this._service.verifyPlaylistsOwner(playlistId, credentialsId);
        await this._service.deletePlaylistByOwner(playlistId, credentialsId);

        return h.response({
            status: 'success',
            message: 'playlist berhasil dihapus'
        })
    }

    async PostSongToPlaylistByOwnerHandler(request, h) {
        const { id: playlistId } = request.params;

        this._validator.ValidatePostSongToPlaylistPayload(request.payload);
        const { songId } = request.payload;

        const { id: credentialsId } = request.auth.credentials;

        await this._service.verifyPlaylistsOwner(playlistId, credentialsId);
        await this._service.addSongToPlaylistByOwner(playlistId, songId);

        return h.response({
            status: 'success',
            message: 'playlist song berhasi ditambahkan'
        }).code(201);
    }

    async GetSongToPlaylistByOwnerHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: credentialsId } = request.auth.credentials;

        await this._service.verifyPlaylistsOwner(playlistId, credentialsId);
        const songs = await this._service.getAllSongToPlaylistByOwner(playlistId);

        return h.response({
            status: 'success',
            data: {
                songs
            }
        }).code(200);
    }

    async deleteAllSongToPlaylistByOwnerHandler(request, h) {
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        const { id: credentialsId } = request.auth.credentials;

        await this._service.verifyPlaylistsOwner(playlistId, credentialsId);
        await this._service.deleteAllSongToPlaylistByOwner(playlistId, songId);

        return h.response({
            status: 'success',
            message: 'song playlist berhasil dihapus'
        }).code(200);
    }
}

module.exports = PlaylistsHandler;
