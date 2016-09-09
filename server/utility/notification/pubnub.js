const pubnub = require('../../setup/pubnub');
const User = require('../../db/queries').User;

const publishEventAdded = (userId, message) => {
  message.messageType = 'eventAdded';
  User.getUserChannel(userId)
  .then((user) => {
    var channel = user.dataValues.pubnubid;

    pubnub.publish({
      message,
      channel,
      sendByPost: false, // true to send via post
      storeInHistory: false, // override default storage options
      meta: {} // publish extra meta with the request
    }, (status, response) => { console.log('Pubnub notification "eventAdded" was sent to client.'); });
  })
  .catch((err) => { console.warn('Error finding user in Pubnub.'); });
};

const publishTimeToLeave = (channel, message) => {
  message.messageType = 'timeToLeave';
  pubnub.publish({
    message,
    channel,
    sendByPost: false,
    storeInHistory: false
  }, (status, response) => {
    console.log(status, 'in publishTimeToLeave pubnub notification.\nMap notification was created.');
  });
};

module.exports = {
  publishEventAdded,
  publishTimeToLeave
};