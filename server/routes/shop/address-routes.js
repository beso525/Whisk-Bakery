const express = require('express');

const {addAddress, getAddress, deleteAddress, editAddress} = require('../../controllers/shop/address-controller');
const { middleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post('/add', middleware, addAddress);
router.get('/get', middleware, getAddress)
router.delete('/delete/:addressId', middleware, deleteAddress)
router.put('/update/:addressId', middleware, editAddress)

module.exports = router;