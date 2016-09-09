const getAllEvents = require('../utility/calendar/getAllEvents');
const agenda = require ('./agenda');
const moment = require('moment');

agenda.define('check calendar', (job, done) => {
  var midnightInUTC = moment().add(1, 'days').format('YYYY-MM-DD') + ' 06:59:00+00';
  
  scheduleCheckCalendar(midnightInUTC, userId);
  
  return getAllEvents(job.attrs.data.userId);
});

const checkCalendar = (time, userId) => {
  agenda.schedule(time, 'check calendar', userId);
};

module.exports = checkCalendar; 