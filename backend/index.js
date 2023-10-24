const dotenv = require('dotenv').config();
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
app.get("/test-db", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM users");
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

const users = require('./routes/users.js');
app.use('/', users);

app.listen(port, function () {
    console.log("Server is running on port " + port);
});
