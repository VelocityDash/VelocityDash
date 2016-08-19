const EventController = require('./../db/controllers/eventController');


const getDayEvents = (req, res) => {
  EventController.retrieveDayEvent()
  .then(datas => {
    res.send(datas);
  });
}

module.exports = getDayEvents;

