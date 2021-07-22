class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        this._validator.ValidateCollaborationPayload(request.payload);
        const { id: credentialsId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialsId);
        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

        return h.response({
            status: 'success',
            message: 'kolaborasi berhasil ditambahkan',
            data: {
                collaborationId,
            },
        }).code(201);
    }

    async deleteCollaborationHandler(request, h) {
        this._validator.ValidateCollaborationPayload(request.payload);
        const { id: credentialsId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialsId);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);

        return h.response({
            status: 'success',
            message: 'kolaborasi berhasil dihapus',
        }).code(200);
    }
}

module.exports = CollaborationsHandler;
