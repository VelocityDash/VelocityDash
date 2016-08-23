const pubnub = require('../../setup/pubnub');
const User = require('../../db/queries').User;

const publishEventAdded = (userId, message) => {
  message.messageType = 'eventAdded';
  User.getUserChannel(userId)
  .then(user => {
    var channel = user.dataValues.pubnubid;
    pubnub.publish({
      message,
      channel,
      sendByPost: false, // true to send via post
      storeInHistory: false, // override default storage options
      meta: {} // publish extra meta with the request
    },
    (status, response) => {
      // handle status, response
      console.log('pubnub notification "eventAdded" was sent to client');
    });
  })
  .catch(err => {
    console.warn('did not find user in pubnub publishEventAdded');
  });
};

const publishTimeToLeave = (channel, message) => {
  message.messageType = 'timeToLeave';
  pubnub.publish({
    message,
    channel,
    sendByPost: false, // true to send via post
    storeInHistory: false // override default storage options
    // meta: { "cool": "meta" } // publish extra meta with the request
  },
  (status, response) => {
    // Handle status and response
    console.log('Map notification was created.');
  });
};

module.exports = {
  publishEventAdded,
  publishTimeToLeave
};