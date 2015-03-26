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

// Wait for the camera module to say it's ready
camera.on('ready', function() {

  redLED.high();

  // Take the picture
  camera.takePicture(function (err, image) {

    if (err)
      return console.log('Error taking picture:', err);

    var s3Config = {
      key:'AKIAJ3IDS2XTRQXZWRZQ',
      secret:'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',
      bucket:'praxent'
    };

    blueLED.high();
    uploadImage(image, 'officeCurrent.jpg', s3Config, function (err, res) {
      if (err)
        return console.log('Upload error:', err);

      console.log('Image was upload success!');
      redLED.low();
      blueLED.low();
      camera.disable();
    });

  });
});

camera.on('error', function(err) {
  console.error(err);
});