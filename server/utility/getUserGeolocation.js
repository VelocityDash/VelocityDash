const UserController = require('./../db/controllers/userController');

const getUserGeolocation = (req, res) => {
  // TO DO: User ID hardcoded for now, but should not be. The id should be in the request.
  var userId = 2;

  return UserController.getGeolocation(userId)
    .then((data) => { res.send(data.dataValues); })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = getUserGeolocation;