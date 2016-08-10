const models = require('../models/models');
const Event = models.Event;
// const User = require('./userController');
// const google = require('googleapis');
// var calendar = google.calendar('v3');
// const googleOAuth = require('./../../setup/googleOAuth');
// var oauth2Client = googleOAuth.oauth2Client;

const insertEvent = function(data, userId) {
  Event.findOrCreate({
    where: {googleCalendarEventId: data.id},
    defaults: {
      userId: userId,
      name: data.summary,
      eventUrl: data.htmlLink,
      startDateTime: data.start.dateTime,
      endDateTime: data.end.dateTime,
      recurrence: JSON.stringify(data.recurrence),
      // currently not checking for recurrence since the calendar events query has "single events: true" which lists every single event
      location: data.location,
      description: data.description
    }})
  .spread(function(event, created) {
    console.log(created, ': event was created');
  });
}

const retrieveEvent = function(id) {
  return Event.findOne({
    where: {id: id}
  })
}

module.exports = {
  insertEvent,
  retrieveEvent
}
