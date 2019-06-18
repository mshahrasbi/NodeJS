
const http = require('http');

const routes = require('./routes');

const PORT = 3000


console.log(routes.someText);

// crete a server
const server = http.createServer(routes.handler);

// server listen
server.listen(PORT);

