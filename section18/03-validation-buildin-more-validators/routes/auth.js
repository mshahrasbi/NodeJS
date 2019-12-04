const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

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
                if (value === 'test@test.com') {
                    throw new Error('This Email address is forbidden.');
                }
        
                return true;
            }),
        body('password', 'Please enter a passowrd with only numbers and text and at least 5 characters.')
            .isLength({min: 5})
            .isAlphanumeric()
    ]
    , authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset:token', authController.getNewPassword); // sine we are looking for token in action method so we have to pass token as params

router.post('/new-password', authController.postNewPassword);

module.exports = router;