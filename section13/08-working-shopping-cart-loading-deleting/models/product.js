
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    /*
        A product should also have a userId.
        Now userId is of type, it will be a reference to a user, so this will actually be of type Schema.Types.ObjectId.
        We can add a special 'ref' configuration and ref takes a string where we tell mongoose which other mongoose model
        is actually related to the data in that field, we know that we will store a userId here but just beacuse the type is 
        ObjectId, this is not obvious, this could be any objectId of any Object. So we will add User here and you use the name of
        your model to which you want to relate this. So I refer to my User model here. and with that I get relation set up. This
        also means that in my User model where do I store the productId, I can add a reference  and refer to product beacuse I 
        know that for every user in the cart items, I will store products where I refer to some ID and that ID happens to
        refer to a product stored or defined through the product model.
        So now we got relation setup with ref, of course you only need this when using references, when using embedded
        documents as we do with the cart you don't need to do anything because well you use an embedded document,this already
        has kind of an implicit relation that is managed inside of one document 
    */
   userId: {
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   }
});

module.exports = mongoose.model('Product', productSchema);

