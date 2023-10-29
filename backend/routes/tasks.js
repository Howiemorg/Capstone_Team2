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

module.exports = router