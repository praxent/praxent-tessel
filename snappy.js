var uploadImage = require('tessel-camera-s3');
var http = require('http');

var s3Config = {
  key:'AKIAJ3IDS2XTRQXZWRZQ',
  secret:'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',
  bucket:'praxent'
};

module.exports = {
  takePicture: function() {
    redLED.high();
    camera.takePicture();
  },
  uploadPicture: function(picture) {
    redLED.low();
    blueLED.high();
    uploadImage(picture, 'officeCurrent.jpg', s3Config, function (err, res) {
      if (err) return console.log('Upload error:', err);

      console.log('Image upload success!');
      blueLED.low();
    });
  },
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