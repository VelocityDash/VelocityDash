const Agenda = require('agenda'); 
require('dotenv').config();
const User = require('./../db/controllers/userController');
const Travel = require('./../db/controllers/travelController');

const mongoConnectionString = process.env.MONGODB_URI;

var agenda = new Agenda({db: {address: mongoConnectionString, collection: 'mapJobs'}});

const getTravels = function() {
  Travel.getAllTravel()
  .then((data) => {
    // console.log(data);
    // data is an array of objects
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].dataValues.notificationTime);
      agenda.schedule(data[i].dataValues.notificationTime, 'send notification');
    }
  });
};

agenda.define('query maps for traffic', function(job, done) {
  done();
})

agenda.define('send notification', function(job, done) {
  //use socket.io to emit notification to user
  console.log('sending notification to user to leave now');
  done();
})


agenda.on('ready', function() {
  // getTravels();
  agenda.start();
});

agenda.on('error', function(err) {
  console.warn('error', err);
});





const request = require('request');
const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const origins = 'Hack Reactor, 944 Market St, San Francisco, CA 94102';

const getTrafficTime = function(eventId) {
  Event.retrieveEvent(eventId)
  .then((event) => {
    var options = {
      url,
      qs: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: origins, 
        // origins needs to be changed
        destinations: event.dataValues.location,
        // can probably store destinations in job? 
        mode: 'driving',
        departure_time: 'now', 
        units: 'imperial',
        traffic_model: 'best_guess'
      }
    };
    request(options, function (error, response, body) {
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        console.log(body.rows[0].elements[0]);
        var distance = body.rows[0].elements[0].distance;
        var duration = body.rows[0].elements[0].duration;
        var traffic = duration.value * 1000; // convert seconds to milliseconds
      }
    })
  })
};


module.exports = {
  agenda
}