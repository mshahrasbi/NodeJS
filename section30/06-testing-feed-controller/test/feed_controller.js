

const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');


describe('Feed Controller -- ', function() {

     before(function(done) {
        mongoose.connect('mongodb+srv://mshahrasbi:Majeedsh100@mycluster-l8bwl.mongodb.net/test-messages?retryWrites=true&w=majority')
        .then( result => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'Test',
                posts: [],
                _id: 'fc0f66b979af55031b34728b'
            });

            return user.save();
        })
        .then(() => {
            done();
        })
     });

     beforeEach(function() {});

    it('Should add a created post to the posts of the creator', function(done) {

        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: 'fc0f66b979af55031b34728b'
        };

        const res = { status: function() { return this; }, json: function() {}};

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });

    });

    afterEach(function() {});

    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    })

});