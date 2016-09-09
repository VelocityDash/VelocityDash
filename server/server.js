const app = require('./app');
const server = require('http').Server(app);

server.listen(8080, () => {
  console.log('Express is listening on port 8080.');
});