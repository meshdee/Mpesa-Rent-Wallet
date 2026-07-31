const express = require("express");

const router = express.Router();

const propertyController = require("../controllers/propertyController");

router.post("/", propertyController.createProperty);

router.get("/", propertyController.getProperties);

module.exports = router;