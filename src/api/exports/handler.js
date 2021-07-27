class ExportsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
    }

    async postExportSongsHandler(request, h) {
        this._validator.validateExportSongsPayload(request.payload);

        const { id: credentialsId } = request.auth.credentials;
        const { targetEmail } = request.payload;
        const { id: playlistId } = request.params;

        await this._service.verifyExportPlaylistOwner(playlistId, credentialsId);

        const message = {
            userId: credentialsId,
            targetEmail,
        };

        await this._service.sendMessages('export:songs', JSON.stringify(message));

        return h.response({
            status: 'success',
            message: 'Permintaan anda dalam antrean',
        }).code(201);
    }
}

module.exports = ExportsHandler;
