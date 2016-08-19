const TravelController = require('./../db/controllers/travelController');
const requestPromise = require('request-promise');
const UserController = require('./../db/controllers/userController');

const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

const addTravel = (event) => {
  console.log('=========================== [addTravel]: event.dataValues\n', event.dataValues);

  return UserController.getGeolocation(event.dataValues.userId)
  .then((data) => {
    console.log('========================= Data from getGeolocation (includes userId for now)', data.dataValues);
    return data.dataValues.geolocation;
  })
  .then((geolocation) => {
    var options = {
      url,
      qs: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: geolocation,
        destinations: event.dataValues.location,
        mode: 'driving',
        arrival_time: event.dataValues.startdatetime,
        // departure_time: 'now',
        units: 'imperial'
        // traffic_model: 'best_guess'
      }
    };

    console.log('========================= [addTravel]: options\n', options);
    
    // Request to Google Maps API for travel data
    return requestPromise(options);
  })
  .then(body => {
    // requestPromise is tricky because not handling response or error/status code, just body
    var body = JSON.parse(body);

    console.log('========================= [addTravel]: body', body);

    // console.log(body.rows[0].elements[0]);
    // var distance = body.rows[0].elements[0].distance;
    var duration = body.rows[0].elements[0].duration;
    var value = 0;

    if (duration && duration.value) {
      value = duration.value;
    }

    return value;
  })
  .then(value => TravelController.initiateTravel(event, (value * 1000))) // convert milliseconds to seconds
  .spread((travel, created) => travel);
};

module.exports = addTravel;