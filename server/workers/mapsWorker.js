const Agenda = require('agenda'); 
require('dotenv').config();
const User = require('./../db/controllers/userController');
const Travel = require('./../db/controllers/travelController');
const pubnub = require('./../pubnub.js');

const mongoConnectionString = process.env.MONGODB_URI;

var agenda = new Agenda({db: {address: mongoConnectionString, collection: 'mapJobs'}});

// const getTravels = function() {
//   Travel.getAllTravel()
//   .then((data) => {
//     // data is an array of Travel objects from Postgres
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].dataValues.notificationTime);
//       agenda.schedule(data[i].dataValues.notificationTime, 'send notification', data[i].dataValues);
//     }
//   });
// };

agenda.define('query maps for traffic', function(job, done) {
  done();
})

agenda.define('send notification', function(job, done) {
  // use pubnub to send notification
  pubnub.publish({
    message: jobs.attrs.data, // third argument for schedule is data that is passed in as jobs.attrs.data
    channel: 'timeToLeave',
    sendByPost: false, // true to send via post
    storeInHistory: false //override default storage options
    // meta: { "cool": "meta" } // publish extra meta with the request
    }, function (status, response) {
      // handle status, response
    }
  ); 


  console.log('sending notification to user to leave now');
  done();
})


agenda.on('ready', function() {
  // agenda.schedule('in 5 minutes', 'send notification', {data: 'data'});
  // getTravels();
  agenda.start();
});

agenda.on('error', function(err) {
  console.warn('error', err);
});


// agenda.jobs Lets you query all of the jobs in the agenda job's database. This is a full mongodb-native find query. See mongodb-native's documentation for details.

// agenda.jobs({name: 'printAnalyticsReport'}, function(err, jobs) {
//   // Work with jobs (see below)
// });

// agenda.cancel Cancels any jobs matching the passed mongodb-native query, and removes them from the database.

// agenda.cancel({name: 'printAnalyticsReport'}, function(err, numRemoved) {
// });

// agenda.purge Removes all jobs in the database without defined behaviors. Useful if you change a definition name and want to remove old jobs. IMPORTANT: Do not run this before you finish defining all of your jobs. If you do, you will nuke your database of jobs.

// agenda.purge(function(err, numRemoved) {
// });

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


module.exports = agenda;