const requestPromise = require('request-promise');
const UserController = require('./../db/controllers/userController');

const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

const getTrafficTime = function(event) {
  // event.dataValues.userId
  return UserController.getGeolocation(event.dataValues.userId)
  .then((data) => data.dataValues.geolocation)
  .then((geolocation) => {
    var options = {
      url,
      qs: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: geolocation,
        // can probably store destinations in job?
        destinations: event.dataValues.location,
        mode: 'driving',
        departure_time: 'now',
        units: 'imperial',
        traffic_model: 'best_guess'
      }
    };

    return requestPromise(options)
  })
  .then(body => {
    body = JSON.parse(body);
    // console.log(body.rows[0].elements[0]);
    // var distance = body.rows[0].elements[0].distance;
    var duration = body.rows[0].elements[0].duration;
    var traffic = duration.value * 1000; // convert seconds to milliseconds
    var notificationTime = new Date(Date.parse(event.startdatetime) - (traffic + 300000));

    console.log('Traffic (in seconds):\n', traffic);
    console.log('Notification Time:\n', notificationTime);

    return {
      traffic,
      notificationTime
    };
  });
};

module.exports = getTrafficTime;
