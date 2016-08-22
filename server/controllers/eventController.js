const Event = require('../db/queries').Event;
const addEvent = require('../utility/calendar/addEvent');
const addTravel = require('../utility/map/addTravel');
const queryTraffic = require('../workers/queryTraffic');
const google = require('googleapis');
const googleAuth = require('../utility/auth/googleAuth');
const Promise = require('bluebird');

const addEventAndAddTravel = (req, res) => {
  addEvent(req.userId, req.body)
  .spread((event, created) => {
    res.sendStatus(200);
    console.log('Event successfully added. Now adding travel.\n', event.dataValues);
    return addTravel(event);
  })
  .then(travel => {
    console.log('Travel successfully added. Now scheduling queryTraffic worker.');
    queryTraffic(travel);
  });
};

const getDayEvents = (req, res) => {
  Event.getDayEvents(req.userId)
  .then(datas => {
    res.send(datas);
  });
  // })
};

module.exports = {
  addEventAndAddTravel,
  getDayEvents
};
