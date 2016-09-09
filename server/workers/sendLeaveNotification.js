const User = require('../db/queries').User;
const agenda = require('./agenda');
const pubnub = require('../utility/notification/pubnub');
const newTwilioMessage = require('../utility/notification/twilio');

agenda.define('send leave notification', (job, done) => {
  // Keep an eye on this, there may be a bug where multiple notifications are sent
  return User.getUserInfo(job.attrs.data.userId)
  .then(user => {
    job.attrs.data.transit = user.dataValues.transitmode;
    job.attrs.data.origin = user.dataValues.geolocation;

    var phoneNumber = user.dataValues.phone;
    var channel = user.dataValues.pubnubid;
    var message = job.attrs.data;

    // Send notification through Pubnub
    pubnub.publishTimeToLeave(channel, message);

    // Send text message via Twilio
    newTwilioMessage(phoneNumber, message.name, message.traffic, message.location);

    // Delete job after it runs
    setTimeout(() => {
      removeSendNotification(job.attrs._id);
    }, 1000);

    done();
  });
});

const sendLeaveNotification = (notificationTime, eventData) => {
  agenda.schedule(notificationTime, 'send leave notification', eventData);
};

const removeSendNotification = function(id) {
  agenda.cancel({_id: id}, (err, numRemoved) => {
    (err) ? console.warn('error in removing job:', err) : console.log(numRemoved, '1 send notification job removed');
  });
};

module.exports = sendLeaveNotification;