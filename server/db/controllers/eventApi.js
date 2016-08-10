const models = require('../models/models');
const User = require('./userController');
const googleOAuth = require('./../../setup/googleOAuth.js');
const google = require('googleapis');
const calendar = google.calendar('v3');
const plus = google.plus('v1');
const Event = require('./eventController');
var oauth2Client = googleOAuth.oauth2Client;
const pubnub = require('./../../pubnub.js')


const postEventToApi = function(req, res) {
  console.log('body', req.body);
  var userId = 2;
  User.getUserTokens(2)
    .then(data => {
      oauth2Client.setCredentials({
        refresh_token: data.dataValues.refreshToken
    });
    oauth2Client.refreshAccessToken((err, tokens) => {
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });
      const params = {calendarId: 'primary', auth: oauth2Client, resource: req.body};
      calendar.events.insert(params, function(err, data) {
        if(err) {
          console.log('did not insert to cal', err);
        } else {
          console.log('event saved to g cal!');
          pubnub.publish(
            {
              message: data,
              channel: 'eventAdded',
              sendByPost: false, // true to send via post
              storeInHistory: false, //override default storage options
              meta: {} // publish extra meta with the request
            },
            function (status, response) {
                // handle status, response
            }
          ); 
        }
      });
      Event.insertEvent(req.body, userId);

    });
  });
}

module.exports = {
  postEventToApi
};
