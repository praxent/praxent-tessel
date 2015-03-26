var uploadImage = require('tessel-camera-s3');
var http = require('http');

var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port.A);
var climate = require('climate-si7020').use(tessel.port.B);

var blueLED = tessel.led[1];
var redLED = tessel.led[2];

var s3Config = {
  key:'AKIAJ3IDS2XTRQXZWRZQ',
  secret:'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',
  bucket:'praxent'
};

module.exports = {

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
      if (err) return console.log('Upload error:', err);

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
            console.log('Response: ' + chunk);
          });
        });
        req.end();
      })
    });
  }

}