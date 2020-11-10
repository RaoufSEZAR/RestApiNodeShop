const mongoose = require('mongoose');

const Product = require('../models/product');


exports.getAllProducts = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id,
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.createProducts = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created successfuly products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id,
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log('From DB', doc);
            if (doc) {
                res.status(200).json({
                    products: doc,
                    request: {
                        type: "GET",
                        description: "GET_ALL_PRODUCTS",
                        url: "http://localhost:3000/products"
                    }
                })
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.updateProducts = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id,
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}


exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {

            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products/",
                    body: { name: "String", price: 'Number' }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

}