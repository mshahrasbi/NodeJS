

exports.getLogin = (req, res, next) => {

    const isLoggedIn = req.get('Cookie').split(';')[3].trim().split('=')[1] === 'true';

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    // req.isLoggedIn = true; // this is not good way to do this right before respond
    // set cookie in header
    res.setHeader('set-cookie', 'LoggedIn=true');
    res.redirect('/');
};
