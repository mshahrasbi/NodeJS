

const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');


describe('Auth Controller -- Login', function() {

    /**
     * here AuthController for login is a async method. So Mocha make it easier for us by allowing
     * use to call the done() method. So done() will tell the mocha to wait. So you can call once this
     * case is done by default it is done once the execute the code top to bottom, but if you except
     * this argument, it will actually wait for you to call it and then you can call it in a asynchronous
     * code sneppet. done() we signal that I want mocha to wait for this code to execute because before
     * it treats this test case as done.
     */

    it('Should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });


    /**
     * this test will do the test on user status, so we have to connected to mongodb and insert the user
     * then call on our test to be able to verify the user status. This solution isnot an optimal solution
     * since we always have to clean up the db and the code is a bit complicated.
     * A better way doing is using Hook. 
     */
    it('Should send a response with a valid user status for an existing user', function(done) {

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
            const req = { userId: 'fc0f66b979af55031b34728b' };
            const res = {
                statusCode: 500,
                userStatus: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.userStatus = data.status;
                }
            };
            
            AuthController.getUserStatus(req, res, () => {})
                .then(() => {
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.userStatus).to.be.equal('I am new!');

                    // means delete all users in database.
                    User.deleteMany({})
                        .then(() => {
                            return mongoose.disconnect();
                        })
                        .then(() => {
                            done();
                        });
                }); 

        })
        .catch(err => console.log(err));
    });

});