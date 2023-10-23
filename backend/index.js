const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");

app.use(express.json());
app.use(cors());

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

const users = require('./routes/users.js');
app.use('/', users);

app.listen(port, function () {
    console.log("Server is running on port " + port);
});
