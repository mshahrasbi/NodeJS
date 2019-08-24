const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// we will register a new middleware because We want to store that user
// in our request so that we can use it from anywhere in our app conveniently
// So here we will reach out to DB and retrieve our user with findByPk id 4
// So this code will only run for incoming requests which on the other hand can
// only reach this if we did successfully start our server.
// So what we want to do with our user in the request, we store it in request,
// we can simply add new field to our request object. This user from DB is not
// JS object it is Sequelize object 
app.use((req, res, next) => {
    // User.findByPk(3)
    //     .then(
    //         user => {
    //             req.user = user;
    //             next();
    //         }
    //     )
    //     .catch( err => { console.log(err); });
    next();
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});
