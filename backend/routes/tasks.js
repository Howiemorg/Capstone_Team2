const dotenv = require('dotenv').config();
const express = require('express')
const pg = require('pg');
const router = express.Router()

const conString = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true',
};
var client = new pg.Client(conString);
client.connect();


// get all uncompleted events for a user
router.get("/get-uncompleted-tasks", async (req, res) => {
    const user_id = req.query.user_id;

    try {
        const query = {
            text: "SELECT * FROM tasks WHERE user_id = $1 AND completion_date IS NULL",
            values: [user_id],
        };

        const result = await client.query(query);
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

module.exports = router