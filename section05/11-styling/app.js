//const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //res.status(404).send('<h1>Page not found!</h1>');
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(PORT); // this does create server as well