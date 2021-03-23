const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const passwordHash = require('password-hash');
const app = express();


app.use(bodyParser.urlencoded({extended: true}));

// Create Connection
const db = mysql.createConnection({
    host:"host.docker.internal",
    user:"root",
    password:"123456",
    database:"users",
    multipleStatements: true,
});

// Connect
db.connect((err) => {
    if(err) throw err;
    console.log("Connected success");
});


app.post("/doRegister", (req, res) =>{
    const email = req.body.emailAddress;
    const password = req.body.password;
    console.log(password);
    let hashedPassword = passwordHash.generate(password);
    let user = {email: email, password: hashedPassword};
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, user, (err, result) => {
        if(err) throw err;
        console.log(result);

        res.render("registerSuccess");
    });
});

app.post("/doLogin", (req, res) =>{
    const email = req.body.emailAddress;
    const password = req.body.password;
    let hashedPassword = passwordHash.generate(password);
    console.log(hashedPassword);
    let user = {email: email, password: hashedPassword};
    let sql = 'SELECT id from users.users where email = "'+ email +'" and password = "' + hashedPassword + '"';
    let query = db.query(sql, user, (err, results) => {
        if(err) throw err;
        if(results.length == 0) {
            res.render("failedLogin");
            console.log(err);
            console.log(results);
        }
        if(results.length == 1) {
            res.render("successLogin");
        };
    });
});
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000);

app.get("/", function(req,res){
    res.render("index");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/doRegister", function(req, res){
    console.log("Register Success");
});