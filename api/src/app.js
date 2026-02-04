import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http-status-codes';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';
import { ZodError } from 'zod';

const { StatusCodes } = http;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res, next) => {
    res.status(StatusCodes.OK).json({ status: 'OK', message: 'API is healthy' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Resource not found' });
});

// Error handler

app.use((err, req, res, next) => {
    if (err instanceof ZodError) {
        const list = err.issues || err.errors || [];
        return res.status(400).json({
            message: "Validation error",
            errors: list.map((e) => ({
                field: (e.path || []).join("."),
                message: e.message,
            })),
        });
    }

    console.error("❌ Error:", err);

    const status = err.statusCode || 500;
    return res.status(status).json({
        message: err.message || "Internal Server Error",
    });
});


export default app;