const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { URL } = require('url');

dotenv.config();

const dbUrl = new URL(process.env.DB_URL);

const db= mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  port: dbUrl.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;