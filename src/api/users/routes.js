const routes = (handler) => [
    {
        path: '/users',
        method: 'POST',
        handler: handler.postUserHandler
    },
    {
        path: '/users/{id}',
        method: 'GET',
        handler: handler.getUserByIdHandler
    }
];

module.exports = routes;