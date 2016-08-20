const Promise = require('bluebird');
const google = require('googleapis');
var calendar = google.calendar('v3');
const googleOAuth = require('../../setup/googleOAuth');
const EventController = require('../../db/controllers').EventController;
// const { UserController, EventController } = require('../db/controllers');

calendar.events.insert = Promise.promisify(calendar.events.insert);
calendar.events.list = Promise.promisify(calendar.events.list);

const insertEvent = (auth, resource) => {
  var params = {
    calendarId: 'primary', 
    auth,
    resource
  };
  return calendar.events.insert(params);
};

const getAllEventsFromCalendar = (req, res) => {
  return googleOAuth.getUserTokens(req.userId)
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

module.exports = {
  insertEvent,
  getAllEventsFromCalendar
};
