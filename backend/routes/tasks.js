const get_available_intervals = require('../algo');

const dotenv = require("dotenv").config();
const express = require("express");
const pg = require("pg");
const router = express.Router();

const conString = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === "true",
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

router.post("/get-recommendations", async (req, res) => {
    const user_id = req.query.user_id;
    const selected_date = req.query.selected_date;
    try {
        // get all the tasks from DB
        const query = {
            text: "SELECT * FROM tasks WHERE user_id = $1 AND completion_date IS NULL AND task_start_date = $2",
            values: [user_id, selected_date],
        };
        let tasks = await client.query(query);
        tasks = tasks.rows;
        // get all the events from the DB
        let events = await client.query(
            `SELECT * FROM events WHERE user_id = ${user_id} AND event_date = '${selected_date}' ORDER BY event_start_time;`
        );
        events = events.rows;
        //get the circadian rhythm array
        let circadian_rhythm = await client.query(
            `SELECT circadian_rhythm from users WHERE user_id = ${user_id};`
        );
        circadian_rhythm = circadian_rhythm.rows[0]["circadian_rhythm"];

        //get empty intervals
        res.send(get_available_intervals(events));

        //success
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});
module.exports = router;
