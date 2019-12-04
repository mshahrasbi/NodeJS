const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', 
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom( (value, {req}) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This Email address is forbidden.');
                // }
        
                // return true;
                /*
                what this return will do?
                The express validator package will check for a custom validator to return true or false, to return a thrown error
                or to return a promise.
                if it is a promise as is the case with this because here we ultimately return a promise because every then block
                implicitly returns a new promise, so if we return a promise then express validator will wait for this promise to
                be fulfilled and if it fulfills with in our case nothing, so basically no error, then it treats this validation as
                successful. if it resolves with some rejection, then express validator will detect this rejection and will store 
                this as an error, this error message will then be stored as an error message. And this is how we can add our own
                asynchronous validation, asynchronous because we have to reach out to the DB which of course is not an instant task
                but express validator will kind of wait for us here.
                */
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-mail exists already, please pick a different one.');
                        }
                    });
                }),

        body('password', 'Please enter a passowrd with only numbers and text and at least 5 characters.')
            .isLength({min: 5})
            .isAlphanumeric(),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('passwords have to match!');
                }
                return true;
            })
    ]
    , authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset:token', authController.getNewPassword); // sine we are looking for token in action method so we have to pass token as params

router.post('/new-password', authController.postNewPassword);

module.exports = router;