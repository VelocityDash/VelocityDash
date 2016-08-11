const models = require('../models/models');
const Travel = models.Travel;


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
      userId: event.userId
      // notify 5 minutes before you need to leave
    }})
  .spread(function(travel, created) {
    console.log(created, ': travel was created');
  });
}

const getAllTravel = function() {
  return Travel.findAll()
}

module.exports = {
  initiateTravel,
  getAllTravel
}