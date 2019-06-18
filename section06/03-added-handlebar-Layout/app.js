//const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const PORT = 3000;

const app = express();

app.engine('hbs', expressHbs(
    {
        layoutsDir: 'views/Layouts/',
        defaultLayout: 'main-layout',
        extname: 'hbs'
    }
));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});


app.listen(PORT); // this does create server as well