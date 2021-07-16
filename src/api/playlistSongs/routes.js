const routes = (handler) => [
    {
        path: '/playlists/{id}/songs',
        method: 'POST',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'songs_app_jwt'
        }
    },
    {
        path: '/playlists/{id}/songs',
        method: 'GET',
        handler: handler.getPlaylistSongHandler,
        options: {
            auth: 'songs_app_jwt'
        }
    }
];

module.exports = routes;
