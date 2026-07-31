const express = require("express");

const router = express.Router();

const unitController = require("../controllers/unitController");

// ===========================================
// Unit Routes
// ===========================================

// Create Unit
router.post("/", unitController.createUnit);

// Get Available Units
router.get("/available/:propertyId", unitController.getAvailableUnits);

// Get All Units
router.get("/", unitController.getUnits);

// Delete Unit
router.delete("/:id", unitController.deleteUnit);

module.exports = router;