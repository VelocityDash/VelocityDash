const Event = require('../db/queries').Event;
const agenda = require('./agenda');
const getTrafficTime = require('../utility/map/getTrafficTime');
const sendLeaveNotification = require ('./sendLeaveNotification');

const recurringCheck = (event) => {
  const timeToCheckAgain = 180000; // Check every 3 minutes
  getTrafficTime(event)
  .then(times => {
    // 15 minutes before hand
    if (Date.now() + times.traffic + 1500000 >= Date.parse(event.dataValues.startdatetime)) {
      // Traffic is over start time, sending notification
      event.dataValues.traffic = times.traffic;
      sendLeaveNotification(times.notificationTime, event.dataValues);
    } else {
      // Traffic is not over start time, do setTimeout to make another check in 3 minutes
      setTimeout(function() {
        recurringCheck(event);
      }, timeToCheckAgain);
    }
  });
};

agenda.define('query traffic', (job, done) => {
  var travel = job.attrs.data;
  var eventId = travel.eventId;

  Event.retrieveEvent(eventId)
  .then(event => { recurringCheck(event); });

  setTimeout(() => {
    removeQueryTraffic(job.attrs._id);
  }, 1000);

  done();
});

// function for scheduling the job
const queryTraffic = (travel) => {
  travel = travel.dataValues;
  (travel.queryTime >= Date.now()) ? agenda.schedule(travel.queryTime, 'query traffic', travel) : agenda.now('query traffic', travel);
};

const removeQueryTraffic = (id) => {
  agenda.cancel({_id: id}, (err, numRemoved) => {
    (err) ? console.warn('Error removing job.\n', err) : console.log(numRemoved, 'query traffic job removed.');
  });
};

module.exports = queryTraffic;