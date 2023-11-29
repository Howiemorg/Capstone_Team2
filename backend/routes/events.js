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
      `SELECT DISTINCT task_id FROM events where event_date = '${event_date}' AND task_id is NOT NULL;`
    );

    let current_tasks = pastDate.rows.map((row) => row.task_id);
    current_tasks = "(" + current_tasks.join(", ") + ")";

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

    const message = await runAlgo(selected_user, event_date, current_tasks);
    res.json({
      success: true,
      message: "Updated event successfully and regenerated schedule",
      output: current_tasks,
      message,
    });
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

router.get("/get-user-survey-events", async(req, res) => {
  const user_id = req.query.user_id;

  let currentDate = new Date();

  // Subtract 6 hours (in milliseconds) from the current time
  currentDate = new Date(currentDate.getTime() - (6 * 60 * 60 * 1000));
  let currentTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()
  currentDate = currentDate.toISOString().slice(0, 10);

  try {
    const result = await client.query(
      `SELECT * FROM events WHERE user_id = ${user_id} AND (event_date < '${currentDate}' OR (event_date = '${currentDate}' AND event_end_time <= '${currentTime}')) AND (user_survey IS NULL OR NOT user_survey) ORDER BY event_start_time ASC;`
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
})

router.put("/event-survey-results", async (req, res) => {
  const subtasks = req.body.subtasks;
  const task_id = req.query.task_id;
  let time_remaining =
    subtasks && subtasks.length ? 0 : req.query.estimate_completion_time;
  const event_block_id = req.query.event_block_id;
  const productivity_score = req.query.productivity_score;
  const event_start_time = req.query.event_start_time;
  const event_end_time = req.query.event_end_time;
  const user_id = req.query.user_id;
  const selected_date = req.query.selected_date;

  try {
    const result = await client.query(
      `UPDATE events SET user_survey = '1' WHERE event_block_id = ${event_block_id};`
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }

  if (!time_remaining) {
    time_remaining = await client.query(
      `SELECT estimate_completion_time FROM tasks WHERE task_id=${task_id}`
    );

    time_remaining = time_remaining.rows[0].estimate_completion_time;
  }

  const today = new Date(selected_date);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  let circadian_start_indx =
    parseInt(event_start_time.split(":")[0]) * 2 +
    (event_start_time.split(":")[1] != "00");
  const circadian_end_indx =
    parseInt(event_end_time.split(":")[0]) * 2 +
    (event_end_time.split(":")[1] != "00");

  try {
    for (const subtask of subtasks) {
      const { task_name: subtask_name, time_remaining: sub_time_remaining } =
        subtask;

      let subtask_completion_time = await client.query(
        `SELECT estimate_completion_time FROM subtasks WHERE task_id=${task_id} AND subtask_name=$1;`,
        [subtask_name]
      );

      subtask_completion_time =
        subtask_completion_time.rows[0].estimate_completion_time;

      const subtaskUpdateResult = await client.query(
        `
          UPDATE subtasks 
          SET estimate_completion_time = $1 
          ${
            subtask.time_remaining === 0
              ? `completion_date = ${today
                  .toISOString()
                  .substring(
                    0,
                    10
                  )} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
              : ""
          }
          WHERE task_id=${task_id} AND subtask_name=$2;`,
        [sub_time_remaining, subtask_name]
      );

      time_remaining =
        time_remaining - subtask_completion_time + parseInt(sub_time_remaining);
    }

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
        SET estimate_completion_time=${time_remaining}, completion_date='${today
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

    res.json({ success: true, time_remaining });
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

    const message = await runAlgo(
      user_id,
      selected_date,
      `(${task_id})`,
      regen_count,
      event_block_id
    );

    res.json({ success: true, message: message });
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

router.get("/get-done-event", async (req, res) => {
  const user_id = req.query.user_id;
  let currentDate = new Date();

  // Subtract 6 hours (in milliseconds) from the current time
  currentDate = new Date(currentDate.getTime() - (6 * 60 * 60 * 1000));
  // currentDate = currentDate.toISOString().slice(0, 15);
  const currentDateFormatted = currentDate.toISOString().split('T')[0].slice(0,15) 
  const currentTimeFormatted = currentDate.toISOString().split('T')[1].slice(0, 8);
  console.log(currentDateFormatted, currentTimeFormatted)
  try {
    const result = await client.query(`SELECT event_block_id, event_name FROM events WHERE event_date <= '${currentDateFormatted}' AND event_end_time <= '${currentTimeFormatted}' AND user_survey = false;`)
    res.json({ success: true, message: result.rows });
  } catch (err) {
    res.json({ success: false, message: err });
  }
});

module.exports = router;
