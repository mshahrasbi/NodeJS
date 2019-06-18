const http = require('http');
const express = require('express');

const PORT = 3000;

const app = express();

app.use('/', (req, res, next) => {
    console.log('This always runs!')
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log("In the middleware!");
    res.send('<h1>The "Add Product" page</h1>');
    //next(); // this allows the request to continue to the next middleware
});


app.use('/', (req, res, next) => {
    console.log("In another middleware!");
    // ...
    res.send('<h1>Hello from express!</h1>')
});



app.listen(PORT); // this does create server as well