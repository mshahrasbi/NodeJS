
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');


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
        }, 'secertsupersecertsecert', { expiresIn: '1h'});

        return { token: token, userId: user._id.toString() };
    },

    createPost: async function({ postInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        console.log('[createPost] postInput: ' , postInput);
        console.log('[createPost] postInput.title: ' , postInput.title);
        console.log('[createPost] postInput.content: ' , postInput.content);

        const errors = [];

        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })){
            errors.push({ message: 'Title is invalid.'});
        }

        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5 })){
            errors.push({ message: 'Content is invalid.'});
        }

        console.log(errors);
        if (errors.length > 0) {
            const error = new Error('Invalid Inputs.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Invalid User!');
            error.code = 401;
            throw error;
        }

        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: user
        });
        
        const createdPost = await post.save();
        user.posts.push(createdPost);
        /*
            User does not have the post added to his posts array, the reason for that is that we do push the post but there is one important
            steps need to be done as well, we need to save that change.
        */
        await user.save();
        return {...createdPost._doc, _id: createdPost._id.toString(), createdAt: createdPost.createdAt.toISOString(), updatedAt: createdPost.updatedAt.toISOString() }
    },

    posts: async function(args, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
                                .sort({ createdAt: -1})
                                .populate('creator');

        return { 
            posts: posts.map( p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString()
                };
            }), 
            totalPosts: totalPosts
        };

    }
}