const Event = require('../../db/queries').Event;
const addTravel = require('../map/addTravel');
const queryTraffic = require('../../workers/queryTraffic');
const googleCal = require('./googleCal');

const getAllEvents = (userId) => {
  googleCal.getEventsFromGoogleCal(userId) 
  .then(events => {
    events.items.forEach(event => { addToEventDB(userId, event); });    
  });
};

const addToEventDB = (userId, event) => {
  Event.insertEvent(userId, event)
  .spread((event, created) => {
    if (created) {
      console.log('Event successfully added.\n', event.dataValues);
    }
  })
  .catch(err => { console.warn('Error adding events to DB.\n', err); });
};

module.exports = getAllEvents;