const google = require('googleapis');
const calendar = google.calendar('v3');
const plus = google.plus('v1');


var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET, 
  'http://localhost:9000/api/authCallback')

// generate consent page url
var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // will return a refresh token
  scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read', 'https://www.googleapis.com/auth/calendar'] // can be a space-delimited string or an array of scopes
});

module.exports = {
  oauth2Client,
  url
}