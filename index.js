import express from 'express';
import morgan from 'morgan';
import socketio from 'socket.io';

const port = process.env.PORT || '4000';

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

const server = app.listen(port);

socketio(server).on('connect', function (socket) {
    console.debug(`Client ${socket.client.id} connected.`);
    socket.on('message', function (message) {
        console.log('message', message);
        socket.broadcast.emit('message', message);
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

