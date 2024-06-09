import mysql from 'mysql2'

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'juanklzm_admin',
    password: 'Supernova1998#',
    database: 'juanklzm_blog',
})
