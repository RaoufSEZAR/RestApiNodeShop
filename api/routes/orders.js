const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.get_all_orders)

router.post('/', checkAuth, OrderController.createOrders)

router.get('/:orderId', checkAuth, OrderController.getOrder)


router.delete('/:orderId', checkAuth, OrderController.deleteOrder)

module.exports = router;