const algorithm = require('../algo');
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

function calculatePriorityLevel(estimate_completion_time, task_due_date, task_start_date){
    // Calculates the days left and always rounds up to get whole day
    const due_date = new Date(task_due_date.substring(0, 10));
    due_date.setDate(due_date.getDate() + 1);
    const start_date = new Date(task_start_date.substring(0, 10));
    start_date.setDate(start_date.getDate() + 1);
    const msPerDay = 24 * 60 * 60 * 1000; 
    let daysLeft = Math.ceil((due_date.getTime() - start_date.getTime()) / msPerDay);
    // Priority Levels follows the guidelines we decided
    if(estimate_completion_time/daysLeft < 30 && daysLeft>=7){
        //BLUE
        return (1)
    }
    else if(estimate_completion_time/daysLeft < 60 && daysLeft>=5){
        //GREEN
        return (2)
    }
    else if(estimate_completion_time/daysLeft < 120 && daysLeft>=3){
        //ORANGE
        return (3)
    }
    else if(estimate_completion_time/daysLeft > 120 || daysLeft<=2){
        //RED
        return (4)
    }
    return 0;
}

//add tasks for now
router.post("/add-tasks", async (req, res) => {
    const user_id = req.query.user_id;
    const task_name = req.query.task_name;
    const task_start_date = req.query.task_start_date;
    const task_due_date = req.query.task_due_date;
    const estimate_completion_time =
        req.query.estimate_completion_time;
    const priority_level = calculatePriorityLevel(estimate_completion_time, task_due_date, task_start_date);
    
    try {
        const result = await client.query(
            `INSERT INTO Tasks (user_id, task_name, task_start_date, task_due_date, progress_percent, priority_level, estimate_completion_time)
            VALUES (${user_id}, ${task_name}, ${task_start_date}, ${task_due_date}, 0, ${priority_level}, ${estimate_completion_time});`
        );
        res.json({success: true, message: "registered task succesfully"});
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
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

const insertEvents = (data) =>{
    // task_name, best_time_start, best_time_end, user_id, task_id, curr_day, priority_level
    // const query = {
    //   text: "INSERT INTO Events (event_name, event_start_time, event_end_time, user_id, task_id, work_done_pct, event_date, priority_level, regen_count, max_reschedule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    //   values: [
    //     task_name,
    //     best_time_start,
    //     best_time_end,
    //     user_id,
    //     task_id,
    //     0,
    //     curr_day,
    //     priority_level,
    //     0,
    //     0,
    //   ],
    // };
    
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
    
  }
  router.post("/get-recommendations", async (req, res) => {
    const user_id = req.query.user_id;
    const selected_date = req.query.selected_date;
    let selected_tasks = req.query.selected_tasks;
    // let selected_tasks = "[0,1,2,3,4]";
    // selected_tasks = JSON.parse(selected_tasks);

    // const user_id = 1;
    // const selected_date = "2023-10-31 00:00:00"
    // // const selected_date2 = '2023-10-31'
    // const selected_tasks = '(8,9)';
    try {
        // get all the tasks from DB
        const query = {
            text: `SELECT * FROM tasks WHERE user_id = $1 AND completion_date IS NULL AND task_id IN ${selected_tasks};`,
            values: [user_id],
        };
        let tasks = await client.query(query);
        tasks = tasks.rows;
        console.log(tasks)
        // get all the events from the DB
        let events = await client.query(
            `SELECT * FROM events WHERE user_id = ${user_id} AND event_date >= '${selected_date}' ORDER BY event_start_time;`
        );
        events = events.rows;
        console.log(events)
        //get the circadian rhythm array
        let circadian_rhythm = await client.query(
            `SELECT circadian_rhythm from users WHERE user_id = ${user_id};`
        );
        circadian_rhythm = circadian_rhythm.rows[0]["circadian_rhythm"];
        
        const eventQuerys = algorithm(events, tasks, circadian_rhythm, 0, selected_date);
        // console.log(eventQuerys)
        // for( const query of eventQuerys){
        //     const insertQuery = insertEvents(query)
        //     console.log(query)
        //     console.log(insertQuery)
        //     let results = await client.query(insertQuery);
        // }
        //get empty intervals
        // res.send(get_available_intervals(events));
        res.json({success: true, message: events});
        res.send("success");
        //success
    } catch (err) {
        console.log(err.message);
        // res.send(err.message);
    }
})
// getrec()
module.exports = router
