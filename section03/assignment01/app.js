
const http = require('http');

const routes = require('./routes');


// Spin up a node.js - driven Server (on port 3000)
const PORT = 3000
const server = http.createServer(routes.handler);
server.listen(PORT);



// Handle two routes: '/' and '/users'
// . Returnsome greeting text on '/'
// . Return a list of dummay users (e,g <ul><li>User1</li></ul>)


// Add a form with a 'username' <input> to the '/' page and submit a post
// request to '/create-user' upon a button click


// Add the '/create-user' route and parse the incoming data (i.e. the
// username) and simply log it to the console
