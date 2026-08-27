// ===========================================
// M-PESA Rent Wallet
// Authentication Module
// Version 10.3 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("AUTHENTICATION MODULE VERSION 10.3");
console.log("===========================================");

// ===========================================
// DOM Elements
// ===========================================

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginId =
    document.getElementById("loginId");

const loginPassword =
    document.getElementById("loginPassword");

const fullName =
    document.getElementById("fullName");

const phoneNumber =
    document.getElementById("phoneNumber");

const emailAddress =
    document.getElementById("emailAddress");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

// ===========================================
// LOGIN / REGISTER TAB SWITCHING
// ===========================================

const showLoginBtn =
    document.getElementById("showLoginBtn");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");


function showLoginForm() {

    if (!loginForm || !registerForm) {
        console.error(
            "Login/Register forms not found."
        );
        return;
    }

    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");

    if (showLoginBtn) {
        showLoginBtn.classList.add("active");
    }

    if (showRegisterBtn) {
        showRegisterBtn.classList.remove("active");
    }

}


function showRegisterForm() {

    if (!loginForm || !registerForm) {
        console.error(
            "Login/Register forms not found."
        );
        return;
    }

    loginForm.classList.add("hidden");

    registerForm.classList.remove("hidden");

    if (showLoginBtn) {
        showLoginBtn.classList.remove("active");
    }

    if (showRegisterBtn) {
        showRegisterBtn.classList.add("active");
    }

}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        showLoginForm
    );

}


if (showRegisterBtn) {

    showRegisterBtn.addEventListener(
        "click",
        showRegisterForm
    );

}

// ===========================================
// Register
// ===========================================

async function registerUser(e) {

    e.preventDefault();

    if (
        registerPassword.value !==
        confirmPassword.value
    ) {

        alert("Passwords do not match.");

        return;

    }

    try {

        const response =
            await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        fullName:
                            fullName.value.trim(),

                        phone:
                            phoneNumber.value.trim(),

                        email:
                            emailAddress.value.trim(),

                        password:
                            registerPassword.value

                    })
                }
            );


        const result =
            await response.json();


        alert(result.message);


        if (result.success) {

            registerForm.reset();

        }

    }

    catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        alert(
            "Registration failed."
        );

    }

}

// ===========================================
// Login
// ===========================================

async function loginUser(e) {

    e.preventDefault();

    try {

        console.log("-------------------------------------------");
        console.log("LOGIN REQUEST");
        console.log("-------------------------------------------");


        const response =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        login:
                            loginId.value.trim(),

                        password:
                            loginPassword.value

                    })
                }
            );


        const result =
            await response.json();


        console.log(
            "Login HTTP Status:",
            response.status
        );

        console.log(
            "Login Result:",
            result
        );


        // ===================================
        // Login Failed
        // ===================================

        if (
            !response.ok ||
            !result.success
        ) {

            alert(
                result.message ||
                "Login failed."
            );

            return;

        }


        // ===================================
        // Clear Previous Session Data
        // ===================================

        localStorage.removeItem(
            STORAGE.USER_ID
        );

        localStorage.removeItem(
            STORAGE.USER_EMAIL
        );

        localStorage.removeItem(
            STORAGE.USER_NAME
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


        // ===================================
        // Save Current User
        // ===================================

        localStorage.setItem(
            STORAGE.USER_ID,
            result.user.id
        );

        localStorage.setItem(
            STORAGE.USER_EMAIL,
            result.user.email || ""
        );

        localStorage.setItem(
            STORAGE.USER_NAME,
            result.user.fullName || ""
        );

        localStorage.setItem(
            STORAGE.SESSION,
            "ACTIVE"
        );


        // ===================================
        // Restore Landlord
        // ===================================

        if (result.landlord) {

            localStorage.setItem(
                STORAGE.LANDLORD_ID,
                result.landlord.id
            );

            console.log(
                "Landlord restored:",
                result.landlord.id
            );

        }


        // ===================================
        // Restore Tenant
        // ===================================

        if (result.tenant) {

            localStorage.setItem(
                STORAGE.TENANT_ID,
                result.tenant.id
            );

        }


        // ===================================
        // Login Successful
        // ===================================

        console.log(
            "✅ Login successful:",
            result.user.id
        );

        console.log(
            "Redirecting to /dashboard"
        );


        // IMPORTANT:
        // Use Express route, NOT dashboard.html

        window.location.replace(
            "/dashboard"
        );

    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        alert(
            "Login failed. Please try again."
        );

    }

}

// ===========================================
// Logout
// ===========================================

function logout() {

    console.log(
        "Logging out current user..."
    );


    // ===================================
    // Clear ALL Application Session Data
    // ===================================

    localStorage.removeItem(
        STORAGE.USER_ID
    );

    localStorage.removeItem(
        STORAGE.USER_EMAIL
    );

    localStorage.removeItem(
        STORAGE.USER_NAME
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
        "✅ Session cleared."
    );


    // ===================================
    // Return to Login
    // ===================================

    window.location.replace(
        "/"
    );

}

// ===========================================
// Login Event
// ===========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        loginUser
    );

}

// ===========================================
// Registration Event
// ===========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        registerUser
    );

}

// ===========================================
// Expose Logout Globally
// ===========================================

window.logout = logout;


// ===========================================
// Ready
// ===========================================

console.log(
    "✅ Authentication Module Version 10.3 Enterprise Loaded"
);