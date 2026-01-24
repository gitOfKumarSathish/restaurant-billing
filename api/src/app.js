import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http-status-codes';
import menuRoutes from './routes/menu.routes.js';

const { StatusCodes } = http;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res, next) => {
    res.status(StatusCodes.OK).json({ status: 'OK', message: 'API is healthy' });
});

app.use('/menu', menuRoutes);

export default app;