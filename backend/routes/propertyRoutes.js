const express = require("express");

const router = express.Router();

const propertyController =
    require("../controllers/propertyController");

// ===========================================
// CREATE PROPERTY
// ===========================================

router.post(
    "/",
    propertyController.createProperty
);


// ===========================================
// GET PROPERTIES BY LANDLORD
// ===========================================

router.get(
    "/:landlordId",
    propertyController.getProperties
);


// ===========================================
// DELETE PROPERTY
// ===========================================

router.delete(
    "/:id",
    propertyController.deleteProperty
);


module.exports = router;