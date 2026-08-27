// ===========================================
// M-PESA Rent Wallet
// Dashboard Module
// Version 11.9 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("DASHBOARD MODULE VERSION 11.9");
console.log("===========================================");


// ===========================================
// Session Configuration
// ===========================================

const dashboardSession =
    localStorage.getItem(STORAGE.SESSION);

const dashboardUserId =
    localStorage.getItem(STORAGE.USER_ID);

const dashboardUserName =
    localStorage.getItem(STORAGE.USER_NAME);

const dashboardUserEmail =
    localStorage.getItem(STORAGE.USER_EMAIL);

const dashboardLandlordId =
    localStorage.getItem(STORAGE.LANDLORD_ID);


// ===========================================
// Authentication Guard
// ===========================================

function verifyDashboardSession() {

    console.log("-------------------------------------------");
    console.log("VERIFYING DASHBOARD SESSION");
    console.log("-------------------------------------------");

    console.log(
        "Session:",
        dashboardSession
    );

    console.log(
        "User ID:",
        dashboardUserId
    );

    console.log(
        "Landlord ID:",
        dashboardLandlordId
    );


    // =======================================
    // Invalid Session
    // =======================================

    if (
        dashboardSession !== "ACTIVE" ||
        !dashboardUserId
    ) {

        console.warn(
            "No active user session. Redirecting to login."
        );

        window.location.replace(
            "../index.html"
        );

        return false;

    }


    console.log(
        "✅ Dashboard session verified."
    );

    return true;

}


// ===========================================
// Verify Session
// ===========================================

if (!verifyDashboardSession()) {

    /*
        Stop dashboard initialization.

        The browser will redirect to login.
    */

    throw new Error(
        "Dashboard initialization stopped: no active session."
    );

}


// ===========================================
// DOM Elements
// ===========================================

const dashboardUserNameElement =
    document.getElementById(
        "dashboardUserName"
    );


const dashboardLogoutBtn =
    document.getElementById(
        "dashboardLogoutBtn"
    );


const dashboardVersionElement =
    document.getElementById(
        "appVersion"
    );


// ===========================================
// Display Current User
// ===========================================

function displayDashboardUser() {

    console.log("-------------------------------------------");
    console.log("DISPLAYING DASHBOARD USER");
    console.log("-------------------------------------------");


    if (!dashboardUserNameElement) {

        console.warn(
            "dashboardUserName element not found."
        );

        return;

    }


    const displayName =
        dashboardUserName ||
        dashboardUserEmail ||
        "Current User";


    dashboardUserNameElement.textContent =
        displayName;


    console.log(
        "Dashboard User:",
        displayName
    );

}


// ===========================================
// Display Application Version
// ===========================================

function displayDashboardVersion() {

    if (!dashboardVersionElement) {

        console.warn(
            "appVersion element not found."
        );

        return;

    }


    dashboardVersionElement.textContent =
        window.APP_VERSION ||
        "11.9 Enterprise";

}


// ===========================================
// Logout
// ===========================================

function dashboardLogout() {

    console.log("-------------------------------------------");
    console.log("DASHBOARD LOGOUT");
    console.log("-------------------------------------------");


    // =======================================
    // Prevent repeated logout execution
    // =======================================

    if (window.dashboardLoggingOut) {

        console.warn(
            "Logout already in progress."
        );

        return;

    }


    window.dashboardLoggingOut = true;


    console.log(
        "Logging out User:",
        dashboardUserId
    );


    // =======================================
    // Clear Authentication Session
    // =======================================

    localStorage.removeItem(
        STORAGE.USER_ID
    );

    localStorage.removeItem(
        STORAGE.USER_NAME
    );

    localStorage.removeItem(
        STORAGE.USER_EMAIL
    );

    localStorage.removeItem(
        STORAGE.LANDLORD_ID
    );

    localStorage.removeItem(
        STORAGE.TENANT_ID
    );

    localStorage.removeItem(
        STORAGE.WALLET_ID
    );

    localStorage.removeItem(
        STORAGE.PROPERTY_ID
    );

    localStorage.removeItem(
        STORAGE.WORKSPACE
    );

    localStorage.removeItem(
        STORAGE.SESSION
    );


    console.log(
        "✅ Local session cleared."
    );


    // =======================================
    // Return To Login
    // =======================================

    window.location.replace(
        "../index.html"
    );

}


// ===========================================
// Register Logout Button
// ===========================================

if (dashboardLogoutBtn) {

    dashboardLogoutBtn.addEventListener(
        "click",
        dashboardLogout
    );

    console.log(
        "✅ Dashboard logout button connected."
    );

}

else {

    console.warn(
        "Dashboard logout button not found."
    );

}


// ===========================================
// Dashboard Initialization
// ===========================================

let dashboardInitialized = false;


function initializeDashboard() {

    // =======================================
    // Prevent Duplicate Initialization
    // =======================================

    if (dashboardInitialized) {

        console.warn(
            "Dashboard already initialized."
        );

        return;

    }


    dashboardInitialized = true;


    console.log("-------------------------------------------");
    console.log("DASHBOARD PAGE INITIALIZED");
    console.log("-------------------------------------------");


    // =======================================
    // Display User
    // =======================================

    displayDashboardUser();


    // =======================================
    // Display Version
    // =======================================

    displayDashboardVersion();


    // =======================================
    // Dashboard Diagnostics
    // =======================================

    console.log("-------------------------------------------");
    console.log("DASHBOARD SESSION");
    console.log("-------------------------------------------");

    console.log(
        "Current User ID:",
        dashboardUserId
    );

    console.log(
        "Current User Name:",
        dashboardUserName
    );

    console.log(
        "Current Email:",
        dashboardUserEmail
    );

    console.log(
        "Current Landlord ID:",
        dashboardLandlordId
    );

    console.log(
        "Session Status:",
        dashboardSession
    );


    // =======================================
    // Property Module
    // =======================================

    /*
        IMPORTANT:

        property.js already loads the properties.

        Therefore dashboard.js MUST NOT call
        loadProperties() again.

        This prevents duplicate API requests
        and duplicate property rendering.
    */

    if (
        typeof loadProperties ===
        "function"
    ) {

        console.log(
            "✅ Property Module detected."
        );

        console.log(
            "Property loading is handled by property.js."
        );

    }

    else {

        console.warn(
            "Property Module not available."
        );

    }


    // =======================================
    // Dashboard Ready
    // =======================================

    console.log("-------------------------------------------");
    console.log("✅ DASHBOARD READY");
    console.log("-------------------------------------------");

}


// ===========================================
// DOM Ready
// ===========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDashboard,
        {
            once: true
        }
    );

}

else {

    initializeDashboard();

}

// ===========================================
// PROFILE MENU
// ===========================================

const profileTrigger =
    document.getElementById("profileTrigger");

const profileDropdown =
    document.getElementById("profileDropdown");


if (profileTrigger && profileDropdown) {

    profileTrigger.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            profileDropdown.classList.toggle(
                "show"
            );

        }
    );


    document.addEventListener(
        "click",
        function () {

            profileDropdown.classList.remove(
                "show"
            );

        }
    );

}


// ===========================================
// Module Loaded
// ===========================================

console.log(
    "✅ Dashboard Module Version 11.9 Enterprise Loaded"
);