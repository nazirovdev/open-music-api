require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
    const songService = new SongService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
    });

    await server.register({
        plugin: songs,
        options: {
            service: songService,
            validator: SongsValidator,
        },
    });

    await server.start();
    console.log(`server is running on ${server.info.uri}`);
};

init();
