
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

// to group test function
describe('Auth Middleware', function() {
    it('Should throw as error in=f no authorization header is present', function() {
        const req = {
            get: function() {
                return null;
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    })
    
    it('Should throw an error if the authorization header is only one string', function() {
        const req = {
            get: function() {
                return 'xyz'; // as a token value
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(); // it should throw error 
    })

    it('Should throw an error if the token cannot be varified', function() {
        const req = {
            get: function() {
                return 'Bearer xyz'; // as a token value
            }
        }

        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    /**
     *  here we are using simple stub function to be able to pass the jwt.verify(token, 'somesupersecretsecret') in is_auth.
     * There is a downside this approach have, if it becomes evident if I put this test in front of the previous test case
     * So here we are actually globally override the jwt.verify method and in this case our test will pass but not the one previous
     * test. since we override the jwt.verify and we never restore it back to what was before.
     * instead of manually stubbing or mocking functonality and replacing them, it is good to use packages that also allow you to
     * restore the original setup. For that we will install the another package called: sinon, This package that allow us to create
     * a so-called stub which is a replacement for the origninal function where we can easily restore original functiom. 
     * to use it : sinon.stub(jwt, 'verify'); here it replaces jwt with an empty function that doesn't do anything special
     * though that is not entirely true, it actually will do things like registering function calls and so on, so that you can also
     * test for things like has this function be called. So
     *  jwt.verify.returns()
     * returns added by sinon. so everytime we call the jwt.verify we are calling the stub. So then we call jwt.verify.restore() and 
     * this will now restore the original function
     */
    it('Should yield a userId after decoding the token', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer ry9r29389wr2983'; // as a token value
            }
        };

        // jwt.verify = function() {
        //     return { userId: 'abc' }
        // }

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'});    // call the stub

        // so when we run this line the above code will over write the code in is_auth 
        // with our own function.
        authMiddleware(req, {}, () => {})

        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        // if you want to know the verify has been callat all
        expect(jwt.verify.called).to.be.true;
        
        jwt.verify.restore();                   // restore the originalfunction
    })

}) 
