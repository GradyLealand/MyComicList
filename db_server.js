//db_server.js

var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

//fixes CORS issues
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

//create a connection to the db
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'itCampus2018',
  database: 'MyComicListDB'
});

//actually connect to the db
connection.connect(function(err) {
    if ( !err ) {
        console.log("Connected to MySQL DB");
    } else if ( err ) {
        console.log(err);
    }
});

//for encoding/decoding json??
app.use(bodyParser.urlencoded({ extended: false }))

//landing page for server (visit localhost:8080 in browser to see this)
app.get('/', function(req, res) {
    res.send('Hello from Server!');
});

//POST a new user
app.post('/user', function(req, res) {
    // var username = 'devin';
    // var password = 'password';
    // var email = 'w0302119@nscc.ca';
    //
    // connection.query("INSERT INTO User (user_name, user_password, user_email) VALUES (?, ?, ?)", username.toString(), password.toString(), email.toString(), function(err, result)
    // {
    //     if(err) throw err;
    //     console.log("1 record inserted");
    // });

    res.send('hello');
});

//server listing on port 8080
app.listen(8080);
console.log("Listening on port 8080");
