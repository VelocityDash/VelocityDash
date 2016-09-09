const Travel = require('../../db/queries').Travel;
const User = require('../../db/queries').User;
const requestPromise = require('request-promise');
const googleMap = require('./googleMap');

const addTravel = (event) => {
  return User.getUserInfo(event.dataValues.userId)
  .then(data => requestPromise(googleMap.mapTravel(data, event))) // Request to Google Maps API for travel data
  .then(body => {
    var body = JSON.parse(body);
    var duration = body.rows[0].elements[0].duration;
    return (duration) ? value = duration.value : 0; // Might be a bug in here still if origin & destination are the same.
  })
  .then(value => Travel.initiateTravel(event, (value * 1000))) // Convert milliseconds to seconds
  .spread((travel, created) => travel);
};

module.exports = addTravel;