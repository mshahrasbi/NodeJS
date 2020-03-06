
const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {

    Post.find()
        .then( posts => {

            res.status(200).json({
                messahe: 'Fetched Posts successfully.',
                posts: posts
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

    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
        creator: { name: 'mohammad'},
        });
    post.save()
        .then( result => {
            console.log(result);

            res.status(201).json({
                message: 'Post created successfully',
                post: result
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
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
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
            res.status(200).json({message: 'Post updated!', post: result})
        })
        .catch( error => {
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