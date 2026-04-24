import mysql from 'mysql2/promise';
import { config } from './index.js';

const pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Parameterized queries only — no multi-statement.
    multipleStatements: false,
});

export default pool;