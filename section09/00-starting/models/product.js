
const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = (callback) => {

    fs.readFile(p, (err, fileContent) => {

        if (err) {
            return callback([]);
        }

        let products = JSON.parse(fileContent);
        
        callback(products);
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile( products => {
            if (this.id) {
                const exitingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[exitingProductIndex] = this; // this is the class that we find the index for it

                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });    
            } else {
                this.id = Math.random().toString();
                products.push(this);
    
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });    
            }
            
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
}