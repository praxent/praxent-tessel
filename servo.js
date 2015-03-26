var wifi = require('wifi-cc3000');
var http = require('http');
var tessel = require('tessel');
var servolib = require('servo-pca9685');
var network = "Change Game"
var pass = 'Hambag0g0';
var security = 'wpa2';
var timeouts = 0;

var servo = servolib.use(tessel.port['A']);
var servo1 = 1; // We have a servo plugged in at position 1
servo.on('ready', function () {
  var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).
  servo.configure(servo1, 0.05, 0.12, function () {
    servo.move(servo1, position);
  });
});

function connect(){
  wifi.connect({
    security: security
    , ssid: network
    , password: pass
    , timeout: 30
  });
}

function check () {
  console.log('checking...');
  http.get("http://august8th.com/twilio/instruction.php", function (res) {

    console.log("step 1");
    var bufs = [];

    res.on('data', function (data) {

      bufs.push(new Buffer(data));
      var command = new Buffer(data).toString();
      console.log(command);
      if(command == "left"){
        position = 1;
      } else if (command == "center") {
        position = 0.5;
      } else if (command == "right") {
        position = 0;
      } else {
        console.log("nope");
      }

      servo.move(servo1, position);

    })

    res.on('end', function () {
      //this didnt work as expected

    })

  }).on('error', function (e) {
    console.log('not ok -', e.message, 'error event');
  });
}

connect();

wifi.on('connect', function(data){
  console.log(data);
  setInterval(function(){
    check();
  }, 8*1000);
});

wifi.on('error', function(err){
  console.log("error emitted", err);
});
