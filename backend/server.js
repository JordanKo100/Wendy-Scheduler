import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { config, isProd } from './config/index.js';
import connectMongo from './config/db_mongo.js';
import authRoutes from './routes/auth_routes.js';
import bookingRoutes from './routes/booking_routes.js';

const app = express();

// Behind a reverse proxy (nginx, Cloudflare, etc.) in prod.
if (isProd) app.set('trust proxy', 1);

app.use(helmet());
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true, // allow refresh cookie
    }),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Health check — useful for load balancers and uptime monitoring.
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/reservations', bookingRoutes);

// 404
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

// Central error handler — never leaks stack traces in prod.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        message: isProd ? 'Internal error' : err.message,
    });
});

async function start() {
    await connectMongo();
    app.listen(config.port, () =>
        console.log(`✅ Server on :${config.port} (${config.env})`),
    );
}

start();