const Agenda = require('agenda'); 

const mongoConnectionString = process.env.MONGODB_URI;

var agenda = new Agenda({db: {address: mongoConnectionString, collection: 'mapJobs', options: {server:{auto_reconnect:true}}}});

agenda.on('ready', function() {
  // getTravels();
  console.log('Agenda is connected to Heroku mongodb.');
  agenda.start();
});

agenda.on('error', function(err) {
  console.warn('Error in Agenda connecting to Heroku mongodb:\n', err);
});

agenda.on('fail', function(err, job) {
  console.log("Job failed with error: %s", err.message);
});

agenda.on('success', function(job) {
  console.log('Successfully completed job:', job.attrs);
})

module.exports = agenda;





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



// agenda.define('delete job', function(job, done) {
//   agenda.jobs({'data': {'id': '4'}}, function(err, jobs) {
//     console.log('looking for jobs');
//     console.log(jobs);
//   })
//   //   // Work with jobs (see below)
//   // });
//   // agenda.cancel({data: {id: travelId}});  
// });

// agenda.cancel({"name": "delete job"}, function(err, jobs) {
//   console.log(jobs);
// })


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