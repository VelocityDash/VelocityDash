const models = require('../models/models');
const Travel = models.Travel;


const initialTravel = function(event, initialEstimate) {
  Travel.findOrCreate({
    where: {eventId: event.id},
    defaults: {
      // origins: Sequelize.STRING,
      destination: event.location,
      initialEstimate: initialEstimate,
      queryTime: event.startDateTime, // need to subtract initial estimate
      // trafficEstimate: Sequelize.INTEGER,
      // mapsUrl: Sequelize.STRING,
      // notificationTime: Sequelize.DATE
    }})
  .spread(function(travel, created) {
    console.log(created, ': travel was created');
  });
}

modules.export = {
  initialTravel
}