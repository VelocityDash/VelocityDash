const models = require('../models/models');
const User = models.User;
const googleOAuth = require('./../../setup/googleOAuth');
var oauth2Client = googleOAuth.oauth2Client;

const findOrCreateUser = (profile, tokens) => {
  return User.findOrCreate({
    where: { googleId: profile.id },
    defaults: {
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      email: profile.emails[0].value,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token
    }
  });
};

// TO DO: This needs to be fixed so that it's just doing User.findOne and returning the refreshToken as an attribute. 
const getUserTokens = (id) => {
  return User.findOne({
    where: { id: id }
  })
  .then(data => {
    oauth2Client.setCredentials({
      refresh_token: data.dataValues.refreshToken
    });

    oauth2Client.refreshAccessToken((err, tokens) => {
      console.log('token', tokens);
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });
    });
  });
};

const getGeolocation = (id) => {
  console.log('============== [userController - getGeolocation]: userId =', id);

  return User.findOne(
    { attributes: ['id', 'geolocation'] },
    { where: { id: id } }
  );
};

const updateUserGeolocation = (id, geolocation) => {
  return User.update(
    { geolocation: geolocation },
    { where: {id : id} })
      .then((result) => result)
      .catch((err) => err);
};

module.exports = {
  findOrCreateUser,
  getUserTokens,
  getGeolocation,
  updateUserGeolocation
};
