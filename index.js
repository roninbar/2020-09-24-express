import express from 'express';
import morgan from 'morgan';
import socketio from 'socket.io';
import { insertMessage } from './dal/message.js';

const port = process.env.PORT || '4000';

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

const server = app.listen(port);

socketio(server).on('connect', function (socket) {
    console.debug(`Client ${socket.client.id} connected.`);
    socket.on('message', async function ({ username, text }) {
        console.log('message', { username, text });
        socket.broadcast.emit('message', { username, text });
        await insertMessage(username, text);
    });
    socket.on('typing', function (message) {
        console.log('typing', message);
        socket.broadcast.emit('typing', message);
    });
    socket.on('stoptyping', function (message) {
        console.log('stoptyping', message);
        socket.broadcast.emit('stoptyping', message);
    });
});

