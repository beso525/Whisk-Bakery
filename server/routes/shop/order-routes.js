const express = require('express')

const {createOrder, capturePayment, getAllOrdersByUsers, getAllOrdersByDetails} = require('../../controllers/shop/order-controller');
const { middleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post('/create', middleware, createOrder);
router.post('/capture', middleware, capturePayment)
router.get('/list', middleware, getAllOrdersByUsers)
router.get('/details/:id', middleware, getAllOrdersByDetails)

module.exports = router;