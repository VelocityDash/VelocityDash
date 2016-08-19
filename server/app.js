const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db/db.js');
const session = require('express-session')
// const models = require('./db/models/models');
// const Event = require('./db/')

const router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/public/dist/')));

var allowCrossDomain = function(req, res, next) {
  var allowedHost = [
    'http://localhost',
    'http://localhost:9000',
    'chrome-extension:// fmjmpkklgmmfnbfeembiokopaknddecl'
  ];

  if(allowedHost.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  } else {
    console.log('FAILED the Cors origin test:', req.session.username);
    res.send(401, {auth: false});
  }
}

  app.use(session({secret: 'secret',
  resave: false,
  saveUninitialized: true}));
  // app.use(allowCrossDomain);

app.all('/api/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  if (req.method.toLowerCase() !== "options") {
   return next();
  }
  return res.sendStatus(204);
})

app.use('/api', router);

app.get('/', (req, res) => {
  // google username
  console.log('req', req.session);
  if (typeof req.session.googleid !== 'undefined') {
    console.log('verified login: ', req.session.googleid);
    res.sendFile(path.join(__dirname + '/../client/public/dist/index.html'));
    res.send({auth: true, id: req.session.googleid})
  }

});

module.exports = app;
