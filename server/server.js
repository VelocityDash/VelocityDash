const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db/db.js');
const router = require('./routes');
const server = require('http').Server(app);
const pubnub = require ('./pubnub');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/public/dist/')));

app.all('/api/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  if (req.method.toLowerCase() !== "options") {
   return next();
  }
  return res.send(204);
})
app.use('/api', router);

app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname + '/../client/public/dist/index.html'));
});

server.listen(9000, () => {
  console.log('listening to port 9000');
});
