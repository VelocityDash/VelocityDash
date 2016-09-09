const twilio = require('../../setup/twilio');

const newTwilioMessage = (phoneNumber, eventName, trafficInMilliseconds, eventLocation) => {
  twilio.messages.create({
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Better leave now for ${eventName}! It will take ${Math.floor(trafficInMilliseconds / 60000)} minutes to get to ${eventLocation}.`,
  }, (err, message) => {
    (!err) ? console.log('Twilio message successfully sent!') : console.log('Error sending Twilio message.\n', err);
  });
};

module.exports = newTwilioMessage;