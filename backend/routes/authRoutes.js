// ===========================================
// M-PESA Rent Wallet
// Version 10.1 Stable
// backend/routes/authRoutes.js
// ===========================================

const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

// ===========================================
// Authentication
// ===========================================

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// Get Logged-in User Profile
router.get("/profile/:id", authController.getProfile);

// ===========================================

module.exports = router;