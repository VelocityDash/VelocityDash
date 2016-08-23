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
    // job.attrs.data.phone = user.dataValues.phone;
    var phoneNumber = user.dataValues.phone;

    var channel = user.dataValues.pubnubid;
    var message = job.attrs.data;

    // Send notification through Pubnub
    pubnub.publishTimeToLeave(channel, message);

    // after sending notification, agenda.cancel
    // agenda.cancel({"_id": job._id}, function(err, jobs) {
    //   console.log('canceled job after notification was sent', jobs);
    // })

    // Send text message via Twilio
    console.log(`=============== [sendLeaveNotification]: Sending Twilio message\nPhone: ${message.phone}\nMessage: ${message.name}\nTraffic: ${message.traffic}\nLocation: ${message.location}`);

    newTwilioMessage(phoneNumber, message.name, message.traffic, message.location);

    console.log('Sending notification to user to leave now for event:', message.name);

    done();
  });
});

const sendLeaveNotification = (notificationTime, eventData) => {
  console.log('Scheduling a leave notification for event ', eventData.name, ' at ', notificationTime);
  // pubnub publish
  agenda.schedule(notificationTime, 'send leave notification', eventData);
};

module.exports = sendLeaveNotification;
