var http = require('http');
var uploadImage = require('tessel-camera-s3');

var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port.A);
var climate = require('climate-si7020').use(tessel.port.B);

var blueLED = tessel.led[1];
var redLED = tessel.led[0];

var s3Config = {
  key:'AKIAJ3IDS2XTRQXZWRZQ',
  secret:'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',
  bucket:'praxent'
};

console.log(String.fromCharCode(0x2318) + ' Praxent');

var snappy = {

  // Take a picture, flashes the red LED to notify.
  takePicture: function() {
    redLED.high();
    camera.takePicture();
  },

  // Upload a picture from the camera to S3.
  uploadPicture: function(picture) {
    redLED.low();
    blueLED.high();
    uploadImage(picture, 'officeCurrent.jpg', s3Config, function (err, res) {
      if (err) return console.error('Upload error:', err);

      console.log('Image upload success!');
      blueLED.low();
    });
  },

  // Send climate data to the server.
  sendClimate: function() {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        var req = http.request({
          host: 'office.praxent.com',
          port: '80',
          path: '/climate',
          method: 'POST',
          headers: {
            'temp': temp.toFixed(4),
            'humidity': humid.toFixed(4)
          }
        }, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('Climate data sent.', chunk);
          });
        });
        req.end();
      })
    });
  }

};

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