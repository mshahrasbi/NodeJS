
const express = require('express');
const bodyparser = require('body-parser');

const feedRoutes = require('./routes/feed');
const app = express();

// app.use(bodyparser.urlencoded); // x-www-form-urlencoded <form>
app.use(bodyparser.json()); // application/json

app.use('/feed', feedRoutes);

app.listen(8080);