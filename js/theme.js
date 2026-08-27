"use strict";

// =========================================================
// M-PESA RENT WALLET
// GLOBAL THEME ENGINE
// =========================================================

const THEME_KEY = "mpesaRentWalletTheme";


// =========================================================
// GET USER THEME PREFERENCE
// =========================================================

function getSavedTheme() {

    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (
        savedTheme === "dark" ||
        savedTheme === "light" ||
        savedTheme === "system"
    ) {

        return savedTheme;

    }

    return "system";

}


// =========================================================
// GET OPERATING SYSTEM THEME
// =========================================================

function getSystemTheme() {

    const prefersDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    return prefersDark
        ? "dark"
        : "light";

}


// =========================================================
// RESOLVE THEME
// =========================================================

function resolveTheme(theme) {

    if (theme === "dark") {

        return "dark";

    }

    if (theme === "light") {

        return "light";

    }

    // System Default

    return getSystemTheme();

}


// =========================================================
// APPLY THEME
// =========================================================
function applyGlobalTheme() {

    const preference =
        getSavedTheme();

    const resolvedTheme =
        preference === "system"
            ? getSystemTheme()
            : preference;


    // Remove any stale theme attributes

    document.documentElement.removeAttribute(
        "data-theme"
    );

    document.documentElement.removeAttribute(
        "data-theme-preference"
    );


    // Apply the resolved theme

    document.documentElement.setAttribute(
        "data-theme",
        resolvedTheme
    );


    // Remember the user's preference

    document.documentElement.setAttribute(
        "data-theme-preference",
        preference
    );


    console.log(
        "🎨 Theme applied:",
        {
            preference,
            resolvedTheme,
            dataTheme:
                document.documentElement
                    .getAttribute("data-theme")
        }
    );

}


// =========================================================
// SAVE THEME PREFERENCE
// =========================================================

function saveTheme(theme) {

    if (
        theme !== "dark" &&
        theme !== "light" &&
        theme !== "system"
    ) {

        theme = "system";

    }


    localStorage.setItem(
        THEME_KEY,
        theme
    );


    applyGlobalTheme();

}


// =========================================================
// INITIALIZE THEME SETTINGS
// =========================================================

function initializeThemeSettings() {

    const themeInputs =
        document.querySelectorAll(
            'input[name="theme"]'
        );


    if (!themeInputs.length) {

        return;

    }


    const savedTheme =
        getSavedTheme();


    themeInputs.forEach(
        input => {

            input.checked =
                input.value === savedTheme;


            input.addEventListener(
                "change",
                () => {

                    if (!input.checked) {

                        return;

                    }


                    saveTheme(
                        input.value
                    );

                }
            );

        }
    );

}


// =========================================================
// WATCH WINDOWS SYSTEM THEME
// =========================================================

const systemThemeMediaQuery =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


systemThemeMediaQuery.addEventListener(
    "change",
    () => {

        const preference =
            getSavedTheme();


        if (preference !== "system") {

            return;

        }


        console.log(
            "🎨 Windows appearance changed."
        );


        applyGlobalTheme();

    }
);


// =========================================================
// APPLY IMMEDIATELY
// =========================================================

applyGlobalTheme();

window.addEventListener(
    "pageshow",
    () => {

        applyGlobalTheme();

    }
);


// =========================================================
// INITIALIZE SETTINGS AFTER DOM LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeThemeSettings();

    }
);  