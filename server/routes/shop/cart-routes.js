const express = require('express')

const {addToCart, getCart, deleteCartItem, updateCartQty} = require('../../controllers/shop/cart-controller');
const { middleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post('/add', middleware, addToCart);
router.get('/get', middleware, getCart);
router.put('/update-cart', middleware, updateCartQty);
router.delete('/:productId', middleware, deleteCartItem);

module.exports = router;