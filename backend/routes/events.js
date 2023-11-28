const runAlgo = require("./tasks")[1];
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

// get event associated with a single event_block_id
router.get("/get-single-event", async (req, res) => {
  const event_block_id = req.query.event_block_id;
  try {
    const result = await client.query(
      `SELECT * FROM events WHERE event_block_id = ${event_block_id};`
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

    const pastDate = await client.query(
      `SELECT task_id FROM events where event_date = '${event_date}' AND task_id is NOT NULL;`
    );

    let current_tasks = pastDate.rows.map(row => row.task_id);
    current_tasks = '(' + current_tasks.join(', ') + ')';
    
    const result = await client.query(
      `UPDATE Events
            SET
              event_name = ${event_name},
              event_start_time = ${event_start_time},
              event_end_time = ${event_end_time},
              event_date = '${event_date}'
            WHERE
            event_block_id = ${event_block_id}
            RETURNING user_id;`
    );

    selected_user = result.rows[0]["user_id"];
    
    const dropEvents = await client.query(
      `DELETE FROM events where event_date = '${event_date}' and task_id is NOT NULL;`
    );

    const message = await runAlgo(
      selected_user,
      event_date,
      current_tasks
    );
    res.json({ success: true, message: "Updated event successfully and regenerated schedule", output: current_tasks, message });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

router.delete("/cancel-recommended-event", async (req, res) => {
  const event_block_id = req.query.event_block_id;
  const task_id = req.query.task_id;
  const selected_date = req.query.selected_date;
  const user_id = req.query.user_id;

  const today = new Date(selected_date);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  try {
    const deleteResult = await client.query(
      `DELETE FROM Events
          WHERE
          (task_id = ${task_id} AND event_date >= '${today
        .toISOString()
        .substring(0, 10)}'::date) OR event_block_id=${event_block_id};`
    );

    const taskUpdateResult = await client.query(`
        UPDATE tasks 
        SET task_start_date='${tomorrow
          .toISOString()
          .substring(0, 10)} 00:00:00'
        WHERE task_id=${task_id}`);

    const message = await runAlgo(
      user_id,
      `${tomorrow.toISOString().substring(0, 10)} 00:00:00`,
      `(${task_id})`
    );

    res.json({ success: true, message: message });
  } catch (err) {
    console.error(err.message);
    res.json({ error: err.message });
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
  const selected_date = req.query.selected_date;

  const today = new Date(selected_date);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  let circadian_start_indx =
    parseInt(event_start_time.substring(0, 2)) * 2 +
    (event_start_time.substring(3, 5) != "00");
  const circadian_end_indx =
    parseInt(event_end_time.substring(0, 2)) * 2 +
    (event_end_time.substring(3, 5) != "00");

  try {
    if (parseInt(productivity_score) === 1) {
      for (
        ;
        circadian_start_indx < circadian_end_indx;
        circadian_start_indx++
      ) {
        let curr_score = await client.query(
          `SELECT circadian_rhythm[${
            circadian_start_indx + 1
          }] FROM users WHERE user_id=${user_id};`
        );
        curr_score = curr_score.rows[0].circadian_rhythm;
        if (curr_score - 1.6 < 0.1) {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx + 1}]=0.1
          WHERE user_id=${user_id};`);
        } else {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx + 1}]=${(
            curr_score - 1.6
          ).toFixed(1)}
          WHERE user_id=${user_id};`);
        }
      }
    } else if (parseInt(productivity_score) === 3) {
      for (
        ;
        circadian_start_indx < circadian_end_indx;
        circadian_start_indx++
      ) {
        let curr_score = await client.query(
          `SELECT circadian_rhythm[${
            circadian_start_indx + 1
          }] FROM users WHERE user_id=${user_id};`
        );
        curr_score = curr_score.rows[0].circadian_rhythm;
        if (curr_score + 1.6 > 16) {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx + 1}]=16
          WHERE user_id=${user_id};`);
        } else {
          const taskUpdateResult = await client.query(`
          UPDATE users 
          SET circadian_rhythm[${circadian_start_indx + 1}]=${(
            curr_score + 1.6
          ).toFixed(1)}
          WHERE user_id=${user_id};`);
        }
      }
    }

    if (parseInt(time_remaining) == 0) {
      const taskUpdateResult = await client.query(`
        UPDATE tasks 
        SET estimate_completion_time=${time_remaining}, completion_date='${tomorrow
        .toISOString()
        .substring(
          0,
          10
        )} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}'
        WHERE task_id=${task_id}`);

      if (parseInt(productivity_score) === 2) {
        const deleteResult = await client.query(
          `DELETE FROM Events
                  WHERE
                  event_block_id = ${event_block_id};`
        );

        res.json({ success: true, message: "Survey update successful" });
      }
    }

    const taskUpdateResult = await client.query(`
        UPDATE tasks 
        SET estimate_completion_time=${time_remaining}, task_start_date='${tomorrow
      .toISOString()
      .substring(0, 10)} 00:00:00'
        WHERE task_id=${task_id}`);

    const tasks = await client.query(
      `SELECT * FROM tasks WHERE task_id IN (SELECT task_id FROM events WHERE event_date >= '${tomorrow
        .toISOString()
        .substring(0, 10)}'::date);`
    );

    const deleteResult = await client.query(
      `DELETE FROM Events
            WHERE
            event_block_id = ${event_block_id} OR event_date >= '${tomorrow
        .toISOString()
        .substring(0, 10)}'::date;`
    );

    let task_ids = "(" + tasks.rows[0].task_id;

    for (let i = 1; i < tasks.rowCount; ++i) {
      task_ids += "," + tasks.rows[i].task_id;
    }

    task_ids += ")";

    const message = await runAlgo(
      user_id,
      `${tomorrow.toISOString().substring(0, 10)} 00:00:00`,
      task_ids
    );

    res.json({ success: true, message: message });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

  router.put("/reschedule-event", async (req, res) => {
    const event_block_id = req.query.event_block_id;
    const user_id = req.query.user_id;
    const selected_date = req.query.selected_date;
    const task_id = req.query.task_id;
  try {
    let regen_count = await client.query(
        `UPDATE events
        SET regen_count = regen_count + 1
        WHERE event_block_id = ${event_block_id}
        RETURNING regen_count;`
    );
    regen_count = regen_count.rows[0]["regen_count"];
    
    const message = await runAlgo(user_id, selected_date, `(${task_id})`, regen_count, event_block_id);

    res.json({ success: true, message: message });
  } catch (err) {
    res.json({ success: false, message: err });
  }
  });

module.exports = router;
