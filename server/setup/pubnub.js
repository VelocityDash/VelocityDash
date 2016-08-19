const PubNub = require('pubnub');

var pubnub = new PubNub({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    logVerbosity: true,
    // uuid: "myUniqueUUID",
    ssl: true,
    // origin: "custom.pubnub.com",
    presenceTimeout: 130,
    heartbeatInterval: 60
})

// example of publishing a message
// pubnub.publish(
//   {
//     message: { such: 'object' },
//     channel: 'ch1',
//     sendByPost: false, // true to send via post
//     storeInHistory: false, //override default storage options
//     meta: { "cool": "meta" } // publish extra meta with the request
//   },
//   function (status, response) {
//       // handle status, response
//   }
// ); 

module.exports = pubnub;
