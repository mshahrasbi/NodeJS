
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    // a user also have a couple of posts, so We will add posts. This will be an array, and each object in that
    // array will be of type schema types ObjectId, because this will be a reference to a post and therefore I add
    // this 'ref' key and add the Post model. So I will reference to posts in our users.
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model('User', userSchema);