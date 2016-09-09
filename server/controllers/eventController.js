const Event = require('../db/queries').Event;
const addEvent = require('../utility/calendar/addEvent');
const addTravel = require('../utility/map/addTravel');
const removeEvent = require('../utility/calendar/removeEvent');
const queryTraffic = require('../workers/queryTraffic');
const google = require('googleapis');
const googleAuth = require('../utility/auth/googleAuth');
const Promise = require('bluebird');

const addEventAndAddTravel = (req, res) => {
  addEvent(req.userId, req.body)
  .spread((event, created) => {
    res.sendStatus(200);
    return addTravel(event);
  })
  .then(travel => { queryTraffic(travel); });
};

const getDayEvents = (req, res) => {
  Event.getDayEvents(req.userId)
    .then(datas => { res.send(datas); });
};

const deleteEventFromGcal = (req, res) => {
  removeEvent(req.userId, req.body.eventId)
    .then(() => {
      Event.deleteEvent(req.body.eventId);
    })
    .then(() => { res.sendStatus(204); })
    .catch(err => {
      console.log('Error deleting event from DB\n', err);
    });
};

module.exports = {
  addEventAndAddTravel,
  getDayEvents,
  deleteEventFromGcal
};