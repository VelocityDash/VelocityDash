const Event = require('../../db/queries').Event;
const addTravel = require('../map/addTravel');
const queryTraffic = require('../../workers/queryTraffic');
const googleCal = require('./googleCal');


const getAllEvents = (userId) => {
  googleCal.getEventsFromGoogleCal(userId) 
  .then(events => {
    events.items.forEach(event => {
      addToDB(userId, event);
    });    
  });
};

const addToDB = (userId, event) => {
  Event.insertEvent(userId, event)
  .spread((event, created) => {
    if (created) {
      console.log('Event successfully added. Now adding travel.\n', event.dataValues);
      return addTravel(event);      
    } else {
      return null;
    }
  })
  .then(travel => {
    if (!travel) {
      console.log('Travel successfully added. Now scheduling queryTraffic worker.');
      return queryTraffic(travel);      
    }
  })
  .catch(err => {
    console.warn('error in getAllEvents fetch', err);
  });
};

module.exports = getAllEvents;
