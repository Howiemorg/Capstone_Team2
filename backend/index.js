const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the origin you want to allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Adjust the HTTP methods you want to allow
  }));
  
const port = 3000;
const conString = {
    host: 'carpedm.postgres.database.azure.com',
    // Probably should not hard code your username and password.
    // But this works for now.
    user: 'main',
    password: 'factFood96!',
    database: 'carpedm',
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

var client = new pg.Client(conString);
client.connect();

// gets all the user table information
app.get("/test-db", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM users");
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

//validates the login information
app.get("/login-info", async (req, res) => {
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
app.post("/user-registration-info", async (req, res) => {
    const firstname = req.body.user_first_name;
    const lastname = req.body.user_last_name;
    const email = req.body.user_email;
    const password = req.body.user_password;

    if (!email || !password || !firstname || !lastname) {
        res.json({ success: false, message: "All fields are required." });
        return;
    }

    try {
        const query = {
            text: "INSERT INTO users (user_first_name, user_last_name, user_email, user_password) VALUES ($1, $2, $3, $4)",
            values: [firstname, lastname, email, password],
        };

        const result = await client.query(query);

        res.json({ success: true, message: "User registered successfully." });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.listen(port, function () {
    console.log("Server is running on port " + port);
});
