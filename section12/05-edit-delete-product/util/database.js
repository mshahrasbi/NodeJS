const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
    // at the beginning if database 'shop' is not exist, it will create it for us
    MongoClient
    .connect('mongodb+srv://mshahrasbi:????????@mycluster-l8bwl.mongodb.net/shop?retryWrites=true&w=majority')
    .then( client => {
        console.log('Connected!')
        _db = client.db();
        cb();
    })
    .catch( err => {
        console.log(err)
        throw err;
    });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;