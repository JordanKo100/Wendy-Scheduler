import 'dotenv/config';

const required = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'MYSQL_HOST',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_DATABASE',
    'MONGODB_URI',
    'CORS_ORIGIN',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
}

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    corsOrigin: process.env.CORS_ORIGIN,

    mysql: {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },

    mongo: {
        uri: process.env.MONGODB_URI,
        db: process.env.MONGODB_DB || 'form',
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessTtl: process.env.JWT_ACCESS_TTL || '15m',
        refreshTtl: process.env.JWT_REFRESH_TTL || '7d',
    },

    cookie: {
        domain: process.env.COOKIE_DOMAIN || undefined,
        secure: process.env.NODE_ENV === 'production',
    },
};

export const isProd = config.env === 'production';