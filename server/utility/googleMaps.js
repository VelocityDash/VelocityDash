const Event = require('./../db/controllers/eventController');
const Travel = require('./../db/controllers/travelController');

const getInitialTravelTime = function(eventId) {
  Event.retrieveEvent(eventId)
  .then((event) => {
    // request
  })
}

getInitialTravelTime(1);

module.exports = {
  getInitialTravelTime
}