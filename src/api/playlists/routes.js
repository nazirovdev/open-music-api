const routes = (handler) => [
    {
        path: '/playlists',
        method: 'POST',
        handler: handler.PostPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        path: '/playlists',
        method: 'GET',
        handler: handler.GetPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        path: '/playlists/{id}',
        method: 'DELETE',
        handler: handler.DeletePlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        path: '/playlists/{id}/songs',
        method: 'POST',
        handler: handler.PostSongToPlaylistByOwnerHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        path: '/playlists/{id}/songs',
        method: 'GET',
        handler: handler.GetSongToPlaylistByOwnerHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        path: '/playlists/{id}/songs',
        method: 'DELETE',
        handler: handler.deleteAllSongToPlaylistByOwnerHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    }
];

module.exports = routes;
