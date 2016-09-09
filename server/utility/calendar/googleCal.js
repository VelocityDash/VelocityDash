const googleAuth = require('../auth/googleAuth');
const google = require('googleapis');
var calendar = google.calendar('v3');
const Promise = require('bluebird');

calendar.events.insert = Promise.promisify(calendar.events.insert);
calendar.events.list = Promise.promisify(calendar.events.list);

const addEventToGoogleCal = (userId, eventDetails) => {
  return googleAuth.getUserTokens(userId)
  .then(oauth2Client => {
    return calendar.events.insert({
      calendarId: 'primary',
      auth: oauth2Client,
      resource: eventDetails
    });
  })
  .catch(err => { console.warn('Error adding event to Google Calendar.\n', err); });
};

const getEventsFromGoogleCal = (id) => {
  return googleAuth.getUserTokens(id)
  .then(oauth2Client => {
    return calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      singleEvents: true,
      timeMin: (new Date(Date.now() - 12096e5)).toISOString(),
      timeMax: (new Date(Date.now() + 12096e5)).toISOString()
    });
  })
  .catch(err => { console.warn('Error getting events from Google Calendar.\n', err); });
};

const deleteEvent = (id, event) => {
  return googleAuth.getUserTokens(id)
  .then(oauth2Client => {
    return calendar.events.delete({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: event
    }, (res) => { console.log('Deleted event from Google Calendar.\n', res); });
  })
  .catch(err => { console.warn('Error deleting event from Google Calendar.\n', err); });
};

module.exports = {
  addEventToGoogleCal,
  getEventsFromGoogleCal,
  deleteEvent
};