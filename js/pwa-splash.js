// ===========================================
// M-PESA Rent Wallet
// PWA Splash Screen Controller
// ===========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const splash =
        document.getElementById("pwaSplash");

    if (!splash) {
        return;
    }

    // Give the application a moment to initialize
    setTimeout(() => {

        splash.classList.add("hidden");

        // Remove splash from the page after fade-out
        setTimeout(() => {

            splash.remove();

        }, 600);

    }, 1500);

});