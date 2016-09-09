const path = require('path');
const router = require('express').Router();
const AuthController = require('./controllers').Auth;
const EventController = require('./controllers').Event;
const UserController = require('./controllers').User;
const queryTraffic = require('./workers/queryTraffic');
const jwt = require('jsonwebtoken');

router.use('/api', function(req, res, next) {
  var token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {issuer: 'NeverMissOut'}, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token, please log-in again'});
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
});

// For testing purposes
router.get('/api/test', (req, res) => { res.sendStatus(200); });

// Auth Routes
router.post('/auth', AuthController.authHandler);
router.get('/verified', AuthController.authCallback); // Google redirect after auth sign in to get code for access token/refresh token

// Calendar Routes
router.delete('/api/calendar/deleteEvent', EventController.deleteEventFromGcal);
router.post('/api/calendar/addEvent', EventController.addEventAndAddTravel);
router.get('/api/calendar/getDayEvents', EventController.getDayEvents);

// User Routes
router.get('/api/users/getTransit', UserController.getTransitMode);
router.post('/api/users/updateTransit', UserController.updateTransitMode);
router.post('/api/users/updatePhoneNumber', UserController.updatePhoneNumber);
router.get('/api/users/getGeolocation', UserController.getGeolocation);
router.post('/api/users/updateGeolocation', UserController.updateGeolocation);

module.exports = router;