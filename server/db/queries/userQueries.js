const User = require('../models').User;
const uuid = require('node-uuid');

const findOrCreateUser = (profile, tokens) => {
  return User.findOrCreate({
    where: { googleid: profile.id },
    defaults: {
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      email: profile.emails[0].value,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      transitmode: 'driving',
      pubnubid: uuid.v4()
    }
  });
};

const authUser = (profile) => User.findOne({ where: { googleid: profile.id } });

const getUser = (id) => User.findOne({ where: { id: id } });

const getUserInfo = (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['id', 'geolocation', 'transitmode', 'phone', 'pubnubid']
  });
};

const getRefreshToken = (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['refreshToken']
  });
};

const getUserChannel = (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['pubnubid']
  });
};

const updateUserGeolocation = (id, geolocation) => {
  return User.update(
    { geolocation: geolocation },
    { where: { id: id } })
      .then((result) => result)
      .catch((err) => err);
};

const updateTransitMode = (id, transitMode) => {
  return User.update(
    { transitmode: transitMode }, 
    { where: { id: id } })
      .then((result) => {
        if (result[0] === 1) {
          return transitMode;
        } else {
          throw new Error();
        }
      })
      .catch((err) => err);
};

const updatePhoneNumber = (id, phoneNumber) => {
  return User.update(
    { phone: phoneNumber }, 
    { where: { id: id } }
  )
  .then((result) => result)
  .catch((err) => err);
};

module.exports = {
  findOrCreateUser,
  authUser,
  getUser,
  getUserInfo,
  getRefreshToken,
  getUserChannel,
  updateUserGeolocation,
  updateTransitMode,
  updatePhoneNumber
};