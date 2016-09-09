const jwt = require('jsonwebtoken');

const tokenOptions = { issuer: 'NeverMissOut' };

const signJWT = (userId) => {
  var token = jwt.sign({userId}, process.env.JWT_SECRET, tokenOptions);
  return token;
};

module.exports = {
  signJWT
};