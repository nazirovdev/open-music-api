const {
    PostAuthenticationSchema, PutAuthenticationSchema, DeleteAuthenticationSchema,
} = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validationResult = PostAuthenticationSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validatePutAuthenticationPayload: (payload) => {
        const validationResult = PutAuthenticationSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateDeleteAuthenticationPayload: (payload) => {
        const validationError = DeleteAuthenticationSchema.validate(payload);

        if (validationError.error) {
            throw new InvariantError(validationError.error.message);
        }
    },
};

module.exports = AuthenticationsValidator;
