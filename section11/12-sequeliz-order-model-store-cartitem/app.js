const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// we will register a new middleware because We want to store that user
// in our request so that we can use it from anywhere in our app conveniently
// So here we will reach out to DB and retrieve our user with findByPk id 4
// So this code will only run for incoming requests which on the other hand can
// only reach this if we did successfully start our server.
// So what we want to do with our user in the request, we store it in request,
// we can simply add new field to our request object. This user from DB is not
// JS object it is Sequelize object 
app.use((req, res, next) => {
    User.findByPk(3)
        .then(
            user => {
                req.user = user;
                next();
            }
        )
        .catch( err => { console.log(err); });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Create a relation
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


// it will sync our models to the database by
// creating the appropriate tables and relations
// Note: force: true  only on developement
sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        // console.log(result);
        User.findByPk(3)
            .then( user => {
                if (!user) {
                    return User.create({
                                name: 'Mo',
                                email: 'mo@mail.com'
                            });
                } else {
                    return Promise.resolve(user);
                }
            })
            .then( user => {
                return user.createCart();
            })
            .then(cart => {
                console.log('Server started at port 3000 ...');
                app.listen(3000);
            })
            .catch( err => { console.log(err); } )
    })
    .catch(err => console.log(err));

