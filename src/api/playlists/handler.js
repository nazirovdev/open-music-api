class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getAllPlaylistHandler = this.getAllPlaylistHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;

        this._validator.validatePostPlaylistPayload(request.payload);
        const { name } = request.payload;

        const playlistId = await this._service.addPlaylist(name, credentialId);
        return h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId
            }
        }).code(201);
    }

    async getAllPlaylistHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getAllPlaylists(credentialId);

        return {
            status: 'success',
            data: {
                playlists: playlists.map((playlist) => ({
                    id: playlist.id,
                    name: playlist.name,
                    username: playlist.username
                }))
            },
        }
    }

    async deletePlaylistHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.deletePlaylists(playlistId, credentialId);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus'
        }
    }
}

module.exports = PlaylistsHandler;