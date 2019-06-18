
// 1 - create a npm project and install express.js and nodemon 
const express = require('express');

const PORT = 3000;

const app = express();

// 2 - create an express.js app which funnels the requests through 2 middleware
//      functions that log something to the console and return one response.

// app.use((req, res, next) => {
//     console.log('First Middleware');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('SecondMiddleware');
//     res.send('<p>I am at the end of the world!</p>');
// });


// 3 - handle requests to '/' and '/users' such that each request only has one
//      handler/ middleware that does something with it (e.g send dummy response)
app.use('/user', (req, res, next) => {
    console.log('Middleware /user');
    res.send('<h2>Salam from Iran!</h2>');
});

app.use('/', (req, res, next) => {
    console.log('Middleware /');
    res.send('<h1>Hello from Mohammad Shahrasbi</h1>');
});





app.listen(PORT);