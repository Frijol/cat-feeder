# cat-feeder
Tessel project to feed my cat.

This is an experiment in automated cat feeding that I hope will make my kitty Lizzie healthier, happier, and less dependent. Let me explain:

1. My cat is fat, though she eats the recommended amount of food for her weight, and to hear her tell it, is always starving. I suspect that this is partially due to unhealthy feeding patterns whereby she gobbles up all of her food instantly when it is poured out instead of spacing it out throughout the day. Nutritionists recommend more consistent patterns – for humans, many small healthy snacks throughout the day over two or three large meals. If I feed her smaller amounts automatically throughout the day, perhaps her digestive system will operate more effectively and her mood swings will be less severe.
2. I can't always feed her at the same time. She ends up mewling by the door, ravenous when I come home from work. She climbs on me at five in the morning to wake me and remind me that breakfast could be soon. This is something of a fair reaction, because her feeding schedule is currently tied to my rather inconsistent routine. If I automate her feeding, the actions of the food bowl can be divorced from my comings and goings.

I want to use a cereal dispenser to feed my cat. I need it to turn the servo and feed her every X time, and then send up a log to a webservice so that I know she has been fed.

I also want to poll the webservice at regular intervals, and if it's been too long, I need to be texted so I know my cat feeding machine isn't working as it's meant to and I have to go fix it.

## Technologies used

### Electronics

* [Tessel](//tessel.io)
* [Servo module](//tessel.io/modules#module-servo)

### Materials

* [Dry food dispenser](https://amzn.to/2SyVaKi)

### Web

* [Twilio](https://www.twilio.com/) to text me when my cat is fed

## Setting up

### Electronics setup

Start by plugging in your servo to position 1 on your servo module, your servo module in to port A on your Tessel (and its power adapter to power) and plugging in Tessel to your computer.

Npm [install the servo library](https://www.npmjs.com/package/servo-pca9685) and run the following code to see your servo move:

```js
var tessel = require('tessel');
var servo = require('servo-pca9685').use(tessel.port['A']);

servo.on('ready', function () {
  var position = 0;
  setInterval(function () {
    servo.move(1, position);
    console.log('moved');
    // Set position for next time
    position = position == 0 ? 1 : 0;
  }, 1000); // 1000 = a thousand milliseconds
});
```

Great! Your servo should now move once a second. CTRL + C to exit the process.

### Physical setup

Mount your servo to the turn knob of the dry food dispenser. The turning head of the servo should be firmly attached to the knob; the rest of the servo needs to be held in place against the dispenser, so that the servo turns the knob.

PICS AND DETAILS WILL BE FORTHCOMING

### Calibrate

Put some cat food in the dispenser. Run your test servo code until it has moved a couple of times.

Now stop the servo, count the number of times it moved, and measure out the amount of food dispensed. Food dispensed / times moved = food per dispensation. When I tried this, I got AMOUNT PER DISPENSATION.

My cat, whose midsection is spherical, is supposed to get 1/2 cup of cat food per day. I want to spread that half cup out over six servings, so 1/12 cup every four hours.

In order to adjust the food per dispensation to 1/12 cup, I have to change the amount the servo moves. Reaching way back to elementary school lessons on proportions:

CURRENT AMOUNT / 1 (amount servo moves) = DESIRED AMOUNT / X (amount to make servo move)

Or, refactored, X = CURRENT AMOUNT / DESIRED AMOUNT

In my case: X = CURRENT AMOUNT / (1/12) = 12/INVERTED

I need to make the servo move to FRACTION, or DECIMAL. This will be my turn amount.

See? You totally have to use that stuff from math in the real world. Thanks, Mrs. Schneider.

## Software setup

If you haven't already git cloned this [repo](https://github.com/Frijol/cat-feeder), now is a good time.

In your local copy of `index.js`, set the turn_amount variable to the turn amount you calculated above.

Go ahead and set the feeds_per_day variable, too.

You might as well set up your config file now too. Change your `example-config.json` to be called `config.json`, and be sure to correct the cat_name variable.

`npm install` to ensure you have the libraries you need.

Also sign up for [Twilio](www.twilio.com) (it's free) so that your cat feeder can text you, as we'll set up in the next step. *You might need to follow [these special instructions](https://forums.tessel.io/t/building-a-sleep-tracker-for-your-dog-using-tessel-and-twilio/942/2) to get twilio to work properly.*

## Scale for Deployment

It's all well and good to set up an automatic cat food system, but if you're going to deploy long term, you'll need a bit of operations work to make sure your system is running smoothly. After all, if it's not working, your cat goes hungry.

Let's start with notifications. If you don't have it already, go sign up for a trial account on Twilio, get a phone number, and set the appropriate config variables in your code.

Okay, now [make sure your Tessel is connected to wifi](https://tessel.io/docs/wifi) and run the code. Your cat should get regular feedings, and you'll get texted every time!
