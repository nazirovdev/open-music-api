const { PostPlaylistSongSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistSongsValidator = {
    validatePostPlaylistSongPayload: (payload) => {
        const validationResult = PostPlaylistSongSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

module.exports = PlaylistSongsValidator;