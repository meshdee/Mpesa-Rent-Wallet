// ===========================================
// M-PESA Rent Wallet
// Unit Routes
// Version 11.4 Enterprise
// ===========================================

"use strict";

const express = require("express");

const router = express.Router();

const unitController = require("../controllers/unitController");

// ===========================================
// Create Unit
// ===========================================

router.post(

    "/",

    unitController.createUnit

);

// ===========================================
// Get Available Units
// ===========================================

router.get(

    "/available/:propertyId",

    unitController.getAvailableUnits

);

// ===========================================
// Get Units For Current Landlord
// ===========================================

router.get(

    "/:landlordId",

    unitController.getUnits

);

// ===========================================
// Delete Unit
// ===========================================

router.delete(

    "/:id",

    unitController.deleteUnit

);

// ===========================================
// Export
// ===========================================

module.exports = router;