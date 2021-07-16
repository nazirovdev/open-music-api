const Joi = require('joi');

const PostPlaylistSchema = Joi.object({
    name: Joi.string().required(),
});

module.exports = { PostPlaylistSchema };