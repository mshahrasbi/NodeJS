
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport(
    {
        auth: {
            api_key: 'Key from sendgrid account'
        }
    }
));


const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error') // here the error message will be removed after this call to flash('error')
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error') // here the error message will be removed after this call to flash('error')
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or passowrd.');
        return res.redirect('/login');
      }

      
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          
          req.flash('error', 'Invalid email or passowrd.');
          res.redirect('/login');
        })
        .catch( err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email exists already.');
        return res.redirect('/signup');
      }
  
      return bcrypt.hash(password, 12)
              .then(hashedPassword => {
                const user = new User({
                  email: email,
                  password: hashedPassword,
                  cart: { items: [] }
                });
          
                return user.save();         
              })
              .then( result => {
                res.redirect('/login');

                // // send email
                // return transporter.sendMail(
                //   {
                //     to: email,
                //     from: 'shop@node-complete.com',
                //     subject: 'Signup succeeded!',
                //     html: '<h1>You successfully signed up!</h1>'
                //   }
                // )
                // .catch( err => {
                //   console.log(err);
                // });
              });
  
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error') // here the error message will be removed after this call to flash('error')
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });

};


exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({email: req.body.email})
      .then( user => {
        if (!user) {
          req.flash('error', 'No account with that email');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // valid for one hour only
        return user.save();
      })
      .then( result => {
        res.redirect('/');
        // // send email
        // transporter.sendMail(
        //   {
        //     to: req.body.email,
        //     from: 'shop@node-complete.com',
        //     subject: 'password reset',
        //     html: `
        //        <p>You request a password reset</p>
        //        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>
        //        `
        //   }
        // )
        // .catch( err => {
        //   console.log(err);
        // });      
      })
      .catch(err => {
        console.log(err);
      });
  });
};