const routes = (handler) => [
    {
        path: '/collaborations',
        method: 'POST',
        handler: handler.postCollaborationHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        path: '/collaborations',
        method: 'DELETE',
        handler: handler.deleteCollaborationHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
