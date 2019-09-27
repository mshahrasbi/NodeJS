const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user._id});
  product.save()
    .then(result => {
        console.log('Created Product!');
        res.redirect('/admin/products');
      }
    ).catch( 
      err => { console.log(err); }
    );
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(
      product => {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      }
    )
    .catch( err => { console.log(err); });
};

exports.postEditProduct = (req, res, next) => {
  // console.log( req.body);
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
 
  Product.findById(prodId).then( product => {
    product.title = title;
    product.price = price;
    product.imageUrl = imageUrl;
    product.description = description;

    return product
      .save();
  })
  .then( result => {
        console.log('Created Product!');
        res.redirect('/admin/products');
    })
    .catch( err => { console.log(err); })
};

exports.getProducts = (req, res, next) => {
  
  Product.find()
  .select('title price -_id') /** select title and price but not _id */
  /* populate allows you to tell mongoose to populate a certain field with all the detail information and not just Id.
     so here we describe the path which we want to populate, in our case just userId field but we could also point at
     nested paths if you had these, we can also add the 2nd args to select a spefic fields like 'name'  */
  .populate('userId', 'name')
  .then(
    products => {
      console.log(products);
      
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    }
  )
  .catch(err => { console.log(err); });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => { console.log(err); })
};
