require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

//songs
const songs = require('./api/songs');
const SongService = require('./services/inMemory/SongsService');
const SongsValidator = require('./validator/songs');

//users
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
    const songService = new SongService();
    const userService = new UserService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: songs,
            options: {
                service: songService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: UsersValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        return response.continue || response;
    });

    await server.start();
    console.log(`server is running on ${server.info.uri}`);
};

init();
