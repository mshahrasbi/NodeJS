
const User = require('../models/user');

exports.getLogin = (req, res, next) => {

   console.log(req.session);
   console.log(req.session.isLoggedIn);

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {

    User.findById("5d81789548b5f013380e1090")
        .then(
            user => {
                req.session.isLoggedIn = true;
                req.session.user = user; // the user is full mongoose model
                // make sure the session created first then do the redirect
                req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
        )
        .catch(err => {
            console.log(err);
        });
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

