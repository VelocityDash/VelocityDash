const Event = require('../models').Event;
// const { Event } = require('../models');
const moment = require('moment');
const zone = require('moment-timezone');
const db = require('../db.js');

// rename these to queries/eventQueries
// export all to index.js
const insertEvent = (userId, data) => {
  return Event.findOrCreate({
    where: { googleCalendarEventId: data.id },
    defaults: {
      userId: userId,
      name: data.summary,
      eventUrl: data.htmlLink,
      startdatetime: data.start.dateTime,
      enddatetime: data.end.dateTime,
      // currently not checking for recurrence since the calendar events query has "single events: true" which lists every single event
      recurrence: JSON.stringify(data.recurrence),
      location: data.location,
      description: data.description
    }
  });
}

const retrieveEvent = (id) => {
  return Event.findOne({
    where: {id: id}
  });
};

const getDayEvents = (userId) => {
  var nowInUTC = moment().utcOffset(0000).subtract(7, 'hours').format('YYYY-MM-DD HH:mm') + ':00+00';
  var midnightInUTC = moment().add(1, 'days').format('YYYY-MM-DD') + ' 06:59:00+00';
  return Event.findAll({
    where: {
      userId: userId,
      startdatetime: {$between: [nowInUTC, midnightInUTC]}
    }
  })
  .then(events => {
    events.forEach((event) => {
      event = event.dataValues;
      event.startdatetime = moment(event.startdatetime).format('LT');
    })
    return events;
  });
}

module.exports = {
  insertEvent,
  retrieveEvent,
  getDayEvents
};
