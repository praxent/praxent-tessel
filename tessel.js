var snappy = require('./snappy.js');

var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port.A);
var climate = require('climate-si7020').use(tessel.port.B);

var blueLED = tessel.led[1];
var redLED = tessel.led[2];

// Wait for the Climate module to be ready.
climate.on('ready', function () {

  // Send climate data every 30 seconds.
  setInterval(function () {
    snappy.sendClimate();
  }, 30000);

});

// Wait for the Camera module to be ready.
camera.on('ready', function() {

  // Snap pictures every 10 seconds.
  setInterval(function () {
    snappy.takePicture();
  }, 10000);

});

// As each picture is taken, upload it to S3.
camera.on('picture', snappy.uploadPicture);

// Catch and log errors.
camera.on('error', function(err) {
  console.error(err);
});