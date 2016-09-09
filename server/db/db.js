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
  .then(err => { console.log('Server is connected to AWS Postgres DB.'); })
  .catch(err => { console.log('Unable to connect to AWS Postgres DB\n', err); });

module.exports = db;
