
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {

  Product.find()
    .then( products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => { console.log(err); });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId)
    .then( product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => { console.log(err); });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then( products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });        
    })
    .catch(err => { console.log(err); });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then( 
      user => {
        console.log(user.cart.items);

        const products = user.cart.items;
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then( product => {
      return req.user.addToCart(product);
    })
    .then( result => {
      // console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then( result => {
      res.redirect('/cart');
    })
    .catch(err => { console.log(err); });
};

exports.postOrder = (req, res, next) => {

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then( user => {
      console.log(user.cart.items);

      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          /**
           * we need a whole product, not the productId. create a new js object and then use the spread operator and
           * use that not directly on productId but on a special field mongoose give us '_doc', with this we get really
           * access to just the data that in there and then with the spread operator inside of a new object we pull out
           * all the data in that document we retrieved and store it in a new object
           */
          product: { ...i.productId._doc }
        }
      });
    
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });

      return order.save();
    })
    .then( result => {
        return req.user.clearCart();
    })
    .then( () => {
      res.redirect('/orders');
    })
    .catch( err => { console.log(err); });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then( orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });    
    })
    .catch( err => { console.log(err); })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
