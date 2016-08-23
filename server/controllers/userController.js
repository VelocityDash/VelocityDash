const User = require('../db/queries').User;
const addToTravelAndTraffic = require('../utility/map/addTravelAndTraffic');

const getGeolocation = (req, res) => {
  return User.getUserInfo(req.userId)
    .then((data) => { res.send(data.dataValues); })
    .catch((err) => { res.sendStatus(404); });
};

const updateGeolocation = (req, res) => {
  var initalizing = false;

  return User.getUserInfo(req.userId)
  .then(user => {
    if (user.dataValues.geolocation === null) {
      initializing = true;
    }
  })
  .then(() => User.updateUserGeolocation(req.userId, req.body.geolocation))
  .then((result) => {
    if (initializing) {
      // update all travels & schedule traffic queries for this user's events
      // console.log('updating travel and traffic!');
      addToTravelAndTraffic(req.userId);
      initializing = false; 
    }
    res.sendStatus(200); 
  })
  .catch((err) => { res.sendStatus(404); });
};

const getTransitMode = (req, res) => {
  return User.getUserInfo(req.userId)
    .then((data) => { res.send(data.dataValues); })
    .catch((err) => { res.sendStatus(404); });
};

const updateSettings = (req, res) => {
  return User.updateUserSettings(req.userId, req.body.transit, req.body.phoneNumber)
    .then((result) => { res.sendStatus(200); })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = {
  getGeolocation,
  updateGeolocation,
  getTransitMode,
  updateSettings
};