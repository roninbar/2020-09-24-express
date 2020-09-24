import express from 'express';
import morgan from 'morgan';
import socketio from 'socket.io';

const port = process.env.PORT || '4000';

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

socketio(app.listen(port)).on('connect', function (socket) {
    socket.on('chat', function (message) {
        console.log(message);
    });
});

