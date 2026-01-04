// backend/src/db.js
const mysql = require('mysql2/promise'); // <--- MUST have /promise
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Important: Export the pool so server.js can see it
module.exports = pool;