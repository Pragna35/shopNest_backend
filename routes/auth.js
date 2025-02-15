const express = require("express");
const {register , login, sendOtp, verifyOTP, resetPassword, logout} = require('../controllers/auth')

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)
router.post("/logout", logout)

module.exports = router;