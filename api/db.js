const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'juanklzm_admin',
    password: 'Supernova1998#',
    database: 'juanklzm_blog',
});

module.exports = { db };