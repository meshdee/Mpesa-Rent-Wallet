// ===========================================
// M-PESA Rent Wallet
// Landlord Module
// Version 12.0 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("LANDLORD MODULE VERSION 12.0");
console.log("===========================================");


// ===========================================
// STORAGE
// ===========================================

function getUserId() {

    return localStorage.getItem(
        STORAGE.USER_ID
    );

}


function getLandlordId() {

    return localStorage.getItem(
        STORAGE.LANDLORD_ID
    );

}


// ===========================================
// DOM ELEMENTS
// ===========================================

const businessName =
    document.getElementById("businessName");

const nationalId =
    document.getElementById("nationalId");

const landlordPhone =
    document.getElementById("landlordPhone");

const registerLandlordBtn =
    document.getElementById(
        "registerLandlordBtn"
    );


// ===========================================
// DISPLAY HELPERS
// ===========================================

function setFieldValue(element, value) {

    if (!element) {

        return;

    }

    element.value =
        value || "";

}


function setText(elementId, value) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {

        return;

    }

    element.textContent =
        value ??
        "Not provided";

}


function showMessage(message) {

    alert(message);

}


// ===========================================
// DISPLAY LANDLORD ACCOUNT SUMMARY
// ===========================================

function displayLandlordAccountSummary(
    landlord
) {

    console.log(
        "-------------------------------------------"
    );

    console.log(
        "DISPLAYING LANDLORD ACCOUNT SUMMARY"
    );

    console.log(
        "-------------------------------------------"
    );


    const userId =
        getUserId();


    const userName =
        localStorage.getItem(
            STORAGE.USER_NAME
        );


    const userEmail =
        localStorage.getItem(
            STORAGE.USER_EMAIL
        );


    const landlordId =
        landlord?.id ||
        getLandlordId();


    // =======================================
    // Sidebar User
    // =======================================

    setText(
        "landlordSidebarName",
        userName ||
        userEmail ||
        "Current User"
    );


    // =======================================
    // Account Summary
    // =======================================

    setText(
        "displayLandlordId",
        landlordId ||
        "Not registered"
    );


    setText(
        "displayUserId",
        userId ||
        "Not available"
    );


    setText(
        "displayLandlordEmail",
        landlord?.email ||
        userEmail ||
        "Not provided"
    );


    // =======================================
    // Workspace
    // =======================================

    setText(
        "landlordWorkspace",
        "Landlord"
    );


    // =======================================
    // Top Status
    // =======================================

    const landlordStatusBadge =
        document.getElementById(
            "landlordStatusBadge"
        );


    if (landlordStatusBadge) {

        landlordStatusBadge.textContent =
            landlordId
                ? "Active"
                : "Registration Required";

    }


    // =======================================
    // Form Status
    // =======================================

    const landlordFormStatus =
        document.getElementById(
            "landlordFormStatus"
        );


    if (landlordFormStatus) {

        landlordFormStatus.textContent =
            landlordId
                ? "Registered"
                : "Registration Required";

    }


    console.log(
        "User ID:",
        userId
    );

    console.log(
        "User Name:",
        userName
    );

    console.log(
        "User Email:",
        userEmail
    );

    console.log(
        "Landlord ID:",
        landlordId
    );

    console.log(
        "✅ Account summary displayed."
    );

}


// ===========================================
// LOAD LANDLORD
// ===========================================

