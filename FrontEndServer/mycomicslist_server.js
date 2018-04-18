var path = require('path');
var express = require('express');
var app = express();

var dir = path.join(__dirname, 'MyComicList');

app.use(express.static(dir));

//landing page for front end
app.get('/', function(req, res) {
    res.sendFile('MyComicList/Views/index.html', {root: __dirname });
});

//library page
app.get('/my_list.html', function(req, res) {
    res.sendFile('MyComicList/Views/my_list.html', {root: __dirname });
});

//back to the index
app.get('/index.html', function(req, res) {
    res.sendFile('MyComicList/Views/index.html', {root: __dirname });
});

//server listing on port 8001
app.listen(8001);
console.log("Listening on port 8001");
