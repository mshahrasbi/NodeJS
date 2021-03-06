
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

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
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    ValidationErrors: []
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    ValidationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      ValidationErrors: errors.array()
    });
  }

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or passowrd.',
          oldInput: {
            email: email,
            password: password
          },
          ValidationErrors: []
        });
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
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or passowrd.',
            oldInput: {
              email: email,
              password: password
            },
            ValidationErrors: []
          });  
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
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      ValidationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12)
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
    })
    .catch(err => {
      // console.log(err);
      // OR
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        // console.log(err);
        // OR
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};


exports.getNewPassword = (req, res, next) => {

  // retrieve token 
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let message = req.flash('error') // here the error message will be removed after this call to flash('error')
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
    
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        passwordToken: token,
        userId: user._id.toString()
      });    
    })
    .catch(err => {
      // console.log(err);
      // OR
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      // console.log(err);
      // OR
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};