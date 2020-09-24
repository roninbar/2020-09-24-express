import express from 'express';
import morgan from 'morgan';

const port = process.env.PORT || '4000';

const app = express();

app.use(morgan('dev'));

app.listen(port);