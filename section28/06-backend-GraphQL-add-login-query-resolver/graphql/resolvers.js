
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


module.exports = {

    createUser: async function({userInput}, req) {

        console.log(userInput);

        const errors = [];

        if (!validator.isEmail(userInput.email)) {
            errors.push({message: 'email is invalid.'});
        }

        if (
            validator.isEmpty(userInput.password) || 
            !validator.isLength(userInput.password, {min: 5})
        ) {
            errors.push({message: 'Password too short!'});
        }
        
        console.log(errors);
        if (errors.length > 0) {
            const error = new Error('Invalid Inputs.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        // if you are not using the async await, the we need to return our findOne query which
        // we are executing here where we then add 'then' because if we dont return our promise
        // in the resolver, grapghql will not wait for it to resolve. 
        // when using the async await, it is automatically returned for us
        const existingUser = await User.findOne({email: userInput.email});
        if (existingUser) {
            const error = new Error("User exists already!");
            throw error;
        }

        const hashPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashPw
        });

        const createdUser = await user.save();

        return {
            ...createdUser._doc,
            _id: createdUser._id.toString()
        }
    },

    login: async function({email, password}) {
        const user = await User.findOne({email: email});
        if (!user) {
            const error = new Error('Invalid email address!');
            error.code = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Incorrect password!');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, 'somesupersecret', { expiresIn: '1h'});

        return { token: token, userId: user._id.toString() };
    }
}