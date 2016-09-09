const googleCal = require('./googleCal');

const removeEvent = (userId, eventId) => {
  return googleCal.deleteEvent(userId, eventId)
  .then(() => console.log('Successfully deleted event from Google Calendar.'))
  .catch((err) => { console.log('Error deleting event from Google Calendar.\n', err); });
};

module.exports = removeEvent;