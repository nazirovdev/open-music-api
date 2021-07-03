const routes = require('./routes');
const SongHandler = require('./handler');

module.exports = {
    name: 'Open Song API',
    version: '1.0.0',
    register: async (server, { service }) => {
        const songHandler = new SongHandler(service);
        server.route(routes(songHandler));
    }
};