async function loadLandlord() {

    console.log(
        "-------------------------------------------"
    );

    console.log(
        "LOADING LANDLORD"
    );

    console.log(
        "-------------------------------------------"
    );


    const userId =
        getUserId();


    if (!userId) {

        console.warn(
            "No logged-in User ID found."
        );


        showMessage(
            "Please login first."
        );


        window.location.href =
            "../index.html";


        return null;

    }


    console.log(
        "Current User ID:",
        userId
    );


    try {

        const response =
            await fetch(
                `/api/landlord/${userId}`
            );


        console.log(
            "Landlord HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Landlord API Result:",
            result
        );


        // ===================================
        // LANDLORD DOES NOT EXIST
        // ===================================

        if (
            response.status === 404
        ) {

            console.log(
                "No landlord record found."
            );


            displayLandlordAccountSummary(
                null
            );


            if (registerLandlordBtn) {

                registerLandlordBtn.textContent =
                    "Register Landlord";

                registerLandlordBtn.style.display =
                    "block";

            }


            const landlordFormStatus =
                document.getElementById(
                    "landlordFormStatus"
                );


            if (landlordFormStatus) {

                landlordFormStatus.textContent =
                    "Registration Required";

            }


            return null;

        }


        // ===================================
        // API ERROR
        // ===================================

        if (
            !response.ok ||
            !result.success
        ) {

            console.warn(
                "Unable to load landlord."
            );


            showMessage(
                result.message ||
                "Unable to load landlord."
            );


            return null;

        }


        const landlord =
            result.landlord;


        if (!landlord) {

            console.warn(
                "Landlord data missing from API response."
            );


            return null;

        }


        // ===================================
        // SAVE LANDLORD ID
        // ===================================

        if (landlord.id) {

            localStorage.setItem(

                STORAGE.LANDLORD_ID,

                landlord.id

            );

        }


        // ===================================
        // POPULATE FORM
        // ===================================

        setFieldValue(

            businessName,

            landlord.businessName

        );


        setFieldValue(

            nationalId,

            landlord.nationalId

        );


        setFieldValue(

            landlordPhone,

            landlord.phone

        );


        // ===================================
        // UPDATE BUTTON
        // ===================================

        if (registerLandlordBtn) {

            registerLandlordBtn.textContent =
                "Save Changes";

        }


        // ===================================
        // DISPLAY ACCOUNT SUMMARY
        // ===================================

        displayLandlordAccountSummary(
            landlord
        );


        console.log(
            "✅ Landlord loaded:",
            landlord.id
        );


        return landlord;

    }


    catch (error) {

        console.error(
            "Landlord Loading Error:",
            error
        );


        showMessage(
            "Unable to load landlord information."
        );


        return null;

    }

}


// ===========================================
// SAVE LANDLORD
// ===========================================

