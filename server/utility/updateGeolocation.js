const UserController = require('./../db/controllers/userController');

const updateGeolocation = (req, res) => {
  // TO DO: User ID hardcoded for now, but should not be. The id should be in the request.
  var userId = 2;

  return UserController.updateUserGeolocation(userId, req.body.geolocation)
    .then((result) => { res.sendStatus(200); })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = updateGeolocation;