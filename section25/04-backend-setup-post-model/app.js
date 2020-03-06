
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const app = express();

// app.use(bodyparser.urlencoded); // x-www-form-urlencoded <form>
app.use(bodyparser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means all domains. But you can specify each domain and separated by comma
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

    next();
});

app.use('/feed', feedRoutes);

mongoose.connect('mongodb+srv://mshahrasbi:Majeedsh100@mycluster-l8bwl.mongodb.net/messages?retryWrites=true&w=majority')
    .then( result => {
        app.listen(8080);
    })
    .catch( err => console.log(err) );

