const routes = (handler) => [
    {
        path: '/playlists/{id}/songs',
        method: 'POST',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'songs_app_jwt'
        }
    }
];

module.exports = routes;
