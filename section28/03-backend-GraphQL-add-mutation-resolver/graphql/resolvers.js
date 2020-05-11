
const bcrypt = require('bcryptjs');

const User = require('../models/user');


module.exports = {

    createUser: async function({userInput}, req) {

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
    }
}