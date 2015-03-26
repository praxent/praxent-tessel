// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This camera example takes a picture.
Take a picture with: `tessel run camera.js`
*********************************************/

var uploadImage = require('tessel-camera-s3');
var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port.A);
var crypto = require('crypto');

var blueLED = tessel.led[1];
var redLED = tessel.led[2];

var s3Config = {
  key:'AKIAJ3IDS2XTRQXZWRZQ',
  secret:'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',
  bucket:'praxent'
};

var snappy = {
  takePicture: function() {
    redLED.high();
    camera.takePicture();
  },
  uploadPicture: function(picture) {
    redLED.low();
    blueLED.high();
    uploadImage(picture, 'officeCurrent.jpg', s3Config, function (err, res) {
      if (err)
        return console.log('Upload error:', err);

      console.log('Image was upload success!');
      blueLED.low();
    });
  }
}

// Wait for the camera module to say it's ready
camera.on('ready', function() {

  // Snap pictures every 10 seconds.
  setInterval(function () {
    snappy.takePicture();
  }, 10000);

});

camera.on('picture', snappy.uploadPicture);

camera.on('error', function(err) {
  console.error(err);
});