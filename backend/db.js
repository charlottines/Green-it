const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // TODO : Mettre le mot de passe de la connexion mysql
    database: 'Planty',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
