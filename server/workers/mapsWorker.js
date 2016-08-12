const Agenda = require('agenda'); 
require('dotenv').config();
const User = require('./../db/controllers/userController');
const Travel = require('./../db/controllers/travelController');
const pubnub = require('./../pubnub.js');
const googleMaps = require('./../utility/googleMaps.js');

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
  // eventId = jobs.attrs.data
  googleMaps.getTrafficTime(eventId);
  //.then((data) => {

    // compare against initial estimate time and then if it's more, then change notification time, cancel old one?
     // agenda.schedule(travel.dataValues.notificationTime, 'send notification', data);
     // be careful about what data this is, it might be the travel data, not event data. 
     // this is probably a good reason for combining the event + travel tables together? or would a joined query have been enough to keep track of data? or could query data again here in this job. 

  // this is probably a setInterval to keep querying for Traffic time and then setting new notifcation job if it meets certain requirements. Interval ends when we pass the leave time. 

  // then agenda.cancel({id: jobiD}) or some other kind of identifier of the job we were doing

  done();
});

agenda.define('send notification', function(job, done) {
  // use pubnub to send notification
  pubnub.publish({
    message: job.attrs.data, // third argument for schedule is data that is passed in as jobs.attrs.data
    channel: 'timeToLeave',
    sendByPost: false, // true to send via post
    storeInHistory: false //override default storage options
    // meta: { "cool": "meta" } // publish extra meta with the request
    }, function (status, response) {
      // handle status, response
    }
  ); 

  // after sending notification, agenda.cancel
  var travelId = job.attrs.data.data.id;
  agenda.cancel({data: {id: travelId}});


  console.log('sending notification to user to leave now for event:', job.attrs.data);
  done();
});


agenda.on('ready', function() {
  // agenda.schedule('in 5 minutes', 'send notification', {data: 'data'});
  // getTravels();
  agenda.start();
});

agenda.on('error', function(err) {
  console.warn('error', err);
});

module.exports = agenda;

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