const mapSongById = (song) => (
    {
        id: song.id,
        title: song.title,
        year: parseInt(song.year),
        performer: song.performer,
        genre: song.genre,
        duration: parseInt(song.duration),
        insertedAt: song.insertedAt,
        updatedAt: song.updatedAt
    }
);

module.exports = {mapSongById};
