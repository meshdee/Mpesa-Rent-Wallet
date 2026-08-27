// ===========================================
// M-PESA Rent Wallet
// Profile Module
// Version 11.6 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("PROFILE MODULE VERSION 11.6");
console.log("===========================================");


// ===========================================
// STORAGE
// ===========================================

const profileUserId =
    localStorage.getItem(STORAGE.USER_ID);

const profileUserEmail =
    localStorage.getItem(STORAGE.USER_EMAIL);

const profileUserName =
    localStorage.getItem(STORAGE.USER_NAME);

const profileLandlordId =
    localStorage.getItem(STORAGE.LANDLORD_ID);

const profileWorkspace =
    localStorage.getItem(STORAGE.WORKSPACE);


// ===========================================
// HTML ELEMENTS
// ===========================================

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");

const profileNationalId =
    document.getElementById("profileNationalId");

const profileUserIdElement =
    document.getElementById("profileUserId");

const profileStatus =
    document.getElementById("profileStatus");

const profileBusinessName =
    document.getElementById("profileBusinessName");

const profileLandlordIdElement =
    document.getElementById("profileLandlordId");

const profileProperties =
    document.getElementById("profileProperties");

const profileUnits =
    document.getElementById("profileUnits");

const profileTenants =
    document.getElementById("profileTenants");

const profileWorkspaceElement =
    document.getElementById("profileWorkspace");

const profileSidebarName =
    document.getElementById("profileSidebarName");

const profileVersion =
    document.getElementById("profileVersion");


// ===========================================
// OPTIONAL WALLET ELEMENTS
// ===========================================

const profileRentGoal =
    document.getElementById("profileRentGoal");

const profileSavedAmount =
    document.getElementById("profileSavedAmount");

const profileDueDate =
    document.getElementById("profileDueDate");

const profileWalletStatus =
    document.getElementById("profileWalletStatus");


// ===========================================
// DISPLAY BASIC PROFILE
// ===========================================

function displayBasicProfile() {

    console.log("-------------------------------------------");
    console.log("DISPLAYING PROFILE INFORMATION");
    console.log("-------------------------------------------");

    console.log("User ID:", profileUserId);
    console.log("User Name:", profileUserName);
    console.log("User Email:", profileUserEmail);
    console.log("Landlord ID:", profileLandlordId);
    console.log("Workspace:", profileWorkspace);


    // ===================================
    // Name
    // ===================================

    if (profileName) {

        profileName.textContent =
            profileUserName ||
            "Name not available";

    }


    // ===================================
    // Sidebar Name
    // ===================================

    if (profileSidebarName) {

        profileSidebarName.textContent =
            profileUserName ||
            "Current User";

    }


    // ===================================
    // Email
    // ===================================

    if (profileEmail) {

        profileEmail.textContent =
            profileUserEmail ||
            "Email not available";

    }


    // ===================================
    // User ID
    // ===================================

    if (profileUserIdElement) {

        profileUserIdElement.textContent =
            profileUserId ||
            "Not available";

    }


    // ===================================
    // Landlord ID
    // ===================================

    if (profileLandlordIdElement) {

        profileLandlordIdElement.textContent =
            profileLandlordId ||
            "Not registered";

    }


    // ===================================
    // Workspace
    // ===================================

    if (profileWorkspaceElement) {

        profileWorkspaceElement.textContent =
            profileWorkspace ||
            "Landlord";

    }


    // ===================================
    // Account Status
    // ===================================

    if (profileStatus) {

        profileStatus.textContent =
            "Active";

    }


    // ===================================
    // Application Version
    // ===================================

    if (profileVersion) {

        profileVersion.textContent =
            window.APP_VERSION ||
            "11.2 Enterprise";

    }

}


// ===========================================
// LOAD USER PROFILE
// ===========================================

