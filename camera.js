// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This camera example takes a picture.
Take a picture with:

tessel run camera.js

*********************************************/

var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port.A);
var AWS = require('aws-sdk');
var config = {
      accessKeyId: 'AKIAJ3IDS2XTRQXZWRZQ',
      secretAccessKey: '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',
    };

AWS.config.update(config);

var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture

// Wait for the camera module to say it's ready
camera.on('ready', function() {

  // Name the image
  var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';

  console.log('READY');

  notificationLED.high();
  // Take the picture
  camera.takePicture(function(err, image) {

    if (err) {
      return console.log('error taking image', err);
    }

    var s3 = new AWS.S3(),
        params = {
          Bucket: 'praxent',
          Key: name,
          Body: image
        };

    s3.putObject(params, function(err, data) {

      if (err) {
        return console.log('ERROR ', err);
      }

      console.log("Successfully uploaded data to myBucket/myKey");

      notificationLED.low();
      camera.disable();

     });

  });
});


camera.on('error', function(err) {
  console.error(err);
});