const express = require("express");

const router = express.Router();

const landlordController = require("../controllers/landlordController");

// ===========================================
// Landlord Routes (Version 9.5)
// ===========================================

// Register a landlord
router.post("/", landlordController.registerLandlord);

// Get landlord by authenticated user ID
router.get("/:userId", landlordController.getLandlord);

module.exports = router;