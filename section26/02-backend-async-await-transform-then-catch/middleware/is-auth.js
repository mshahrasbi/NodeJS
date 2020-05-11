const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    const authorizationHeader = req.get('Authorization');
    if (!authorizationHeader) {
        const error = new Error('No Authentication header.');
        error.statusCode = 401;
        throw error;
    }

    const token = authorizationHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'secertsupersecertsecert')
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not Authenticated.');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next(); 
}