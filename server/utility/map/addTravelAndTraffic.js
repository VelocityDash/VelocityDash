const addTravel = require('./addTravel');
const queryTraffic = require('../../workers/queryTraffic');
const Event = require('../../db/queries').Event;

const addToTravelAndTraffic = (userId) => {
  return Event.getAllUserEvents(userId)
  .then(events => {
    events.forEach(event => addTravel(event).then(travel => queryTraffic(travel)));
  })
  .catch(err => { console.warn('Error adding initial user events to travel and traffic.\n', err); });
};

module.exports = addToTravelAndTraffic;