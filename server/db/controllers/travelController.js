const models = require('../models/models');
const Travel = models.Travel;
const agenda = require('./../../workers/mapsWorker');



const initiateTravel = function(event, initialEstimate) {
  Travel.findOrCreate({
    where: {eventId: event.id},
    defaults: {
      // origins: Sequelize.STRING,
      destination: event.location,
      initialEstimate: initialEstimate,
      queryTime: new Date(Date.parse(event.startDateTime) - (initialEstimate * 2)),
          // take the arrival time and subtract double the initial estimate for when to begin querying
      // trafficEstimate: Sequelize.INTEGER,
      // mapsUrl: Sequelize.STRING,
      notificationTime: new Date(Date.parse(event.startDateTime) - (initialEstimate + 300000)),
      // notify 5 minutes before you need to leave
      userId: event.userId
    }})
  .spread(function(travel, created) {
    console.log(created, ': travel was created');
      // schedule notification to be sent based on initial travel time, see workers/mapsWorker.js
    agenda.schedule(travel.dataValues.notificationTime, 'send notification', travel.dataValues);
    // instead of scheduling send notification, this should schedule 'query maps for traffic' job, which will then schedule a notifcation;
  });
}

const getAllTravel = function() {
  return Travel.findAll()
}

module.exports = {
  initiateTravel,
  getAllTravel
}