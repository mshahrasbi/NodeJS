
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const auth = require('./middleware/is-auth');

const app = express();

const fileStorage = multer.diskStorage({
    distination: function(req, file, cb) {
        const path = 'images';
        console.log('[fileStorage] ', path);
        cb(null, path);
    },
    filename: function(req, file, cb) {
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

app.use(bodyparser.json()); // application/json

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means all domains. But you can specify each domain and separated by comma
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(cors());


app.use(auth);

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
        throw new Error('Not authenticated!');
    }

    if (!req.file) {
        return res.status(200).json({message: 'No file provided!'});
    }

    if (req.body.oldPath) {
        clearImage(req.body.oldPath);
    }

    return res.status(201).json({message: 'File stored!', filePath: req.file.path});
});


app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
        console.log('[customFormatErrorFn] err: ', err);

        if (!err.originalError) {
            return err;
        }

        const data = err.originalError.data;
        const message = err.message;
        const code = err.originalError.code || 500;

        return {message: message, status: code, data: data};
    }
}));

app.use((error, req, res, next) => {
    console.log(error);

    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect('mongodb+srv://mshahrasbi:Majeedsh100@mycluster-l8bwl.mongodb.net/messages?retryWrites=true&w=majority')
    .then( result => {
        app.listen(8080);
    })
    .catch( err => console.log(err) );


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};