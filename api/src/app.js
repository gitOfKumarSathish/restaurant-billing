import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http-status-codes';

const { StatusCodes } = http;

const app = express();

app.get('/health', (req, res, next) => {
    res.status(StatusCodes.OK).json({ status: 'OK', message: 'API is healthy' });
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;