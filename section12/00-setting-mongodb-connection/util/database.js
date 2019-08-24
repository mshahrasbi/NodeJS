const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
    MongoClient
    .connect('mongodb+srv://mshahrasbi:!!!!!!!!!!@mycluster-l8bwl.mongodb.net/test?retryWrites=true&w=majority')
    .then( client => {
        console.log('Connected!')
        cb(client);
    })
    .catch( err => console.log(err) );
}


module.exports = mongoConnect;