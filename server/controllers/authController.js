const User = require('../db/queries').User;
const googleAuth = require('../utility/auth/googleAuth');
const jwt = require('../utility/auth/jwt');
const getAllEvents = require('../utility/calendar/getAllEvents');
const checkCalendar = require('../workers/checkCalendar');
const moment = require('moment');


const authHandler = (req, res) => {
  // do oAuth with the token that comes back from google
  googleAuth.extensionIdentityAuth(req.body.token)
  .then(profile => {
    console.log(`user ${profile.displayName} is doing auth`);
    // auth the user by checking their googleId against our user table's googleID
    User.authUser(profile)
    .then(user => {
      // if user is not found, send back the googleCal web auth url
      if (!user) {
        res.json({
          message: 'Please sign in with Google Cal', 
          url: googleAuth.url
        }); 
      };
      // if user is found, log them in and give them the token and unique pubnub channel
      if (user) {
        var token = jwt.signJWT(user.dataValues.id);

        // get all of the users events from googleCal
        getAllEvents(user.dataValues.id);

        res.json({
          success: true,
          message: 'Here is your token and channel',
          token,
          channel: user.dataValues.pubnubid
        });
      };
    })
  })
  .catch(err => {
    console.log('did not get users profile', err);
    res.json({
      success: false,
      message: 'Please try logging in again'
    })
  });
};

const authCallback = (req, res) => {
  googleAuth.googleCalAuthCallback(req.query.code)
  .then((user) => {
    // create new user
    User.findOrCreateUser(user.profile, user.tokens)
    .spread((user, created) => {
      if (created) { // this is for new users
      // NOTE: REDIRECT THEM TO SPLASH PAGE HERE. 
        // res.redirect('/')
        // get all of the users events from googleCal
        getAllEvents(user.dataValues.id);
        
        // TO DO: Fix the recurring check
        // // schedule check at midnight
        // var midnightInUTC = moment().add(1, 'days').format('YYYY-MM-DD') + ' 06:59:00+00';
        // checkCalendar(midnightInUTC, user.dataValues.id);

        res.send('splash page');
      } else {
      // Could redirect them to same splash page
        // res.redirect('/')
        res.send('splash page');
      }
    })
  })
  .catch(err => {
    console.warn('Did not find user\'s profile in db for web oAuth', err);
  });
};


module.exports = {
  authHandler,
  authCallback
};