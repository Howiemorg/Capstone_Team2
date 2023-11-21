const algorithm = require("../algo");
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

//add tasks for now
router.post("/add-tasks", async (req, res) => {
  const user_id = req.query.user_id;
  const task_name = req.query.task_name;
  const task_start_date = req.query.task_start_date;
  const task_due_date = req.query.task_due_date;
  const priority_level = req.query.priority_level;
  const estimate_completion_time = req.query.estimate_completion_time;
  // const priority_level = calculatePriorityLevel(estimate_completion_time, task_due_date, task_start_date);
  try {
    const result = await client.query(
      `INSERT INTO Tasks (user_id, task_name, task_start_date, task_due_date, progress_percent, priority_level, estimate_completion_time)
            VALUES (${user_id}, ${task_name}, ${task_start_date}, ${task_due_date}, 0, ${priority_level}, ${estimate_completion_time});`
    );
    res.json({ success: true, message: "registered task succesfully" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});





// get an entire template row from the template table based on template-id
router.get("/get-template", async (req, res) => {
  const template_id = req.query.template_id;
  // console.log("Received template_id:", template_id);
  try {
    const result = await client.query(
      `SELECT * FROM templates WHERE template_id = ${template_id};`
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

// get steps array of a template row based on template-id
router.get("/get-template-steps", async (req, res) => {
  const template_id = req.query.template_id;
  // console.log("Received template_id:", template_id);
  try {
    const result = await client.query(
      `SELECT steps FROM templates WHERE template_id = ${template_id};`
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

// get steps array of a template row based on template-id
router.post("/post-template-steps", async (req, res) => {
  // const template_id = req.query.template_id;
  const user_id = req.query.user_id;
  let task_name = req.query.task_name;
  const task_start_date = req.query.task_start_date;
  const task_due_date = req.query.task_due_date;
  // const priority_level = req.query.priority_level;
  let priority_level = req.query.priority_level;

  // Convert 'NULL' string to actual null
  if (priority_level === 'NULL') {
    priority_level = null;
  }

  let estimate_completion_time = req.query.estimate_completion_time;
  // console.log("Received template_id:", template_id);
  try {
    const result = await client.query(
      `SELECT steps FROM templates WHERE template_id = ${1};`
    );
    // res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    // res.send(err.message);
  }

  const result = await client.query(
    `SELECT steps FROM templates WHERE template_id = ${1};`
  );
  // fuchi = result;

  // let tasksArray = fuchi.map(taskData => {
  //   return {
  //     task_name: taskData[0],  // Assuming the first element is the task name
  //     estimate_completion_time: taskData[1]  // Assuming the second element is the estimated completion time
  //     // Add other task properties here if they exist
  //   };
  // });

  let tasksArray = [];

if (result.rows && result.rows.length > 0) {
  // Assuming each row's 'steps' column is an array of task data
  const stepsArray = result.rows[0].steps; // Get the steps array from the first row

  tasksArray = stepsArray.map(taskData => {
    return {
      task_name: taskData[0],  // Assuming the first element is the task name
      estimate_completion_time: taskData[1]  // Assuming the second element is the estimated completion time
      // Add other task properties here if they exist
    };
  });
}

// Now 'tasksArray' is an array of task objects
console.log(tasksArray);
  
  // // Now 'tasksArray' is an array of task objects
  // console.log(tasksArray);


  // Loop through tasksArray and insert each task into the database
for (const task of tasksArray) {
  try {
    const insertQuery = `INSERT INTO Tasks (user_id, task_name, task_start_date, task_due_date, progress_percent, priority_level, estimate_completion_time)
        VALUES ($1, $2, $3, $4, 0, $5, $6)`;
    // Replace these values with actual values you want to insert, e.g., task.task_name
    await client.query(insertQuery, [user_id, task.task_name, task.task_start_date, task.task_due_date, task.priority_level, task.estimate_completion_time]);
  } catch (err) {
    console.log(err.message);
    // Handle the error, e.g., log it, send a response back, etc.
  }
}

// Send a response back indicating success
res.json({ success: true, message: "Tasks registered successfully" });
  
});




// get all uncompleted events for a user
router.get("/get-uncompleted-tasks", async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const query = {
      text: "SELECT * FROM tasks WHERE user_id = $1 AND completion_date IS NULL ORDER BY task_due_date",
      values: [user_id],
    };

    const result = await client.query(query);
    res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

// get event associated with a single event_block_id
router.get("/get-single-task", async (req, res) => {
    const task_id = req.query.task_id;
    try {
      const result = await client.query(
        `SELECT * FROM tasks WHERE task_id = ${task_id};`
      );
      res.send(result.rows);
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  });

router.delete("/delete-task", async (req, res) => {
  const task_id = req.query.task_id;

  try {
    const result = await client.query(
      `DELETE FROM events WHERE task_id = ${task_id};
            DELETE FROM tasks WHERE task_id = ${task_id};`
    );
    res.json({
      success: true,
      message: "Deleted task and events associated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.send(err.message);
  }
});

router.put("/update-task", async (req, res) => {
  const task_id = req.query.task_id;
  const task_name = req.query.task_name;
  const task_start_date = req.query.task_start_date;
  const task_due_date = req.query.task_due_date;
  const estimate_completion_time = req.query.estimate_completion_time;
  const priority_level = req.query.priority_level;
  const progress_percent = req.query.progress_percent;

  try {
    const result = await client.query(
      `UPDATE Tasks
            SET
              task_name = ${task_name},
              task_start_date = ${task_start_date},
              task_due_date = ${task_due_date},
              progress_percent = ${progress_percent},
              priority_level = ${priority_level},
              estimate_completion_time = ${estimate_completion_time}
            WHERE
              task_id = ${task_id};`
    );
    res.json({ success: true, message: "updated task succesfully" });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

const insertEvents = (data) => {
  const query = {
    text: "INSERT INTO Events (event_name, event_start_time, event_end_time, user_id, task_id, work_done_pct, event_date, priority_level, regen_count, max_reschedule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    values: [
      data[0],
      data[1],
      data[2],
      data[3],
      data[4],
      0,
      data[5],
      data[6],
      0,
      0,
    ],
  };

  return query;
};

const runAlgo = async (user_id, selected_date, selected_tasks, regen_count=0, event_block_id=0) => {
  // get all the tasks from DB
  try {
    const query = {
      text: `SELECT * FROM tasks WHERE user_id = ${user_id} AND completion_date IS NULL AND task_id IN ${selected_tasks};`,
    };
    let tasks = await client.query(query);
    tasks = tasks.rows;
    // get all the events from the DB
    let events = await client.query(
      `SELECT * FROM events WHERE user_id = ${user_id} AND event_date >= '${selected_date}' ORDER BY event_start_time;`
    );
    events = events.rows;

    console.log(events);
    //get the circadian rhythm array
    let circadian_rhythm = await client.query(
      `SELECT circadian_rhythm from users WHERE user_id = ${user_id};`
    );
    circadian_rhythm = circadian_rhythm.rows[0]["circadian_rhythm"];

    const eventQuerys = algorithm(
      events,
      tasks,
      circadian_rhythm,
      regen_count,
      selected_date
    );
    // console.log(eventQuerys)
    if(regen_count){
        const query = {
            text: "UPDATE events SET event_start_time = $1, event_end_time = $2 WHERE event_block_id = $3",
            values: [
                eventQuerys[0][1],
                eventQuerys[0][2],
                event_block_id
            ],
          };
        const results = await client.query(query);
    } else {
    // for (const query of eventQuerys) {
    //   const insertQuery = insertEvents(query);
    //   console.log(query);
    //   console.log(insertQuery);
    //   let results = await client.query(insertQuery);
    // }
    }
    return eventQuerys;
  } catch (err) {
    return err;
  }
};

router.post("/get-recommendations", async (req, res) => {
  const user_id = req.query.user_id;
  const selected_date = req.query.selected_date;
  const selected_tasks = req.query.selected_tasks;
  try {
    const message = await runAlgo(user_id, selected_date, selected_tasks);

    res.json({ success: true, message: message });
  } catch (err) {
    res.json({ success: false, message: err });
  }
});
// getrec()

// get all uncompleted events for a user
router.get("/get-due-tasks", async (req, res) => {
  const user_id = req.query.user_id;
  const currentDate = new Date().toISOString().slice(0,10);

  try {
    const query = {
      text: "SELECT * FROM tasks WHERE user_id = $1 AND completion_date IS NULL AND $2 < task_due_date ORDER BY task_due_date;",
      values: [user_id,currentDate],
    };

    const result = await client.query(query);
    res.send(result.rows);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

module.exports = [router, runAlgo];
