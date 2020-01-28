
const express = require('express');
const bodyparser = require('body-parser');

const feedRoutes = require('./routes/feed');
const app = express();

// app.use(bodyparser.urlencoded); // x-www-form-urlencoded <form>
app.use(bodyparser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means all domains. But you can specify each domain and separated by comma
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
});

app.use('/feed', feedRoutes);

app.listen(8080);