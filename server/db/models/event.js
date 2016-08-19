const Sequelize = require('sequelize');
const db = require('../db.js');

module.exports = db.define('event', {
  googleCalendarEventId: Sequelize.STRING,
  name: Sequelize.STRING,
  eventUrl: Sequelize.STRING,
  startdatetime: Sequelize.DATE,
  enddatetime: Sequelize.DATE,
  allDay: Sequelize.BOOLEAN,
  recurrence: Sequelize.STRING,
  location: Sequelize.STRING,
  description: Sequelize.STRING
});
