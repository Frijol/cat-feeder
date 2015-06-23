var tessel = require('tessel');

// Set vars
var turn_amount = 1; // Amount to feed the cat per feeding
var feeds_per_day = 6; // Number of times to feed the cat per day

var interval = (24*60*60*1000)/feeds_per_day;
var config = require('./config.json');
var success_msg = 'Fed ' + config.cat_name + '.';
var failure_msg = 'Error feeding ' + config.cat_name + '.';
var msg;
console.log('Configured to feed', config.cat_name, 'every', interval/(1000*60*60), 'hours.');

// Posting setup
console.log('Setting up twilio...');
var twilio = require('twilio')(config.account_sid, config.auth_token);
console.log('Twilio is ready.');

// Hardware setup
var servo = require('servo-pca9685').use(tessel.port['A']);

// Run when ready
servo.on('ready', function () {
  var position = turn_amount;
  setInterval(function () {
    feed();
  }, interval);
});

// Functions

function feed () {
  // Move
  servo.move(1, position, function (err) {
    // Notify of feeding
    if (err) {
      msg = failure_msg;
    } else {
      msg = success_msg;
    }
    notify(msg);
  });

  // Set position for next time
  if (position) {
    position = 0;
  } else {
    position = turn_amount;
  }
}

function notify (msg) {
  console.log(msg);
  sendText(config.num_to_call, config.twilio_num, msg);
}

function sendText (to, from, msg) {
  console.log('Sending text...');
  twilio.sms.messages.create({
    to: to,
    from: from,
    body:msg
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid.toString());
      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.', error);
    }
  });
}
