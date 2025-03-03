const express = require("express");

const {getProducts , getCategory} = require('../controllers/products')



const router = express.Router();


router.get('/', getProducts)
router.get('/:category', getCategory)

module.exports = router;
