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
            res.json({ success: true, message: "Login successful" });
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
    
    if (!email || !password || !firstname || !lastname) {
        res.json({ success: false, message: "All fields are required." });
        return;
    }

    try {
        const query = {
            text: "INSERT INTO \"users\" (user_first_name, user_last_name, user_email, user_password, circadian_rhythm) VALUES ($1, $2, $3, $4, {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,8,10,11,10,9,7,6,5,4.5,4.5,4.5,5,5.5,7,8.5,10,11,12,13,13.5,14,14,14,13,11,9,7,5,3,1})",
            values: [firstname, lastname, email, password],
        };

        const result = await client.query(query);

        res.json({ success: true, message: "User registered successfully." });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


module.exports = router