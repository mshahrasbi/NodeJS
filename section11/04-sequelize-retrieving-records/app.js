const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// it will sync our models to the database by
// creating the appropriate tables and relations
sequelize.sync()
    .then(result => {
        // console.log(result);
        console.log('Server started at port 3000 ...');
        app.listen(3000);
    })
    .catch(err => console.log(err));

