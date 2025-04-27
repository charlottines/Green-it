const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'hopper.proxy.rlwy.net',
    user: 'root',
    password: 'OawidbSWXrkFGRtzXHpjgfSqczqyglcF',
    database: 'Planty',
    port: 44431,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
