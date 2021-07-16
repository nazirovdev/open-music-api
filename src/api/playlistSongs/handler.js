class PlaylistSongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    }

    async postPlaylistSongHandler(request, h) {
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyOwnerPlaylist(playlistId, credentialId);
        await this._service.addPlaylistSong( playlistId, songId);

        return h.response({
            status: 'success',
            message: 'song playlist berhasil ditambahkan'
        }).code(201);
    }
}

module.exports = PlaylistSongsHandler;