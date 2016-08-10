const User = require('./user.js');
const Calendar = require('./calendar.js');
const Event = require('./event.js');
const GuestList = require('./guestList.js');
const GuestListUser = require('./guestListUser.js');
const Travel = require('./travel.js');
const Attachment = require('./attachment.js');

// Set up relationships
Calendar.belongsTo(User);
User.hasMany(Calendar);

Event.belongsTo(User);
User.hasMany(Event);

GuestList.belongsTo(Event);
Event.hasOne(GuestList);

Event.belongsTo(Calendar);
Calendar.hasMany(Event);

GuestListUser.belongsTo(GuestList);
GuestList.hasMany(GuestListUser);

GuestListUser.belongsTo(User);
User.hasMany(GuestListUser);

Travel.belongsTo(Event);
Event.hasOne(Travel);

Travel.belongsTo(User);
User.hasMany(Travel);

Attachment.belongsTo(Event);
Event.hasMany(Attachment);

// Sync tables
User.sync()
.then(function() {
  Event.sync()
})
.then(function() {
  Calendar.sync()
})
.then(function() {
  GuestList.sync()
})
.then(function() {
  GuestListUser.sync()
})
.then(function() {
  Travel.sync()
})
.then(function() {
  Attachment.sync()
})
.catch((err) => {console.warn('error in syncing')})
;

module.exports = {
  User: User,
  Calendar: Calendar,
  Event: Event,
  GuestList: GuestList,
  GuestListUser: GuestListUser,
  Travel: Travel,
  Attachment: Attachment
};