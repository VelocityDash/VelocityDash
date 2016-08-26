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
};

const retrieveEvent = (id) => {
  return Event.findOne({
    where: {id: id}
  });
};

const getDayEvents = (userId) => {
  // Postgres stores time data in UTC time
  // var nowInUTC = moment().utcOffset('0000').subtract(7, 'hours').format('YYYY-MM-DD HH:mm') + ':00+00';
  // var midnightInUTC = moment().add(1, 'days').format('YYYY-MM-DD') + ' 06:59:00+00';
  var nowInUTC = moment().utcOffset('0000').format('YYYY-MM-DD HH:mm') + ':00+00';
  var nextDayInUTC = moment().add(1, 'days').format('YYYY-MM-DD HH:mm') + ':00+00';
  // nextDayInUTC is not exactly midnight, and it is 1 day forward from locale time, but deployed server is in UTC
  return Event.findAll({
    where: {
      userId: userId,
      startdatetime: {$between: [nowInUTC, nextDayInUTC]}
    }
  })
  .then(events => {
    events.forEach((event) => {
      event = event.dataValues;
      // this converts to local time, but the deployed server is running on UTC time
      // event.startdatetime = moment(event.startdatetime).format('LT');
    });
    return events;
  });
};

const getAllUserEvents = (userId) => {
  return Event.findAll({
    where: {userId}
  });
};

const deleteEvent = (eventId) => {
  return Event.destroy({
    where: { googleCalendarEventId: eventId}
  })
  .catch(err => {
    console.log('did not delete from db', err);
  });
};

module.exports = {
  insertEvent,
  retrieveEvent,
  getDayEvents,
  getAllUserEvents,
  deleteEvent
};
