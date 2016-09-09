const User = require('../db/queries').User;
const googleAuth = require('../utility/auth/googleAuth');
const jwt = require('../utility/auth/jwt');
const getAllEvents = require('../utility/calendar/getAllEvents');
const checkCalendar = require('../workers/checkCalendar');
const moment = require('moment');
const path = require('path');

const authHandler = (req, res) => {
  // oAuth with token that comes back from Google
  googleAuth.extensionIdentityAuth(req.body.token)
  .then(profile => {
    console.log(`User ${profile.displayName} is doing auth.`);
    // Auth the user by checking their googleId against our user table's googleID
    User.authUser(profile)
    .then(user => {
      // If user is not found, send back the googleCal web auth url
      if (!user) {
        res.json({
          message: 'Please sign in with Google Cal.', 
          url: googleAuth.url
        }); 
      }

      // If user is found, log them in and give them the token and unique pubnub channel
      if (user) {
        var token = jwt.signJWT(user.dataValues.id);

        // Get all of the users events from googleCal
        getAllEvents(user.dataValues.id);

        res.json({
          success: true,
          message: 'Here is your token and channel.',
          token,
          channel: user.dataValues.pubnubid
        });
      }
    });
  })
  .catch(err => {
    console.log('Error getting user\'s profile.\n', err);
    res.json({
      success: false,
      message: 'Please try logging in again.'
    });
  });
};

const authCallback = (req, res) => {
  googleAuth.googleCalAuthCallback(req.query.code)
  .then((user) => {
    res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    
    // Create new user
    User.findOrCreateUser(user.profile, user.tokens)
    .spread((user, created) => {
      if (created) {
        getAllEvents(user.dataValues.id);
        // TO DO: Fix the recurring check schedule check at midnight
        // var midnightInUTC = moment().add(1, 'days').format('YYYY-MM-DD') + ' 06:59:00+00';
        // checkCalendar(midnightInUTC, user.dataValues.id);
      } else {
      // Could redirect them to same splash page
        // res.redirect('/')
      }
    });
  })
  .catch(err => {
    console.warn('Did not find user\'s profile in db for web oAuth', err);
    res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
  });
};


module.exports = {
  authHandler,
  authCallback
};