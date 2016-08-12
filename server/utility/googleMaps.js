const Event = require('./../db/controllers/eventController');
const Travel = require('./../db/controllers/travelController');
const request = require('request');
require('dotenv').config();


const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const origins = 'Hack Reactor, 944 Market St, San Francisco, CA 94102';

const getInitialTravelTime = function(event) {
    var options = {
      url,
      qs: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: origins, 
        destinations: event.dataValues.location,
        mode: 'driving',
        arrival_time: event.dataValues.startDateTime,
        // departure_time: 'now', 
        units: 'imperial'
        // traffic_model: 'best_guess'
      }
    };
    request(options, function (error, response, body) {
      // console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        // console.log(event, '(', destinations, ')');
        body = JSON.parse(body);
        console.log(body.rows[0].elements[0]);
        var distance = body.rows[0].elements[0].distance;
        var duration = body.rows[0].elements[0].duration;

        // add data to Travel table, see /db/controllers/travelController
        Travel.initiateTravel(event, (duration.value * 1000)); // convert seconds to milliseconds
      }
    });
};

const getTrafficTime = function(eventId) {
  Event.retrieveEvent(eventId)
  .then((event) => {
    var options = {
      url,
      qs: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: origins, 
        // origins needs to be changed to the user's current location or previous location
        destinations: event.dataValues.location,
        // can probably store destinations in job? 
        mode: 'driving',
        departure_time: 'now', 
        units: 'imperial',
        traffic_model: 'best_guess'
      }
    };
    request(options, function (error, response, body) {
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        console.log(body.rows[0].elements[0]);
        var distance = body.rows[0].elements[0].distance;
        var duration = body.rows[0].elements[0].duration;
        var traffic = duration.value * 1000; // convert seconds to milliseconds
      }
    })
  })
};


module.exports = {
  getInitialTravelTime,
  getTrafficTime
}

/* GAME PLAN

when a new event is added to main event table, the travelWorker will also check to see if the event already exists in the database's travel table. 

if not, the travelWorker will query google maps api for an estimate of how long it will take to travel to the event from the user's previous event's geolocation. alternatively, could make this query with the user's current geolocation from the browser, assuming that they are usually in one place (could be that on weekends, early mornings and late nights, they are most likely at home, and rest of time at work).

then the travelWorker will create the event in the travel table with a foreign key to the event's other information, and a field for how long it is estimated to take to get there, and a field for the "estimated leave by" time. For example, if I need to be at Hack Reactor at 8:50 am and my previous location is home, and it takes me 30 minutes to get here, then the "estimated leave by" field is 8:20 am. 

MMMMVP: server will tell chrome extension to fire notifications at 15 minutes, and then 5 minutes before the "estimated leave by" time.
chrome extension's background.js file will need to be running a socket to receive message about when to fire notification.

set chron worker... based on distance? 
For now, start two hours ahead on top of the usual duration time, and set chron to start the worker to check google maps API for travel time w traffic, with the departure_time set to... now?. It will create a "day of leave by" time in the database based on traffic. 



*/
