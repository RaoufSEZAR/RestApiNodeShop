const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } })
const Product = require('../models/product');


router.get('/', ProductsController.getAllProducts);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.createProducts)

router.get('/:productId', ProductsController.getProduct)

router.patch('/:productId', checkAuth, ProductsController.updateProducts)

router.delete('/:productId', checkAuth, ProductsController.deleteProduct)


module.exports = router;