const Sequelize = require('sequelize');
const db = require('../db.js');

module.exports = db.define('user', {
  lastName: Sequelize.STRING,
  firstName: Sequelize.STRING,
  email: Sequelize.STRING,
  googleid: Sequelize.STRING,
  pubnubid: Sequelize.STRING,
  refreshToken: Sequelize.STRING,
  accessToken: Sequelize.STRING,
  geolocation: Sequelize.STRING
});
