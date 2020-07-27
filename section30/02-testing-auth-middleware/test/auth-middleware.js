
const expect = require('chai').expect;

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

    // it('Should yield a userId after decoding the token', function() {
    //     const req = {
    //         get: function() {
    //             return 'Bearer ry9r29389wr2983'; // as a token value
    //         }
    //     }

    //     authMiddleware(this, req, {}, () => {})

    //     expect(req).to.have.property('userId');
    // })

}) 
