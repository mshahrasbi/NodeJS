
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