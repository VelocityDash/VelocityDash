const Sequelize = require('sequelize');
require('dotenv').config();
// const sequelize = new Sequelize('postgres://localhost:9000/nmodb');

//TRY sequelize above first, if it doesn't work try the one below

const sequelize = new Sequelize('nevermissout', process.env.PSQL_username, process.env.PSQL_password, {
  dialect: 'postgres',
  protocol: 'postgres',
  host: 'ec2-52-33-110-254.us-west-2.compute.amazonaws.com',
  // host: 'localhost',
  port: 5432,
  dialectOptions: { ssl: true },
  logging: false,
  define: { timestamps: false }
});

// Test Sequelize connection
sequelize.authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:\n', err);
  });

const Users = sequelize.define('users', {
  userId: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  lastName: { type: Sequelize.STRING, allowNull: false },
  firstName: { type: Sequelize.STRING, allowNull: false },
  calendarId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Calendar, key: 'calendarId'} },
  email: { type: Sequelize.STRING, allowNull: false },
  oauthToken: { type: Sequelize.STRING, allowNull: true }
});

const Calendar = sequelize.define('calendar', {
  calendarId: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false }
});

const Events = sequelize.define('events', {
  eventId: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  googleCalendarEventId: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  creatorId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Users, key: 'userId'} },
  eventUrl: { type: Sequelize.STRING, allowNull: false },
  startDateTime: { type: Sequelize.DATE, allowNull: false },
  endDateTime: { type: Sequelize.DATE, allowNull: false },
  allDay: { type: Sequelize.BOOLEAN, allowNull: false },
  recurrence: { type: Sequelize.STRING, allowNull: true },
  location: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: true },
  guestListId: { type: Sequelize.INTEGER, allowNull: false, references: {model: GuestLists, key: 'guestListId'} },
  calendarId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Calendar, key: 'calendarId'} }
});

const GuestLists = sequelize.define('guestLists', {
  guestListId: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  eventId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Events, key: 'eventId'} }
});

const GuestListUsers = sequelize.define('guestListUsers', {
  guestListId: { type: Sequelize.INTEGER, allowNull: false, references: {model: GuestLists, key: 'guestListId'} },
  userId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Users, key: 'userId'} }
});

const Travel = sequelize.define('travel', {
  travelId: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  eventId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Events, key: 'eventId'} },
  startingPoint: { type: Sequelize.STRING, allowNull: false },
  queryTime: { type: Sequelize.DATE, allowNull: false },
  initialEstimate: { type: Sequelize.INTEGER, allowNull: false },
  trafficEstimate: { type: Sequelize.INTEGER, allowNull: false },
  mapsUrl: { type: Sequelize.STRING, allowNull: false },
  notificationTime: { type: Sequelize.DATE, allowNull: false }
});

const Attachments = sequelize.define('attachments', {
  attachmentId: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  eventId: { type: Sequelize.INTEGER, allowNull: false, references: {model: Events, key: 'eventId'} },
  fileUrl: { type: Sequelize.STRING, allowNull: false },
  filetype: { type: Sequelize.STRING, allowNull: false }
});