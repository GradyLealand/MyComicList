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

//for decoding JSON
app.use(bodyParser.json());

//landing page for server (visit localhost:8080 in browser to see this)
app.get('/', function(req, res) {
    res.send('Hello from Server!');
});

//POST a new user
app.post('/addUser', function(req, res) {
    var username = req.param('user_name');
    var password = req.param('user_password');
    var email = req.param('user_email');
	
	console.log(username);
	console.log(password);
	console.log(email);

	var params = [username, password, email];

	connection.query('INSERT INTO User (user_name, user_password, user_email) VALUES (?, ?, ?)', params, function(err, res)
    {
        if(err) throw err;
        console.log("1 record inserted");
    });

    res.send('hello');
});

//server listing on port 8080
app.listen(8080);
console.log("Listening on port 8080");
