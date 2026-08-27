// ===========================================
// M-PESA Rent Wallet
// Enterprise Edition
// Version 11.2
//
// Module: Storage Configuration
//
// Responsibility:
// - Local Storage Keys
// - Session Constants
// - Global Application Configuration
// ===========================================

"use strict";

// ===========================================
// Local Storage Keys
// ===========================================

const STORAGE = Object.freeze({

    // Authentication

    SESSION: "mpesa_session",

    USER_ID: "mpesa_user_id",

    USER_NAME: "mpesa_user_name",

    USER_EMAIL: "mpesa_user_email",

    // Landlord

    LANDLORD_ID: "mpesa_landlord_id",

    // Tenant

    TENANT_ID: "mpesa_tenant_id",

    // Wallet

    WALLET_ID: "mpesa_wallet_id",

    // Property

    PROPERTY_ID: "mpesa_property_id",

    // Workspace

    WORKSPACE: "mpesa_workspace"

});

// ===========================================
// Global Storage Configuration
// ===========================================

window.STORAGE = STORAGE;

// ===========================================
// Application Configuration
// ===========================================

const APP_NAME = "M-PESA Rent Wallet";

const APP_VERSION = "11.5 Enterprise";

// ===========================================
// Global Application Configuration
// ===========================================

window.APP_NAME = APP_NAME;

window.APP_VERSION = APP_VERSION;

// ===========================================
// Startup Log
// ===========================================

console.log("✅ Storage Configuration Version 11.2 Loaded");