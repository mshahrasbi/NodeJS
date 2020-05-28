
const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {

    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find()
        .countDocuments()
        .then( count => {
            totalItems= count;
            return Post.find()
                .populate('creator')
                .sort({createdAt: -1})
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then( posts => {
            res.status(200).json({
                messahe: 'Fetched Posts successfully.',
                posts: posts,
                totalItems: totalItems
            })
        })
        .catch( error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        });
}

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;

        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        
        throw error;
    }

    console.log('[createPost] file Path: ', req.file.path);

    const imageUrl = req.file.path;//.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;
    let creator;

    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
        });
        
    post.save()
        .then( result => {
            console.log(result);
            return User.findById(req.userId);
        })
        .then( user => {
            console.log('[createPost] post.save: ', user);
            creator = user;
            user.posts.push(post)
            return user.save();
        })
        .then(result => {

            io.getIO().emit('posts', {
                    action: 'create', 
                    post: { ...post._doc, creator: {_id: req.userId, name: user.name}}
                }
            );
            
            res.status(201).json({
                message: 'Post created successfully',
                post: post,
                creator: {_id: creator._id, name: creator.name }
            });
        })
        .catch( error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        });
}

exports.getPost = (req, res, next) => {

    const postId = req.params.postId;
    Post.findById(postId)
        .then( post => {
            if (!post) {
                const error = new Error('Could not find post. ');
                error.statusCode = 404;
                
                // we can throw error here, since we are inside of 'then' block and if we throw error here
                // the catch block will catch it
                throw error;
            }

            res.status(200).json({message: 'Post fetched.', post: post});
        })
        .catch( error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        });
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;

        throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .populate('creator')
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            // we want to check whether that creator ID is the ID of the currently 
            // logged in user so the ID that belong to the token we received
            if (post.creator._id.toString() !== req.userId ) {
                const error = new Error('Not Authorized!');
                error.statusCode = 403;
                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }

            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.save();
        })
        .then(result => {
            io.getIO().emit('posts', {
                    action: 'update', 
                    post: result
                }
            );

            res.status(200).json({message: 'Post updated!', post: result})
        })
        .catch( error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        });
}


exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            // we want to check whether that creator ID is the ID of the currently 
            // logged in user so the ID that belong to the token we received
            if (post.creator.toString() !== req.userId ) {
                const error = new Error('Not Authorized!');
                error.statusCode = 403;
                throw error;
            }

            clearImage(post.imageUrl);

            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            // we need to clear post Ids from users as well
            return User.findById(req.userId);
        })
        .then(user => {
            // call pull method from mongoose by passing postId that we want to remove
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            io.getIO().emit('posts', {
                action: 'delete',
                post: postId
            });
            
            res.status(200).json({message: 'Post deleted!'});
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            next(error);
        });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};