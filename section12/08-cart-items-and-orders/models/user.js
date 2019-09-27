
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


class User {

    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;       // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users')
                .insertOne(this)
                .then(user => {
                    console.log(user);
                    return user;
                })
                .catch(err => console.log(err));
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex( cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId: new mongodb.ObjectID(product._id), quantity: newQuantity});
        }
        
        const updateCart = { items: updatedCartItems };
        const db = getDb();
        return db.collection('users')
            .updateOne({ _id: new mongodb.ObjectID(this._id)}, { $set: { cart: updateCart }});
        
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({_id: new mongodb.ObjectID(userId)})
            .then( user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;