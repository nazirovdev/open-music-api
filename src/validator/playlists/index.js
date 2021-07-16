const { PostPlaylistSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistValidator = {
    validatePostPlaylistPayload: (payload) => {
        const validationError = PostPlaylistSchema.validate(payload);

        if (validationError.error) {
            throw new InvariantError(validationError.error.message);
        }
    }
};

module.exports = PlaylistValidator;