async function loadProfile() {

    console.log("-------------------------------------------");
    console.log("LOADING PROFILE");
    console.log("-------------------------------------------");


    if (!profileUserId) {

        console.warn(
            "No logged-in User ID found."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/users/${profileUserId}`
            );


        console.log(
            "Profile HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log("-------------------------------------------");
        console.log("PROFILE API RESULT");
        console.log("-------------------------------------------");

        console.log(
            "API Result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            console.warn(
                "Profile API did not return success."
            );

            return;

        }


        const user =
            result.user || {};


        console.log(
            "Profile User:",
            user
        );


        // ===================================
        // Full Name
        // ===================================

        const fullName =
            user.fullName ||
            user.name ||
            user.userName ||
            profileUserName ||
            "Name not available";


        if (profileName) {

            profileName.textContent =
                fullName;

        }


        if (profileSidebarName) {

            profileSidebarName.textContent =
                fullName;

        }


        // ===================================
        // Email
        // ===================================

        if (profileEmail) {

            profileEmail.textContent =
                user.email ||
                profileUserEmail ||
                "Email not available";

        }


        // ===================================
        // Phone
        // ===================================

        if (profilePhone) {

            profilePhone.textContent =
                user.phone ||
                user.phoneNumber ||
                "Not provided";

        }


        // ===================================
        // National ID
        // ===================================

        if (profileNationalId) {

            profileNationalId.textContent =
                user.nationalId ||
                user.nationalID ||
                "Not provided";

        }


        // ===================================
        // Business Name
        // ===================================

        if (profileBusinessName) {

            profileBusinessName.textContent =
                user.businessName ||
                "Not registered";

        }


        console.log(
            "✅ Personal profile loaded."
        );

    }

    catch (error) {

        console.error(
            "Profile Loading Error:",
            error
        );

    }

}


// ===========================================
// LOAD PROFILE STATISTICS
// ===========================================

async function loadProfileStatistics() {

    console.log("-------------------------------------------");
    console.log("LOADING PROFILE STATISTICS");
    console.log("-------------------------------------------");


    if (!profileLandlordId) {

        console.warn(
            "No Landlord ID available."
        );

        setProfileStatistic(
            profileProperties,
            0
        );

        setProfileStatistic(
            profileUnits,
            0
        );

        setProfileStatistic(
            profileTenants,
            0
        );

        return;

    }


    // =========================================
    // Properties
    // =========================================

    try {

        const response =
            await fetch(
                `/api/properties/${profileLandlordId}`
            );


        const result =
            await response.json();


        console.log(
            "Properties API Result:",
            result
        );


        const properties =
            Array.isArray(result)
                ? result
                : (
                    Array.isArray(
                        result.properties
                    )
                        ? result.properties
                        : []
                );


        setProfileStatistic(
            profileProperties,
            properties.length
        );

    }

    catch (error) {

        console.error(
            "Properties Statistics Error:",
            error
        );

        setProfileStatistic(
            profileProperties,
            0
        );

    }


    // =========================================
    // Units
    // =========================================

    try {

        const response =
            await fetch(
                `/api/units/${profileLandlordId}`
            );


        const result =
            await response.json();


        console.log(
            "Units API Result:",
            result
        );


        const units =
            Array.isArray(result)
                ? result
                : (
                    Array.isArray(
                        result.units
                    )
                        ? result.units
                        : []
                );


        setProfileStatistic(
            profileUnits,
            units.length
        );


        console.log(
            "Units Found:",
            units.length
        );

    }

    catch (error) {

        console.error(
            "Units Statistics Error:",
            error
        );

        setProfileStatistic(
            profileUnits,
            0
        );

    }


    // =========================================
    // Tenants
    // =========================================

    try {

        const response =
            await fetch(
                `/api/tenants/${profileLandlordId}`
            );


        const result =
            await response.json();


        console.log(
            "Tenants API Result:",
            result
        );


        const tenants =
            Array.isArray(result)
                ? result
                : (
                    Array.isArray(
                        result.tenants
                    )
                        ? result.tenants
                        : []
                );


        setProfileStatistic(
            profileTenants,
            tenants.length
        );


        console.log(
            "Tenants Found:",
            tenants.length
        );

    }

    catch (error) {

        console.error(
            "Tenants Statistics Error:",
            error
        );

        setProfileStatistic(
            profileTenants,
            0
        );

    }


    console.log(
        "✅ Profile statistics loaded."
    );

}


// ===========================================
// STATISTIC HELPER
// ===========================================

function setProfileStatistic(
    element,
    value
) {

    if (!element) {

        return;

    }


    element.textContent =
        Number(value) || 0;

}


// ===========================================
// LOAD WALLET
// ===========================================

async function loadProfileWallet() {

    console.log("-------------------------------------------");
    console.log("LOADING PROFILE WALLET");
    console.log("-------------------------------------------");


    if (!profileUserId) {

        console.warn(
            "No User ID available for wallet."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/wallet/${profileUserId}`
            );


        console.log(
            "Wallet HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Wallet API Result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            console.warn(
                "Wallet API did not return success."
            );

            if (profileWalletStatus) {

                profileWalletStatus.textContent =
                    "Unavailable";

            }

            return;

        }


        const wallet =
            result.wallet || {};


        // ===================================
        // Save Wallet ID
        // ===================================

        if (wallet.id) {

            localStorage.setItem(
                STORAGE.WALLET_ID,
                wallet.id
            );

        }


        // ===================================
        // Rent Goal
        // ===================================

        if (profileRentGoal) {

            profileRentGoal.textContent =
                formatKES(
                    wallet.rentGoal
                );

        }


        // ===================================
        // Saved Amount
        // ===================================

        if (profileSavedAmount) {

            profileSavedAmount.textContent =
                formatKES(
                    wallet.savedAmount
                );

        }


        // ===================================
        // Due Date
        // ===================================

        if (profileDueDate) {

            profileDueDate.textContent =
                wallet.dueDate
                    ? formatDate(
                        wallet.dueDate
                    )
                    : "Not set";

        }


        // ===================================
        // Wallet Status
        // ===================================

        if (profileWalletStatus) {

            profileWalletStatus.textContent =
                "Active";

        }


        console.log(
            "✅ Profile wallet loaded."
        );

    }

    catch (error) {

        console.error(
            "Profile Wallet Error:",
            error
        );

        if (profileWalletStatus) {

            profileWalletStatus.textContent =
                "Unavailable";

        }

    }

}