async function saveLandlord() {

    console.log(
        "-------------------------------------------"
    );

    console.log(
        "SAVING LANDLORD"
    );

    console.log(
        "-------------------------------------------"
    );


    const userId =
        getUserId();


    if (!userId) {

        showMessage(
            "Please login first."
        );


        window.location.href =
            "../index.html";


        return;

    }


    const payload = {

        businessName:
            businessName
                ? businessName.value.trim()
                : "",

        nationalId:
            nationalId
                ? nationalId.value.trim()
                : "",

        phone:
            landlordPhone
                ? landlordPhone.value.trim()
                : "",

        email:
            localStorage.getItem(
                STORAGE.USER_EMAIL
            ) || ""

    };


    console.log(
        "Landlord Update Payload:",
        payload
    );


    try {

        const response =
            await fetch(

                `/api/landlord/${userId}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }

            );


        console.log(
            "Update HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Update API Result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            showMessage(

                result.message ||
                "Unable to update landlord."

            );


            return;

        }


        // ===================================
        // SAVE LANDLORD ID
        // ===================================

        if (
            result.landlord &&
            result.landlord.id
        ) {

            localStorage.setItem(

                STORAGE.LANDLORD_ID,

                result.landlord.id

            );

        }


        showMessage(
            "Landlord information updated successfully."
        );


        await loadLandlord();

        await loadLandlordStatistics();


    }


    catch (error) {

        console.error(
            "Landlord Update Error:",
            error
        );


        showMessage(
            "Unable to update landlord information."
        );

    }

}


// ===========================================
// REGISTER NEW LANDLORD
// ===========================================

async function registerLandlord() {

    console.log(
        "-------------------------------------------"
    );

    console.log(
        "REGISTERING LANDLORD"
    );

    console.log(
        "-------------------------------------------"
    );


    const userId =
        getUserId();


    if (!userId) {

        showMessage(
            "Please login first."
        );


        window.location.href =
            "../index.html";


        return;

    }


    const payload = {

        userId,

        businessName:
            businessName
                ? businessName.value.trim()
                : "",

        nationalId:
            nationalId
                ? nationalId.value.trim()
                : "",

        phone:
            landlordPhone
                ? landlordPhone.value.trim()
                : "",

        email:
            localStorage.getItem(
                STORAGE.USER_EMAIL
            ) || ""

    };


    // ===================================
    // Basic Validation
    // ===================================

    if (!payload.businessName) {

        showMessage(
            "Please enter the business name."
        );

        return;

    }


    if (!payload.nationalId) {

        showMessage(
            "Please enter the National ID."
        );

        return;

    }


    if (!payload.phone) {

        showMessage(
            "Please enter the phone number."
        );

        return;

    }


    console.log(
        "Registration Payload:",
        payload
    );


    try {

        const response =
            await fetch(

                "/api/landlord",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }

            );


        const result =
            await response.json();


        console.log(
            "Registration API Result:",
            result
        );


        // ===================================
        // ALREADY REGISTERED
        // ===================================

        if (
            response.status === 409
        ) {

            if (result.landlordId) {

                localStorage.setItem(

                    STORAGE.LANDLORD_ID,

                    result.landlordId

                );

            }


            showMessage(
                "Landlord already registered. Your existing landlord profile has been loaded."
            );


            await loadLandlord();

            await loadLandlordStatistics();


            return;

        }


        // ===================================
        // REGISTRATION ERROR
        // ===================================

        if (
            !response.ok ||
            !result.success
        ) {

            showMessage(

                result.message ||
                "Could not register landlord."

            );


            return;

        }


        // ===================================
        // SAVE LANDLORD ID
        // ===================================

        if (result.landlordId) {

            localStorage.setItem(

                STORAGE.LANDLORD_ID,

                result.landlordId

            );

        }


        showMessage(
            "Landlord registered successfully."
        );


        await loadLandlord();

        await loadLandlordStatistics();


    }


    catch (error) {

        console.error(
            "Landlord Registration Error:",
            error
        );


        showMessage(
            "Unable to register landlord."
        );

    }

}


// ===========================================
// LANDLORD STATISTICS
// ===========================================

async function loadLandlordStatistics() {

    console.log(
        "-------------------------------------------"
    );

    console.log(
        "LOADING LANDLORD STATISTICS"
    );

    console.log(
        "-------------------------------------------"
    );


    const landlordId =
        getLandlordId();


    if (!landlordId) {

        console.warn(
            "No Landlord ID available."
        );


        return;

    }


    console.log(
        "Landlord ID:",
        landlordId
    );


    try {

        const response =
            await fetch(

                `/api/landlord/${landlordId}/statistics`

            );


        console.log(
            "Statistics HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Statistics API Result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            console.warn(
                "Unable to load landlord statistics."
            );


            return;

        }


        const statistics =
            result.statistics;


        if (!statistics) {

            console.warn(
                "Statistics object missing."
            );


            return;

        }


        // ===================================
        // STATISTICS ELEMENTS
        // ===================================

        const propertyCount =
            document.getElementById(
                "propertyCount"
            );


        const unitCount =
            document.getElementById(
                "unitCount"
            );


        const tenantCount =
            document.getElementById(
                "tenantCount"
            );


        const occupiedUnits =
            document.getElementById(
                "occupiedUnits"
            );


        const vacantUnits =
            document.getElementById(
                "vacantUnits"
            );


        const monthlyRent =
            document.getElementById(
                "monthlyRent"
            );


        const landlordProperties =
            document.getElementById(
                "landlordProperties"
            );


        const landlordUnits =
            document.getElementById(
                "landlordUnits"
            );


        const landlordTenants =
            document.getElementById(
                "landlordTenants"
            );


        // ===================================
        // PROPERTY COUNT
        // ===================================

        if (propertyCount) {

            propertyCount.textContent =
                Number(
                    statistics.properties || 0
                );

        }


        if (landlordProperties) {

            landlordProperties.textContent =
                Number(
                    statistics.properties || 0
                );

        }


        // ===================================
        // UNIT COUNT
        // ===================================

        if (unitCount) {

            unitCount.textContent =
                Number(
                    statistics.units || 0
                );

        }


        if (landlordUnits) {

            landlordUnits.textContent =
                Number(
                    statistics.units || 0
                );

        }


        // ===================================
        // TENANT COUNT
        // ===================================

        if (tenantCount) {

            tenantCount.textContent =
                Number(
                    statistics.tenants || 0
                );

        }


        if (landlordTenants) {

            landlordTenants.textContent =
                Number(
                    statistics.tenants || 0
                );

        }


        // ===================================
        // OCCUPIED UNITS
        // ===================================

        if (occupiedUnits) {

            occupiedUnits.textContent =
                Number(
                    statistics.occupiedUnits || 0
                );

        }


        // ===================================
        // VACANT UNITS
        // ===================================

        if (vacantUnits) {

            vacantUnits.textContent =
                Number(
                    statistics.vacantUnits || 0
                );

        }


        // ===================================
        // MONTHLY RENT
        // ===================================

        if (monthlyRent) {

            monthlyRent.textContent =
                "KES " +
                Number(
                    statistics.monthlyRent || 0
                ).toLocaleString();

        }


        console.log(
            "Properties:",
            statistics.properties
        );


        console.log(
            "Units:",
            statistics.units
        );


        console.log(
            "Tenants:",
            statistics.tenants
        );


        console.log(
            "Occupied:",
            statistics.occupiedUnits
        );


        console.log(
            "Vacant:",
            statistics.vacantUnits
        );


        console.log(
            "Monthly Rent:",
            statistics.monthlyRent
        );


        console.log(
            "✅ Landlord statistics loaded."
        );

    }


    catch (error) {

        console.error(
            "Landlord Statistics Error:",
            error
        );

    }

}


// ===========================================
// BUTTON HANDLER
// ===========================================

if (registerLandlordBtn) {

    registerLandlordBtn.addEventListener(

        "click",

        async () => {

            const landlordId =
                getLandlordId();


            // =================================
            // EXISTING LANDLORD
            // =================================

            if (landlordId) {

                await saveLandlord();

                return;

            }


            // =================================
            // NEW LANDLORD
            // =================================

            await registerLandlord();

        }

    );

}


// ===========================================
// INITIALIZE LANDLORD PAGE
// ===========================================

let landlordPageInitialized =
    false;


async function initializeLandlordPage() {

    // =======================================
    // PREVENT DUPLICATE INITIALIZATION
    // =======================================

    if (landlordPageInitialized) {

        console.warn(
            "Landlord page already initialized."
        );

        return;

    }


    landlordPageInitialized =
        true;


    console.log(
        "-------------------------------------------"
    );

    console.log(
        "LANDLORD PAGE INITIALIZED"
    );

    console.log(
        "-------------------------------------------"
    );


    const userId =
        getUserId();


    if (!userId) {

        console.warn(
            "No logged-in user."
        );


        window.location.href =
            "../index.html";


        return;

    }


    console.log(
        "Current User ID:",
        userId
    );


    // =======================================
    // LOAD LANDLORD
    // =======================================

    await loadLandlord();


    // =======================================
    // LOAD STATISTICS
    // =======================================

    await loadLandlordStatistics();


    console.log(
        "-------------------------------------------"
    );

    console.log(
        "✅ LANDLORD PAGE READY"
    );

    console.log(
        "-------------------------------------------"
    );

}


// ===========================================
// START
// ===========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        initializeLandlordPage,

        {
            once: true
        }

    );

}

else {

    initializeLandlordPage();

}


// ===========================================
// MODULE LOADED
// ===========================================

console.log(
    "✅ Landlord Module Version 12.0 Enterprise Loaded"
);