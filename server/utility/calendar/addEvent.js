const Event = require('../../db/queries').Event;
const pubnub = require('../../utility/notification/pubnub');
const googleCal = require('./googleCal');

const addEvent = (userId, eventDetails) => {
  return googleCal.addEventToGoogleCal(userId, eventDetails)
  .then(data => {
    pubnub.publishEventAdded(userId, data);
    return Event.insertEvent(userId, data);
  });
};

module.exports = addEvent;