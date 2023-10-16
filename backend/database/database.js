import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getNotes(){
    const [rows] = await pool.query("SELECT * FROM user")
    return rows
}

async function getNote(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM user
    WHERE id = ?
    `, [id])
    return rows[0]
}

// async function createNote(title, content) {
//     const result  = await pool.query(`
//     INSERT INTO user (title, content)
//     VALUES (?, ?)    
//     `, [title, content])
// }

const note = await getNote(1)
console.log(note)

// const result = 