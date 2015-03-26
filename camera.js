// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This camera example takes a picture.
Take a picture with:

tessel run camera.js

*********************************************/

var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port['A']);
var uploadImage = require('tessel-camera-s3');

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

// Wait for the camera module to say it's ready
camera.on('ready', function() {

  console.log('READY');

  notificationLED.high();
  // Take the picture
  camera.takePicture(function(err, image) {

    if (err) {
      return console.log('error taking image', err);
    }

    var s3Config = {
      key:'AKIAJ3IDS2XTRQXZWRZQ',
      secret:'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',
      bucket:'praxent'
    };

    notificationLED.low();

    // Name the image
    var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';

    uploadImage(image, name, s3Config, function(err, res) {
      if (err) {
        return console.log('There was an error :( ');
      }

      console.log('image was successfully uploaded!');
      console.log('RESPONSE -=-=-=-=- ', res);

      // Turn the camera off to end the script
      camera.disable();
    });

  });
});


camera.on('error', function(err) {
  console.error(err);
});