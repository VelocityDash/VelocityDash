const Sequelize = require('sequelize');

// Connect to database
const db = new Sequelize('velocitydashdb', process.env.PSQL_username, process.env.PSQL_password, {
  dialect: 'postgres',
  protocol: 'postgres',
  host: process.env.AWS_PSQL,
  port: 5432,
  dialectOptions: { ssl: true },
  logging: false,
  define: { timestamps: true }
});

// Test Sequelize connection
db.authenticate()
  .then(err => {
    console.log('Server is connected to AWS postgres db.');
  })
  .catch(err => {
    console.log('Unable to connect to Postgres AWS database:\n', err);
  });

module.exports = db;
