exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },

        name: {
            type: 'TEXT',
            notNull: true
        },

        owner: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    });

    pgm.createConstraint('playlists', 'fk_owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('playlist');
};
