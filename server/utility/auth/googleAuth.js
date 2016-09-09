const Promise = require('bluebird');
const google = require('googleapis');
const plus = google.plus('v1');
const googleOAuth2 = require('../../setup/googleOAuth2');
const User = require('../../db/queries').User;
var oauth2Client = googleOAuth2.oauth2Client; 
const url = googleOAuth2.url;

plus.people.get = Promise.promisify(plus.people.get);
oauth2Client.getToken = Promise.promisify(oauth2Client.getToken);
oauth2Client.refreshAccessToken = Promise.promisify(oauth2Client.refreshAccessToken);

const googleCalAuthCallback = (code) => {
  // not sure how to fix this promise chain because I need to return tokens and profile for the next function. 
  // plus.people.get can only return profile and may not be able return both tokens and profile at the same time until people.get promise returns
  return oauth2Client.getToken(code)
  .then(tokens => {
    oauth2Client.setCredentials(tokens);
    return plus.people.get({ userId: 'me', auth: oauth2Client })
    .then(profile => { return {tokens, profile}; });
  })
  .catch(err => { console.warn('Error getting web oAuth token.\n', err); });
};

const extensionIdentityAuth = (token) => {
  oauth2Client.setCredentials({ access_token: token });
  return plus.people.get({ userId: 'me', auth: oauth2Client });
};

const getUserTokens = (id) => {
  return User.getRefreshToken(id)
  .then(user => {
    oauth2Client.setCredentials({ refresh_token: user.dataValues.refreshToken });
    return oauth2Client.refreshAccessToken();
  })
  .then(tokens => {
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    return oauth2Client; 
  })
  .catch(err => { console.warn('Error in getting refresh/access token.\n', err); });
};

module.exports = {
  googleCalAuthCallback,
  extensionIdentityAuth,
  getUserTokens,
  url
};