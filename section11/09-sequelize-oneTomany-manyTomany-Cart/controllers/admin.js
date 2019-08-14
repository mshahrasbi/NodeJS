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


//   Product.create(
//     {
//       title: title,
//       price: price,
//       imageUrl: imageUrl,
//       description: description,
//       userId: req.user.id
//     }
//   )
//   .then( result => {
//     // console.log(result);
//     console.log('Created Product!');
//     res.redirect('/admin/products');
//   })
//   .catch(err => {console.log(err);});
// };

// instead of using Product.create(...)
// we can use the sequelize createProduct method (dynamicly 
// generated method when we use the assosition), then we can 
// remove the userId: req.user.id
// so this method automatcally create a model for us.
  req.user.createProduct(
    {
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    }
  ).then(
    result => {
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

  // here we can use the dynamically generated method getProducts() as well like createProduct() method
  // Product.findByPk(prodId)
  //   .then(
  //     product => {
  //       if (!product) {
  //         return res.redirect('/');
  //       }
  //       res.render('admin/edit-product', {
  //         pageTitle: 'Edit Product',
  //         path: '/admin/edit-product',
  //         editing: editMode,
  //         product: product
  //       });
  //     }
  //   )
  //   .catch( err => { console.log(err); });

    req.user.getProducts({where: {id: prodId}})
      .then(
        products => {
          const product = products[0];
          if (!product) {
            return res.redirect('/');
          }
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
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
    .then( product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then( result => {
      //console.log(result);
      res.redirect('/admin/products');
    })
    .catch( err => { console.log(err); })
};

exports.getProducts = (req, res, next) => {
  
  Product.findAll()
  .then(
    products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    }
  )
  .catch(err => { console.log(err); });

  req.user.getProducts()
    .then(
      products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products'
        });
      }
    )
    .catch( err => {
      console.log(err);
    });

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => { console.log(err); })
};
