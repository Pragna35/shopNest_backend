const express = require("express");
const {register , login, sendOtp, verifyOTP, resetPassword}= require('../controllers/auth')

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)

module.exports = router;