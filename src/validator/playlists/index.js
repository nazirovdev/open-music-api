const { PostPlaylistSchema, PostSongToPlaylistSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
    ValidatePostPlaylistPayload: (payload) => {
        const validationError = PostPlaylistSchema.validate(payload);

        if (validationError.error) {
            throw new InvariantError(validationError.error.message);
        }
    },

    ValidatePostSongToPlaylistPayload: (payload) => {
        const validationError = PostSongToPlaylistSchema.validate(payload);

        if (validationError.error) {
            throw new InvariantError(validationError.error.message);
        }
    },
};

module.exports = PlaylistsValidator;
