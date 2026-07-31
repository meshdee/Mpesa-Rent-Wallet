const express = require("express");

const router = express.Router();

const tenantController = require("../controllers/tenantController");

router.post("/", tenantController.createTenant);

router.get("/", tenantController.getTenants);

module.exports = router;