// ===========================================
// FORMAT KES
// ===========================================

function formatKES(amount) {

    const value =
        Number(amount) || 0;


    return `KES ${value.toLocaleString()}`;

}


// ===========================================
// FORMAT DATE
// ===========================================

function formatDate(dateValue) {

    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Not set";

    }


    return date.toLocaleDateString(
        "en-KE",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


// ===========================================
// LOGOUT
// ===========================================

function logoutProfile() {

    console.log(
        "Logging out current user..."
    );


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


    window.location.replace(
        "/"
    );

}


// ===========================================
// LOGOUT BUTTONS
// ===========================================

const profileLogoutBtn =
    document.getElementById(
        "profileLogoutBtn"
    );


if (profileLogoutBtn) {

    profileLogoutBtn.addEventListener(
        "click",
        logoutProfile
    );

}


const profileLogoutMainBtn =
    document.getElementById(
        "profileLogoutMainBtn"
    );


if (profileLogoutMainBtn) {

    profileLogoutMainBtn.addEventListener(
        "click",
        logoutProfile
    );

}


// ===========================================
// INITIALIZE PROFILE
// ===========================================

async function initializeProfile() {

    console.log("-------------------------------------------");
    console.log(
        "PROFILE PAGE INITIALIZED"
    );
    console.log("-------------------------------------------");


    // ===================================
    // Display cached information first
    // ===================================

    displayBasicProfile();


    // ===================================
    // Load server profile
    // ===================================

    await loadProfile();


    // ===================================
    // Load landlord statistics
    // ===================================

    await loadProfileStatistics();


    // ===================================
    // Load wallet
    // ===================================

    await loadProfileWallet();


    console.log(
        "✅ Profile Module Ready"
    );

}


// ===========================================
// DOM READY
// ===========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeProfile,
        {
            once: true
        }
    );

}

