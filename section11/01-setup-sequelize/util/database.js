
const Sequelize = require('sequelize');

// setup a connection pool..
const sequelize = new Sequelize(
        'node-complete', 
        'root', 
        '!!!!!!!!', 
        {
            dailect: 'mysql', 
            host: 'localhost'
        }
    );

    module.exports = sequelize; 
