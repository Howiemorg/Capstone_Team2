const express = require("express");
const app = express();
const pg = require("pg");

app.use(express.json());

const port = 3001;
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


// var conString =
//     "postgresql://postgres:lvMbqbHzSrLylqXptoul@containers-us-west-183.railway.app:7302/railway";
var client = new pg.Client(conString);
client.connect();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM users");
        res.send(result.rows);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

// app.get("/authenticate", async (req, res) => {
//     console.log(req.body);
//     const myUser = req.body.username;
//     const result = await client.query(
//         `SELECT * FROM users WHERE username = '${myUser}'`
//     );
//     console.log(result.rows);
//     return
// });

app.listen(port, function () {
    console.log("Server is running on port " + port);
});
