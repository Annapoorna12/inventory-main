const mysql2 = require('mysql2');
require('dotenv').config();

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ann@12345',
    database: 'inventorydb',
});

module.exports = db;
