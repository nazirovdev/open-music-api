const amqp = require('amqplib');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class ProducerService {
    constructor() {
        this._pool = new Pool();
    }

    async sendMessages(queue, message) {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true,
        });

        await channel.sendToQueue(queue, Buffer.from(message));

        setTimeout(() => {
            connection.close();
        }, 1000);
    }

    async verifyExportPlaylistOwner(playlistId, owner) {
        const query = {
            text: 'SELECT id, owner FROM playlists WHERE id = $1 AND owner = $2',
            values: [playlistId, owner],
        };

        const result = await this._pool.query(query);

        if (result.rowCount < 1) {
            throw new AuthorizationError('Anda tidak berhak mengakes ini');
        }
    }
}

module.exports = ProducerService;
