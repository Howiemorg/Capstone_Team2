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


// gets all the user table information
router.get("/test-db", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM users");
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

// gets user information based on user_id
router.get("/get-user-info", async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const result = await client.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

//validates the login information
router.get("/login-validation", async (req, res) => {
    const username = req.query.user_email;
    const password = req.query.user_password;

    if (!username || !password) {
        res.json({ success: false, message: "Username and password are required." });
        return;
    }

    try {
        const query = {
            text: "SELECT * FROM users WHERE user_email = $1 AND user_password = $2",
            values: [username, password],
        };

        const result = await client.query(query);

        if (result.rows.length > 0) {
            res.json({ success: true, message: "Login Successful", userID: result.rows[0].user_id  });
        } else {
            res.json({ success: false, message: "Invalid username or password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// adds user info during user registration process
router.post("/register-user", async (req, res) => {
    const firstname = req.query.user_first_name;
    const lastname = req.query.user_last_name;
    const email = req.query.user_email;
    const password = req.query.user_password;
    const wake_time = req.query.wake_time;
    const sleep_time = req.query.sleep_time;
    let circadian_rhythm =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,8,10,11,10,9,7,6,5,4.5,4.5,4.5,5,5.5,7,8.5,10,11,12,13,13.5,14,14,14,13,11,9,7,5,3,1]
    
    const hourPart = wake_time.replace(/'/g, '').split(':')[0];
    const minutesPart = wake_time.replace(/'/g, '').split(':')[1];

    // Convert to a number if needed
    const hour = parseInt(hourPart, 10);
    const minutes = parseInt(minutesPart, 10);

    // find the slice to put the beginning of the interval
    let beginningInterval = hour*2;
    if (minutes>=30){
        beginningInterval = beginningInterval+1
    }

    function shift_array(arr, shiftAmount) {
        const length = arr.length;
        const shift = shiftAmount % length;
        const shiftedArray = [...arr.slice(-shift), ...arr.slice(0, -shift)];
    
        return shiftedArray;
    }
    
    // Find the interval position from 9:00 am which is our base circadian_rhythm then shift array depending on value
    beginningInterval = beginningInterval - 18;
    let shifted_circadian_rhythm = []
    shifted_circadian_rhythm = shift_array(circadian_rhythm, beginningInterval);
    
    if (!email || !password || !firstname || !lastname) {
        res.json({ success: false, message: "All fields are required." });
        return;
    }

    try {
        const query = {
            text: 'INSERT INTO users (user_first_name, user_last_name, user_email, user_password, circadian_rhythm, wake_time, sleep_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
            values: [firstname, lastname, email, password, shifted_circadian_rhythm, wake_time, sleep_time],
          };
        const result = await client.query(query);

        res.json({ success: true, message: "User registered successfully.", userID: result.rows[0].user_id });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/update-user-wake-time", async (req, res) => {
    const { user_id, wake_time } = req.query;

    try {
        
        const wakeTimeParts = wake_time.replace(/'/g, '').split(':')
        let wakeDate = new Date();
        wakeDate.setHours(parseInt(wakeTimeParts[0]), parseInt(wakeTimeParts[1]), 0);
        wakeDate.setHours(wakeDate.getHours() - 6);
        let sleepDate = new Date(wakeDate);
        sleepDate.setHours(sleepDate.getHours() - 8);

        let circadian_rhythm =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,8,10,11,10,9,7,6,5,4.5,4.5,4.5,5,5.5,7,8.5,10,11,12,13,13.5,14,14,14,13,11,9,7,5,3,1]
    
        const hourPart = wakeTimeParts[0];
        const minutesPart = wakeTimeParts[1];

        
        const hour = parseInt(hourPart, 10);
        const minutes = parseInt(minutesPart, 10);
        
        let beginningInterval = hour*2;
        if (minutes>=30){
            beginningInterval = beginningInterval+1
        }

        function shift_array(arr, shiftAmount) {
            const length = arr.length;
            const shift = shiftAmount % length;
            const shiftedArray = [...arr.slice(-shift), ...arr.slice(0, -shift)];
        
            return shiftedArray;
        }
        beginningInterval = beginningInterval - 18;
        let shifted_circadian_rhythm = []
        shifted_circadian_rhythm = shift_array(circadian_rhythm, beginningInterval);

        
        const sleepTimeFormatted = sleepDate.toISOString().split('T')[1].substr(0, 8);
        const shift_query = 'UPDATE users SET circadian_rhythm = $1 WHERE user_id = $2';
        await client.query(shift_query, [shifted_circadian_rhythm, user_id]);
        const query = 'UPDATE users SET wake_time = $1, sleep_time = $2 WHERE user_id = $3';
        await client.query(query, [wake_time, sleepTimeFormatted, user_id]);
        
        res.status(200).send('Wake time and sleep time updated successfully');
    } catch (error) {
        console.error('Error updating wake and sleep time', error);
        res.status(500).send('Error updating wake and sleep time');
    }
});

router.post("/increment-user-login", async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const query = {
          text: 'UPDATE user_weekly_metrics SET num_login_count = num_login_count + 1 WHERE user_id=$1 RETURNING num_login_count',
          values: [user_id],
        };
        const result = await client.query(query);
        res.status(200).send(result.rows);
    } catch (error) {
        console.error('Error updating num_login_count', error);
        res.status(500).send('Error updating num_login_count');
    }
  });

  router.get("/get-total-reschedule", async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const query = {
          text: 'UPDATE user_weekly_metrics SET num_reschedule = (SELECT SUM(regen_count) FROM events WHERE user_id = $1) WHERE user_id = $1 RETURNING num_reschedule;',
          values: [user_id],
        };
        const result = await client.query(query);
        res.send(result.rows);
    } catch (error) {
        console.error('Error getting total reschedule count', error);
        res.status(500).send('Error total reschedule count');
    }
  });

  router.get("/get-weekly-login-metrics", async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const query = {
          text: 'SELECT * FROM user_weekly_metrics WHERE user_id=$1;',
          values: [user_id],
        };
        const result = await client.query(query);
        res.send(result.rows);
    } catch (error) {
        console.error('Error getting weekly metrics', error);
        res.status(500).send('Error getting weekly metrics');
    }
  });

module.exports = router