else {

    initializeProfile();

}

// ===========================================
// PROFILE SETTINGS
// ===========================================

const PROFILE_THEME_KEY =
    "mpesaRentWalletTheme";

const PROFILE_MODE_KEY =
    "mpesaRentWalletMode";


// ===========================================
// APPLY THEME
// ===========================================

function applyProfileTheme(theme) {

    const root =
        document.documentElement;


    if (theme === "dark") {

        root.setAttribute(
            "data-theme",
            "dark"
        );

        return;

    }


    if (theme === "light") {

        root.setAttribute(
            "data-theme",
            "light"
        );

        return;

    }


    root.removeAttribute(
        "data-theme"
    );

}


// ===========================================
// LOAD THEME
// ===========================================

function loadProfileTheme() {

    const savedTheme =
        localStorage.getItem(
            PROFILE_THEME_KEY
        ) || "system";


    applyProfileTheme(
        savedTheme
    );


    const selectedTheme =
        document.querySelector(
            `input[name="theme"][value="${savedTheme}"]`
        );


    if (selectedTheme) {

        selectedTheme.checked =
            true;

    }

}


// ===========================================
// THEME CHANGE
// ===========================================

function initializeProfileTheme() {

    const themeInputs =
        document.querySelectorAll(
            'input[name="theme"]'
        );


    themeInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                () => {

                    if (!input.checked) {
                        return;
                    }


                    localStorage.setItem(
                        PROFILE_THEME_KEY,
                        input.value
                    );


                    applyProfileTheme(
                        input.value
                    );

                }
            );

        }
    );

}


// ===========================================
// LOAD APPLICATION MODE
// ===========================================

function loadProfileMode() {

    const savedMode =
        localStorage.getItem(
            PROFILE_MODE_KEY
        ) || "standard";


    const selectedMode =
        document.querySelector(
            `input[name="appMode"][value="${savedMode}"]`
        );


    if (selectedMode) {

        selectedMode.checked =
            true;

    }

}


// ===========================================
// APPLICATION MODE CHANGE
// ===========================================

function initializeProfileMode() {

    const modeInputs =
        document.querySelectorAll(
            'input[name="appMode"]'
        );


    modeInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                () => {

                    if (!input.checked) {
                        return;
                    }


                    localStorage.setItem(
                        PROFILE_MODE_KEY,
                        input.value
                    );

                }
            );

        }
    );

}


// ===========================================
// INITIALIZE PROFILE SETTINGS
// ===========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProfileTheme();

        initializeProfileTheme();

        loadProfileMode();

        initializeProfileMode();


        console.log(
            "⚙️ Profile Settings initialized."
        );

    }
);

// =========================================================
// SIDEBAR USER ACCOUNT MENU
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const trigger =
            document.getElementById(
                "sidebarUserTrigger"
            );

        const menu =
            document.getElementById(
                "sidebarUserMenu"
            );

        const footer =
            document.querySelector(
                ".sidebar-footer"
            );


        if (!trigger || !menu) {

            console.warn(
                "Sidebar user menu elements not found."
            );

            return;

        }


        trigger.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                menu.classList.toggle(
                    "show"
                );

                if (footer) {

                    footer.classList.toggle(
                        "user-menu-open"
                    );

                }

            }
        );


        document.addEventListener(
            "click",
            () => {

                menu.classList.remove(
                    "show"
                );

                if (footer) {

                    footer.classList.remove(
                        "user-menu-open"
                    );

                }

            }
        );


        menu.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );

    }
);

console.log(
    "✅ Profile Module Version 11.6 Enterprise Loaded"
);