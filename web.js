var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/climate', function(req, res) {
  fs.readFile('public/climate.json', 'utf8', function read(err, data) {
    res.send(data);
  });
});

app.post('/climate', function (req, res) {
  var climate = {
    temp: req.headers.temp,
    humidity: req.headers.humidity
  };

  fs.writeFile('public/climate.json', JSON.stringify(climate), function (err) {
    if (err) throw err;
    res.send('ok');
  });
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});