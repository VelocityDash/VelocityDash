const UserController = require('./../db/controllers/userController');
const Event = require('./../db/controllers/eventController');
const google = require('googleapis');
const calendar = google.calendar('v3');
const googleOAuth = require('./../setup/googleOAuth');
const oauth2Client = googleOAuth.oauth2Client;
const Promise = require('bluebird');

calendar.events.list = Promise.promisify(calendar.events.list);

// this is more of a utility function than a controller function since it's not doing anything with the Calendar model at all. 
// need to move it later, thanks to Derek for catching this.
const getAllEventsFromCalendar = function (req, res) {
  var userId = 2;
  return UserController.getUserTokens(userId)
  // ^^ hardcoded right now, but this needs to be changed to the correct user id.
  .then(data => {
    calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      singleEvents: true,
      minTime: Date.now()
      // not sure about the params to get all events or get new events that we don't have yet.
    })
    .then(data => {
      data.items.forEach(event => {
        Event.insertEvent(event, userId);
      });
      res.send(data.items);      
    });
  });
};

module.exports = getAllEventsFromCalendar;
