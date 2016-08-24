const google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/verified');

// generate consent page url with our required access scopes
var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read', 'https://www.googleapis.com/auth/calendar']
});

module.exports = {
  oauth2Client,
  url
};
