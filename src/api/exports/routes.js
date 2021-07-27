const routes = (handler) => [
    {
        path: '/exports/playlists/{id}',
        method: 'POST',
        handler: handler.postExportSongsHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
