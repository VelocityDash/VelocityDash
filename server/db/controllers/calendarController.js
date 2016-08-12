const models = require('../models/models');
const Calendar = models.Calendar;
const User = require('./userController');
const google = require('googleapis');
var calendar = google.calendar('v3');
const googleOAuth = require('./../../setup/googleOAuth');
var oauth2Client = googleOAuth.oauth2Client;
const Event = require('./eventController');


// this is more of a utility function than a controller function since it's not doing anything with the Calendar model at all. 
// need to move it later, thanks to Derek for catching this.
const getAll = function (req, res) {
  var userId = 2
  User.getUserTokens(userId)
  // ^^ hardcoded right now, but this needs to be changed to the correct user id.
  .then(data => {
    oauth2Client.setCredentials({
      refresh_token: data.dataValues.refreshToken
    });
    oauth2Client.refreshAccessToken(function(err, tokens) {
      // your access_token is now refreshed and stored in oauth2Client
      // store these new tokens in a safe place (e.g. database)
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });
      calendar.events.list({
        auth: oauth2Client,
        calendarId: 'primary',
        singleEvents: true,
        minTime: Date.now()
        // not sure about the params to get all events or get new events that we don't have yet.
      }, function(err, data) {
        if (err) {
          console.warn('error in fetching events from calendar', err);
        }
        console.log(data.items);
        data.items.forEach(event => {
          Event.insertEvent(event, userId);
        })
      });
    });
  })
  .then(() => {
    // res.send('getting all events from calendar');
  });
};

// getAll();
//^^ fetching all event data but this call needs to happen elsewhere on a timer or by something invoking it

module.exports = {
  getAll
}
