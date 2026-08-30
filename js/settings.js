"use strict";

// =========================================================
// M-PESA RENT WALLET
// SETTINGS ENGINE
// VERSION 12.0
// =========================================================

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("SETTINGS ENGINE VERSION 12.0");
console.log("===========================================");


// =========================================================
// STORAGE KEYS
// =========================================================

const APPLICATION_MODE_KEY =
    "mpesaRentWalletApplicationMode";

const RECEIPT_PREFERENCES_KEY =
    "mpesaRentWalletReceiptPreferences";


// =========================================================
// DEFAULT APPLICATION MODE
// =========================================================

const DEFAULT_APPLICATION_MODE =
    "standard";


// =========================================================
// DEFAULT RECEIPT PREFERENCES
// =========================================================

const DEFAULT_RECEIPT_PREFERENCES = {

    showTransactionId: true,

    showDateTime: true,

    showProperty: true,

    autoOpen: true

};


// =========================================================
// GET APPLICATION MODE
// =========================================================

function getApplicationMode() {

    return (
        localStorage.getItem(
            APPLICATION_MODE_KEY
        ) || DEFAULT_APPLICATION_MODE
    );

}


// =========================================================
// SAVE APPLICATION MODE
// =========================================================

function saveApplicationMode(mode) {

    const validModes = [
        "standard",
        "landlord",
        "tenant"
    ];

    if (!validModes.includes(mode)) {

        mode =
            DEFAULT_APPLICATION_MODE;

    }

    localStorage.setItem(
        APPLICATION_MODE_KEY,
        mode
    );

    console.log(
        "Application mode saved:",
        mode
    );

}


// =========================================================
// GET RECEIPT PREFERENCES
// =========================================================

function getReceiptPreferences() {

    try {

        const stored =
            localStorage.getItem(
                RECEIPT_PREFERENCES_KEY
            );

        if (!stored) {

            return {
                ...DEFAULT_RECEIPT_PREFERENCES
            };

        }

        const parsed =
            JSON.parse(stored);

        return {

            ...DEFAULT_RECEIPT_PREFERENCES,

            ...parsed

        };

    }

    catch (error) {

        console.error(
            "Unable to load receipt preferences:",
            error
        );

        return {
            ...DEFAULT_RECEIPT_PREFERENCES
        };

    }

}


// =========================================================
// SAVE RECEIPT PREFERENCES
// =========================================================

function saveReceiptPreferences() {

    const preferences = {

        showTransactionId:
            document.getElementById(
                "receiptShowTransactionId"
            )?.checked ?? true,

        showDateTime:
            document.getElementById(
                "receiptShowDateTime"
            )?.checked ?? true,

        showProperty:
            document.getElementById(
                "receiptShowProperty"
            )?.checked ?? true,

        autoOpen:
            document.getElementById(
                "receiptAutoOpen"
            )?.checked ?? true

    };


    localStorage.setItem(

        RECEIPT_PREFERENCES_KEY,

        JSON.stringify(preferences)

    );


    console.log(
        "Receipt preferences saved:",
        preferences
    );

}


// =========================================================
// LOAD APPLICATION MODE INTO SETTINGS
// =========================================================

function loadApplicationModeSettings() {

    const mode =
        getApplicationMode();

    const inputs =
        document.querySelectorAll(
            'input[name="applicationMode"]'
        );

    inputs.forEach(input => {

        input.checked =
            input.value === mode;

    });

}


// =========================================================
// LOAD RECEIPT SETTINGS
// =========================================================

function loadReceiptSettings() {

    const preferences =
        getReceiptPreferences();


    const transactionId =
        document.getElementById(
            "receiptShowTransactionId"
        );

    const dateTime =
        document.getElementById(
            "receiptShowDateTime"
        );

    const property =
        document.getElementById(
            "receiptShowProperty"
        );

    const autoOpen =
        document.getElementById(
            "receiptAutoOpen"
        );


    if (transactionId) {

        transactionId.checked =
            preferences.showTransactionId;

    }


    if (dateTime) {

        dateTime.checked =
            preferences.showDateTime;

    }


    if (property) {

        property.checked =
            preferences.showProperty;

    }


    if (autoOpen) {

        autoOpen.checked =
            preferences.autoOpen;

    }

}


// =========================================================
// APPLICATION MODE CHANGE
// =========================================================

function initializeApplicationMode() {

    const inputs =
        document.querySelectorAll(
            'input[name="applicationMode"]'
        );


    inputs.forEach(input => {

        input.addEventListener(
            "change",
            () => {

                if (!input.checked) {

                    return;

                }


                saveApplicationMode(
                    input.value
                );


                // Notify all other modules

                window.dispatchEvent(
                    new CustomEvent(
                        "applicationModeChanged",
                        {
                            detail: {
                                mode:
                                    input.value
                            }
                        }
                    )
                );


                alert(
                    "Application Mode changed to " +
                    input.value
                );


                // Return to dashboard

                window.location.href =
                    "/dashboard";

            }
        );

    });

}


// =========================================================
// RECEIPT PREFERENCES CHANGE
// =========================================================

function initializeReceiptPreferences() {

    const inputs = [

        document.getElementById(
            "receiptShowTransactionId"
        ),

        document.getElementById(
            "receiptShowDateTime"
        ),

        document.getElementById(
            "receiptShowProperty"
        ),

        document.getElementById(
            "receiptAutoOpen"
        )

    ];


    inputs.forEach(input => {

        if (!input) {

            return;

        }


        input.addEventListener(
            "change",
            saveReceiptPreferences
        );

    });

}


// =========================================================
// INITIALIZE SETTINGS
// =========================================================

function initializeSettings() {

    loadApplicationModeSettings();

    loadReceiptSettings();

    initializeApplicationMode();

    initializeReceiptPreferences();

    console.log(
        "✅ Settings Engine Version 12.0 Loaded"
    );

}


// =========================================================
// GLOBAL API
// =========================================================

window.getApplicationMode =
    getApplicationMode;

window.saveApplicationMode =
    saveApplicationMode;

window.getReceiptPreferences =
    getReceiptPreferences;

window.saveReceiptPreferences =
    saveReceiptPreferences;


// =========================================================
// DOM READY
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeSettings
);