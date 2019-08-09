
const Sequelize = require('sequelize');

// setup a connection pool..
const sequelize = new Sequelize(
        'node-complete', 
        'root', 
        '*****************', 
        {
            dialect: 'mysql', 
            host: 'localhost'
        }
    );

    module.exports = sequelize; 
