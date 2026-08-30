"use strict";

// =========================================================
// M-PESA RENT WALLET
// APPLICATION MODE ENGINE
// VERSION 12.0
// =========================================================

const APPLICATION_MODE_KEY =
    "mpesaRentWalletApplicationMode";


function getCurrentApplicationMode() {

    return (
        localStorage.getItem(
            APPLICATION_MODE_KEY
        ) || "standard"
    );

}


// =========================================================
// APPLY MODE
// =========================================================

function applyApplicationMode() {

    const mode =
        getCurrentApplicationMode();


    document.documentElement.setAttribute(
        "data-app-mode",
        mode
    );


    document.body.setAttribute(
        "data-app-mode",
        mode
    );


    console.log(
        "🏠 Application Mode:",
        mode
    );


    // =====================================================
    // MODE-SPECIFIC NAVIGATION
    // =====================================================

    const navigationLinks =
        document.querySelectorAll(
            "[data-mode]"
        );


    navigationLinks.forEach(link => {

        const allowedModes =
            link.dataset.mode
                .split(",")
                .map(value =>
                    value.trim()
                );


        if (
            allowedModes.includes(mode) ||
            allowedModes.includes("all")
        ) {

            link.style.display = "";

        }

        else {

            link.style.display = "none";

        }

    });


    // =====================================================
    // MODE-SPECIFIC CONTENT
    // =====================================================

    const sections =
        document.querySelectorAll(
            "[data-app-section]"
        );


    sections.forEach(section => {

        const sectionMode =
            section.dataset.appSection;


        if (
            sectionMode === "all" ||
            sectionMode === mode
        ) {

            section.style.display = "";

        }

        else {

            section.style.display = "none";

        }

    });

}


// =========================================================
// REACT TO MODE CHANGES
// =========================================================

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            APPLICATION_MODE_KEY
        ) {

            applyApplicationMode();

        }

    }
);


// =========================================================
// START
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    applyApplicationMode
);