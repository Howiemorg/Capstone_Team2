const dotenv = require("dotenv").config();
const express = require("express");
const pg = require("pg");
const router = express.Router();
const runAlgo = require("./tasks")

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

// add set event
router.post("/add-set-event", async (req, res) => {
  const user_id = req.query.user_id;
  const event_name = req.query.event_name;
  const event_start_time = req.query.event_start_time;
  const event_end_time = req.query.event_end_time;
  const event_date = req.query.event_date;

  try {
    const result = await client.query(
      `INSERT INTO Events (user_id, event_name, event_start_time, event_end_time, event_date)
            VALUES (${user_id}, ${event_name}, ${event_start_time}, ${event_end_time}, ${event_date});`
    );
    res.json({ success: true, message: "Registered event successfully" });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

router.delete("/delete-set-event", async (req, res) => {
  const event_block_id = req.query.event_block_id;

  try {
    const result = await client.query(
      `DELETE FROM events WHERE event_block_id = ${event_block_id};`
    );
    res.json({ success: true, message: "Deleted event successfully" });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

router.put("/update-set-event", async (req, res) => {
  const event_block_id = req.query.event_block_id;
  const event_name = req.query.event_name;
  const event_start_time = req.query.event_start_time;
  const event_end_time = req.query.event_end_time;
  const event_date = req.query.event_date;

  try {
    const result = await client.query(
      `UPDATE Events
            SET
              event_name = ${event_name},
              event_start_time = ${event_start_time},
              event_end_time = ${event_end_time},
              event_date = ${event_date}
            WHERE
            event_block_id = ${event_block_id};`
    );
    res.json({ success: true, message: "Updated event successfully" });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

router.put("/event-survey-results", async (req, res) => {
  const time_remaining = req.query.time_remaining;
  const event_block_id = req.query.event_block_id;
  const task_id = req.query.task_id;
  const productivity_score = req.query.productivity_score;
  const event_start_time = req.query.event_start_time;
  const event_end_time = req.query.event_end_time;
  const user_id = req.query.user_id;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const circadian_start_indx =
    parseInt(event_start_time.substring(0, 2)) * 2 +
      event_start_time.substring(3, 5) !=
    "00";
  const circadian_end_indx =
    parseInt(event_end_time.substring(0, 2)) * 2 +
      event_end_time.substring(3, 5) !=
    "00";

  try {
    if (parseInt(productivity_score) === 1) {
      for (
        ;
        circadian_start_indx <= circadian_end_indx;
        circadian_start_indx++
      ) {
        const curr_score = await client.query(
          `(SELECT circadian_rhythm[${circadian_start_indx}] FROM users)`
        );
        if (curr_score - 1.6 < 0.1) {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx}]=0.1'
          WHERE user_id=${user_id}`);
        } else {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx}]=${curr_score - 1.6}'
          WHERE user_id=${user_id}`);
        }
      }
    } else if (parseInt(productivity_score) === 3) {
      for (
        ;
        circadian_start_indx <= circadian_end_indx;
        circadian_start_indx++
      ) {
        const curr_score = await client.query(
          `(SELECT circadian_rhythm[${circadian_start_indx}] FROM users)`
        );
        if (curr_score + 1.6 > 16) {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx}]=16'
          WHERE user_id=${user_id}`);
        } else {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx}]=${curr_score + 1.6}'
          WHERE user_id=${user_id}`);
        }
      }
    }

    if (parseInt(time_remaining) == 0) {
      const taskUpdateResult = await client.query(`
        UPDATE tasks 
        SET etimate_completion_time=${time_remaining}, completion_date='${today.getFullYear()}-${today.getMonth()}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}'
        WHERE task_id=${task_id}`);

        if(parseInt(productivity_score) === 2){
          const deleteResult = await client.query(
            `DELETE FROM Events
                  WHERE
                  event_block_id = ${event_block_id};`
          );

          res.json({ success: true, message: "Survey update successful" });
        }
    }

    const deleteResult = await client.query(
      `DELETE FROM Events
            WHERE
            event_block_id = ${event_block_id} OR event_date >= '${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}'::date;`
    );

    const taskUpdateResult = await client.query(`
        UPDATE tasks 
        SET etimate_completion_time=${time_remaining}, task_start_date='${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()} 00:00:00'
        WHERE task_id=${task_id}`);

    const tasks = await client.query(`SELECT * FROM tasks WHERE task_id IN (SELECT task_id FROM events WHERE event_date >= '${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}'::date);`)

    runAlgo(user_id, `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()} 00:00:00`, tasks.rows)

    res.json({ success: true, message: "Updated event successfully" });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

module.exports = router;
