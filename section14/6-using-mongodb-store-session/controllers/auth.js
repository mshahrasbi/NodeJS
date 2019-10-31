

exports.getLogin = (req, res, next) => {

   // const isLoggedIn = req.get('Cookie').split(';')[3].trim().split('=')[1] === 'true';

   console.log(req.session);
   console.log(req.session.isLoggedIn);

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('set-cookie', 'LoggedIn=true; Max-Age=10');
    req.session.isLoggedIn = true;
    res.redirect('/');
};
