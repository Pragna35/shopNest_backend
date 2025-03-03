const express = require('express')
const {addToCart , getCartItems, clearCart, removeItem, increaseQuantity, decreaseQuantity} = require('../controllers/cart')

const router = express.Router();

router.post('/add', addToCart)
router.get('/:userId', getCartItems)
router.delete('/clear/:userId', clearCart)
router.delete('/removeItem/:productId', removeItem)
router.post('/increment', increaseQuantity)
router.post('/decrement', decreaseQuantity)
module.exports = router