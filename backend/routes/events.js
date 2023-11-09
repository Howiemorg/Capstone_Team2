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

// get all the events associated with userID and event date
router.get("/get-events", async (req, res) => {
    const user_id = req.query.user_id;
    const event_date = req.query.event_date;
    try {
        const result = await client.query(
            `SELECT * FROM events WHERE user_id = ${user_id} AND event_date = '${event_date}' ORDER BY event_start_time;`
        );
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

// get all the non-reccomended events associated with userID and event date
router.get("/get-set-events", async (req, res) => {
    const user_id = req.query.user_id;
    const event_date = req.query.event_date;
    try {
        const result = await client.query(
            `SELECT * FROM events WHERE user_id = ${user_id} AND event_date = '${event_date}' AND task_id is NULL ORDER BY event_start_time;`
        );
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});
// get all the recommended events assciated with user ID and event date
router.get("/get-recommended-events", async (req, res) => {
    const user_id = req.query.user_id;
    const event_date = req.query.event_date;
    try {
        const result = await client.query(
            `SELECT * FROM events WHERE user_id = ${user_id} AND event_date = '${event_date}' AND task_id is NOT NULL ORDER BY event_start_time;`
        );
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

// add black event
router.post("/add-black-event", async (req, res) => {
    const user_id = req.query.user_id;
    const event_name = req.query.event_name;
    const event_start_time = req.query.event_start_time;
    const event_end_time = req.query.event_end_time;
    const event_date = req.query.event_date;
    
    try {
        const result = await client.query(
            `INSERT INTO Events (user_id, event_name, event_start_time, event_end_time, event_date)
            VALUES (${user_id}, ${event_name}, ${event_start_time}, ${event_end_time}, ${event_date});`,
        );
        res.status(200).json({ success: true, message: "Registered event successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("An error occurred while registering the event.");
    }
});


module.exports = router;
