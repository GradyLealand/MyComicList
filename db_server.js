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

//check to see if the users
app.post('/login', function(req, res) {
    var returnString;
    var user_name = req.param('user_name');
    var user_password = req.param('user_password');

	console.log(user_name);
	console.log(user_password);

	var params = [user_name, user_password];

    connection.query('SELECT * FROM User WHERE user_name = ? AND user_password = ?', params, function(err, response)
    {
        if(err) throw err;
        console.log(response);
        setValue(JSON.stringify(response));
    });

    function setValue(value) {
        returnString = value;


        if(returnString.length > 2)
        {
            //get the user id
            var newStr = value.substring(1, value .length-1);
            console.log(newStr.user_id);
            var jstring = JSON.parse(newStr);

            //return the user id
            res.send(jstring.user_id.toString());
        }
        else
        {
            res.send("0");
        }
    }

});

//check to see if the user exists in the database already
app.post('/userExists', function(req, res) {
    var returnString = [];
    var user_name = req.param('user_name');

    console.log(user_name);

    var params = [user_name];

    connection.query('SELECT * FROM User WHERE user_name = ? ', params, function(err, response)
    {
        if(err) throw err;
        setValue(JSON.stringify(response));
    });


    function setValue(value) {
        returnString = value;
        console.log(returnString.length);
        if(returnString.length > 2)
        {
            res.send(false);
        }
        else
        {
            res.send(true);
        }
    }

});

//server listing on port 8080
app.listen(8080);
console.log("Listening on port 8080");
