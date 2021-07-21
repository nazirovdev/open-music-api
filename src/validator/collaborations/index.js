const { CollaborationPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
    ValidateCollaborationPayload: (payload) => {
        const validationError = CollaborationPayloadSchema.validate(payload);

        if (validationError.error) {
            throw new InvariantError(validationError.error.message);
        }
    }
};

module.exports = CollaborationsValidator;
