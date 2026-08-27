// ===========================================
// M-PESA Rent Wallet
// Responsive Mobile Navigation
// ===========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.querySelector(".sidebar");
    const dashboardShell =
        document.querySelector(".dashboard-shell");

    if (!sidebar || !dashboardShell) {
        return;
    }

    // Create mobile menu button
    const mobileMenuBtn =
        document.createElement("button");

    mobileMenuBtn.id = "mobileMenuBtn";
    mobileMenuBtn.className = "mobile-menu-btn";
    mobileMenuBtn.type = "button";
    mobileMenuBtn.setAttribute(
        "aria-label",
        "Open navigation"
    );
    mobileMenuBtn.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenuBtn.innerHTML = "⋮";

    document.body.appendChild(mobileMenuBtn);

    // Open / close menu
    mobileMenuBtn.addEventListener("click", () => {

        const isOpen =
            dashboardShell.classList.toggle(
                "mobile-menu-open"
            );

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });

    // Close menu after selecting navigation
    sidebar.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            dashboardShell.classList.remove(
                "mobile-menu-open"
            );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

});