const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongService = require('./services/inMemory/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
    const songService = new SongService();
    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });

    await server.register({
        plugin: songs,
        options: {
            service: songService,
            validator: SongsValidator
        }
    });

    await server.start();
    console.log(`server is running on ${server.info.uri}`);
};

init();