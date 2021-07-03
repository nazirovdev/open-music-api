const routes = (handler) => [
    {
        path: '/songs',
        method: 'POST',
        handler: handler.postSongsHandler
    },
    {
        path: '/songs',
        method: 'GET',
        handler: handler.getSongsHandler
    },
    {
        path: '/songs/{id}',
        method: 'GET',
        handler: handler.getSongByIdHandler
    }
];

module.exports = routes;