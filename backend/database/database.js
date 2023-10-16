import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// retrieving from database
export async function getNotes(){
    const [rows] = await pool.query("SELECT * FROM user")
    return rows
}

export async function getNote(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM user
    WHERE id = ?
    `, [id])
    return rows[0]
}

// get first index
const note = await getNote(1)
// console.log(note)

// get all indexes
const bean = await getNotes()
console.log(bean)

export async function createNote(user_first_name, user_last_name, user_email, user_password, is_admin) {
    const result  = await pool.query(`
    INSERT INTO user (user_first_name, user_last_name, user_email, user_password, is_admin)
    VALUES (?, ?, ?, ?, ?)    
    `, [user_first_name, user_last_name, user_email, user_password, is_admin])
    const id = result.insertId
    return getNote(id)
}

// const result = await createNote('Ibrahim', 'Semary', '1234@email.com', '1234', '1')
// console.log(result)