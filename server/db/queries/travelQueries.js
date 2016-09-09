const Travel = require('../models').Travel;

const initiateTravel = (event, initialEstimate) => {
  return Travel.findOrCreate({
    where: {eventId: event.id},
    defaults: {
      destination: event.location,
      initialEstimate: initialEstimate,
      queryTime: new Date(Date.parse(event.startdatetime) - (initialEstimate * 2)),
      notificationTime: new Date(Date.parse(event.startdatetime) - (initialEstimate + 300000)), // Sends notification 5 minutes prior
      userId: event.userId
    }
  });
};

const getAllTravel = () => Travel.findAll();

module.exports = {
  initiateTravel,
  getAllTravel
};