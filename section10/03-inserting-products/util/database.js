
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '!!!!!!!!!!!!!!!!'
});

// we can now export this pool and it will export it in a special way, promise() here
// this will allow us to use promises when working with connections which handle asynchroonouse
// tasks
module.exports = pool.promise();