const path = require('path');
const router = require('express').Router();
const GoogleAuthUrl = require('./setup/googleOAuth').url;
const getAllEventsFromCalendar = require('./utility/getAllEventsFromCalendar');
const addEvent = require('./utility/addEvent');
const addTravel = require('./utility/addTravel');
const getUserGeolocation = require('./utility/getUserGeoLocation');
const updateGeolocation = require('./utility/updateGeolocation');
const getDayEvents = require('./utility/getDayEvents');
const authCallback = require('./utility/authCallback');
const queryTraffic = require('./workers/queryTraffic');

// put this parent function elsewhere later, but for now keep it here to understand what is happening.
// first add event, then add travel, then set up queryTraffic worker
var addEventAndAddTravel = (req, res) => {
  addEvent(req, res)
  .spread((event, created) => {
    console.log('event was added, now adding travel', event.dataValues);
    return addTravel(event); 
  })
  .then(travel => {
    console.log('travel was added, now scheduling queryTraffic worker');
    queryTraffic(travel);
  })
}

router.get('/test', function(req, res) {
  res.sendStatus(200);
});
// Authorization Routes

router.get('/auth', function(req, res) {
  res.redirect(GoogleAuthUrl);
});
// google redirect after auth sign in to get code for access token/refresh token
router.get('/authCallback', authCallback);

// Calendar Routes
router.post('/calendar/addEvent', addEventAndAddTravel);
router.get('/calendar/getDayEvents', getDayEvents);

// this endpoint is not doing anything, it was just to trigger a function to fetch all of the user's events in the calendar, but we can do this on the auth callback page or elsewhere
// router.get('/calendar/getAllEvents', getAllEventsFromCalendar);

// User Routes
router.get('/users/getGeolocation', getUserGeolocation);
router.post('/users/updateGeolocation', updateGeolocation);

module.exports = router;
