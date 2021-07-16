const routes = (handler) => [
    {
        path: '/playlists',
        method: 'POST',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'songs_app_jwt'
        }
    },
    {
        path: '/playlists',
        method: 'GET',
        handler: handler.getAllPlaylistHandler,
        options: {
            auth: 'songs_app_jwt'
        }
    },
    {
        path: '/playlists/{id}',
        method: 'DELETE',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'songs_app_jwt'
        }
    }
];

module.exports = routes;