// ===========================================
// M-PESA Rent Wallet
// Landlord Routes
// Version 11.9 Enterprise
// ===========================================

"use strict";

const express = require("express");

const router = express.Router();

const landlordController =
    require("../controllers/landlordController");


// ===========================================
// LANDLORD ROUTES
// ===========================================


// -------------------------------------------
// Register Landlord
// POST /api/landlord
// -------------------------------------------

router.post(
    "/",
    landlordController.registerLandlord
);


// -------------------------------------------
// Get Landlord by User ID
// GET /api/landlord/:userId
// -------------------------------------------

router.get(
    "/:userId",
    landlordController.getLandlord
);


// -------------------------------------------
// Update Landlord by User ID
// PUT /api/landlord/:userId
// -------------------------------------------

router.put(
    "/:userId",
    landlordController.updateLandlord
);


// -------------------------------------------
// Get Landlord Statistics
// GET /api/landlord/:landlordId/statistics
// -------------------------------------------

router.get(
    "/:landlordId/statistics",
    landlordController.getLandlordStatistics
);


// ===========================================
// EXPORT
// ===========================================

module.exports = router;


console.log(
    "✅ Landlord Routes Version 11.9 Enterprise Loaded"
);