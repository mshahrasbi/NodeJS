
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
//const uuidv4 = require('uuid/v4');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
    distination: function(req, file, cb) {
        //cb(null, 'images');
        const path = 'images';
        console.log('[fileStorage] ', path);
        cb(null, path);
    },
    filename: function(req, file, cb) {
        //const extension = file.mimetype.slice(6, file.mimetype.length);
        //cb(null, uuidv4() + '.' + extension);
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = function(req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// app.use(bodyparser.urlencoded); // x-www-form-urlencoded <form>
app.use(bodyparser.json()); // application/json

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means all domains. But you can specify each domain and separated by comma
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);

    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose.connect('mongodb+srv://mshahrasbi:Majeedsh100@mycluster-l8bwl.mongodb.net/messages?retryWrites=true&w=majority')
    .then( result => {
        app.listen(8080);
    })
    .catch( err => console.log(err) );

