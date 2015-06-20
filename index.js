var tessel = require('tessel');

// Posting setup
var secrets = require('./config.json');
var channel = 'feeder';
// var pubnub = require('pubnub').init({
//   subscribe_key: secrets.subscribe_key,
//   publish_key: secrets.publish_key,
//   uuid: tessel.deviceId()
// });

// Hardware setup
var servo = require('servo-pca9685').use(tessel.port['A']);

// Run
servo.on('ready', function () {
  var position = 0;
  setInterval(function () {
    // Move
    servo.move(1, position);
    console.log('moving')

    // // Publish
    // pubnub.publish({
    //   channel: channel,
    //   message: {
    //     message: 'Lizzie was fed.'
    //   }
    // });

    // Set position for next time
    position = position == 0 ? 1 : 0;
  }, 1000);
});
