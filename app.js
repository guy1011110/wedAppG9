const express = require("express");
const path = require('path');

const con = require("./config/db");
const app = express();
app.use("/public" ,express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//------login-------
app.post("/login", function (req, res) {
    const name = req.body.name;
    const password = req.body.password;
    const sql = "SELECT id,name,role FROM user WHERE name =? AND password = ?";

    con.query(sql, [name, password], function (err, results) {
        if (err) {
             res.status(500).send("Database error!!");
        }
        else if (results.length != 1) {
            
             res.status(401).send("Wrong username or password!!");
        }
        else{
             res.send('Successfully Login!!');
        }
       
    });
});

// ============= Root ==============
app.get("/", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/week09/login_template.html"));
});

const port = 3000;
app.listen(port, function () {
    console.log("Server is ready at " + port);
});