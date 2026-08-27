// ===========================================
// M-PESA Rent Wallet
// Tenant Routes
// Version 11.7 Enterprise
// ===========================================

"use strict";

const express = require("express");

const router = express.Router();

const tenantController =
    require("../controllers/tenantController");


// ===========================================
// Create Tenant
// ===========================================

router.post(

    "/",

    tenantController.createTenant

);


// ===========================================
// Get Tenants For Current Landlord
// ===========================================

router.get(

    "/:landlordId",

    tenantController.getTenants

);


// ===========================================
// Delete Tenant
// ===========================================

router.delete(

    "/:id",

    tenantController.deleteTenant

);


// ===========================================
// Export
// ===========================================

module.exports = router;