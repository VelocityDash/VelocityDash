const agenda = require('./agenda');
const getTrafficTime = require('./../utility/getTrafficTime');
const sendLeaveNotification = require ('./sendLeaveNotification');
const EventController = require('./../db/controllers/eventController');

const recurringCheck = function(event) {
  console.log('inside recurringCheck');  
  const timeToCheckAgain = 180000; // 3 min
  getTrafficTime(event)
  .then(times => {
    if (Date.now() + times.traffic + 300000 >= Date.parse(event.dataValues.startdatetime)) {
      console.log('traffic is over start time, sending notification'); 
      event.dataValues.traffic = times.traffic;
      sendLeaveNotification(times.notificationTime, event.dataValues);
    } else {
      console.log('traffic is not over start time, do setTimeout to make another check in 3 minutes');
      setTimeout(function() {
        console.log('setTimeout recurringCheck triggered 3 minute later');
        recurringCheck(event);
      }, timeToCheckAgain);
    }
  });
};

// define the job
agenda.define('query traffic', function(job, done) {
  // this should probably be a setInterval to keep querying for Traffic time and then setting new notification job if it meets certain requirements. Interval ends when we pass the leave time.
  // for now we are just going to query traffic once at the scheduled time, which is double the initial estimate
  var travel = job.attrs.data;
  var eventId = travel.eventId;

  return EventController.retrieveEvent(eventId)
  .then(event => {
    recurringCheck(event);
    // console.log('event', event);
    // return getTrafficTime(event)
    // .then(times => {
    //   event.dataValues.traffic = times.traffic
    //   sendLeaveNotification(times.notificationTime, event.dataValues);
    //   // schedule notification for leaving
    // });
  })
    // return getTrafficTime(event)
    // .then(times => {
      // event.dataValues.traffic = times.traffic
      // sendLeaveNotification(times.notificationTime, event.dataValues);
      // schedule notification for leaving
    // });
  // });  
  // then agenda.cancel({id: jobiD}) or some other kind of identifier of the job we were doing
  done();
});

// function for scheduling the job
const queryTraffic = function (travel) {
  travel = travel.dataValues;
  console.log('scheduling a queryTraffic worker for destination', travel.destination,'to begin querying at', travel.queryTime)
  agenda.schedule(travel.queryTime, 'query traffic', travel);
}

module.exports = queryTraffic;