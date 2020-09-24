import express from 'express';
import morgan from 'morgan';
import socketio from 'socket.io';
import mysql from 'mysql2/promise';

const port = process.env.PORT || '4000';

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

const server = app.listen(port);

socketio(server).on('connect', function (socket) {
    console.debug(`Client ${socket.client.id} connected.`);
    socket.on('message', async function (message) {
        console.log('message', message);
        socket.broadcast.emit('message', message);
        const { username, text } = message;
        const conn = await mysql.createConnection({
            user: 'root',
            database: 'chat',
        });
        try {
            const [{ insertId: senderId }] = await conn.execute('insert ignore sender (name) values (?)', [username]);
            const [{ insertId: messageId }] = await conn.execute({
                sql: senderId
                    ? 'insert message (sender_id, text) values (:senderId, :message)'
                    : 'insert message (sender_id, text) values ((select id from sender where name = :username), :text)',
                namedPlaceholders: true,
            }, {
                senderId,
                text,
                username,
            });
            console.debug(`(id: ${messageId}, sender_id: ${senderId}, text: '${text}')`);
        }
        finally {
            await conn.end();
        }
    });
    socket.on('starttyping', function (message) {
        console.log('starttyping', message);
        socket.broadcast.emit('starttyping', message);
    });
    socket.on('stoptyping', function (message) {
        console.log('stoptyping', message);
        socket.broadcast.emit('stoptyping', message);
    });
});

