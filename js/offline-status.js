// ===========================================
// M-PESA Rent Wallet
// PWA Network Status
// ===========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const status = document.createElement("div");

    status.id = "networkStatus";
    status.className = "network-status";

    document.body.appendChild(status);


    function updateNetworkStatus() {

        if (navigator.onLine) {

            status.textContent = "🟢 Online — Connected";
            status.classList.remove("offline");

            status.classList.add("online");

        } else {

            status.textContent =
                "🟠 Offline — Some features may be unavailable";

            status.classList.remove("online");

            status.classList.add("offline");

        }

    }


    // Initial status
    updateNetworkStatus();


    // Connection restored
    window.addEventListener(
        "online",
        updateNetworkStatus
    );


    // Connection lost
    window.addEventListener(
        "offline",
        updateNetworkStatus
    );

});