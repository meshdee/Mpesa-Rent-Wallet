// ===========================================
// M-PESA Rent Wallet
// Wallet Module
// Version 11.7 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("WALLET MODULE VERSION 11.7");
console.log("===========================================");

// ===========================================
// Storage
// ===========================================

const walletUserId =
    localStorage.getItem(STORAGE.USER_ID);

const walletUserName =
    localStorage.getItem(STORAGE.USER_NAME);

// ===========================================
// HTML Elements
// ===========================================

// Wallet Status
const walletStatus =
    document.getElementById("walletStatus");

// Rent Summary
const walletRentGoal =
    document.getElementById("walletRentGoal");

const walletSavedAmount =
    document.getElementById("walletSavedAmount");

const walletRemaining =
    document.getElementById("walletRemaining");

const walletDueDate =
    document.getElementById("walletDueDate");

// Wallet Settings
const walletRentGoalInput =
    document.getElementById("walletRentGoalInput");

const walletDueDateInput =
    document.getElementById("walletDueDateInput");

const saveWalletSettingsBtn =
    document.getElementById("saveWalletSettingsBtn");

// Save Rent
const walletSaveAmountInput =
    document.getElementById("walletSaveAmountInput");

const saveRentBtn =
    document.getElementById("saveRentBtn");

// Reset
const resetWalletBtn =
    document.getElementById("resetWalletBtn");

const historyList =
    document.getElementById("historyList");

const historyCount =
    document.getElementById("historyCount");

// ===========================================
// Wallet State
// ===========================================

let walletData = null;

// ===========================================
// Currency Formatter
// ===========================================

function formatCurrency(amount) {

    const value = Number(amount) || 0;

    return `KES ${value.toLocaleString("en-KE")}`;

}

// ===========================================
// Display Wallet
// ===========================================

function displayWallet(wallet) {

    if (!wallet) {

        console.warn(
            "No wallet data available."
        );

        return;

    }

    walletData = wallet;

    const rentGoal =
        Number(wallet.rentGoal) || 0;

    const savedAmount =
        Number(wallet.savedAmount) || 0;

    const remaining =
        Math.max(

            rentGoal - savedAmount,

            0

        );

    // ===================================
    // Wallet Status
    // ===================================

    if (walletStatus) {

        walletStatus.textContent =
            "Active";

    }

    // ===================================
    // Rent Goal
    // ===================================

    if (walletRentGoal) {

        walletRentGoal.textContent =
            formatCurrency(rentGoal);

    }

    // ===================================
    // Saved Amount
    // ===================================

    if (walletSavedAmount) {

        walletSavedAmount.textContent =
            formatCurrency(savedAmount);

    }

    // ===================================
    // Remaining
    // ===================================

    if (walletRemaining) {

        walletRemaining.textContent =
            formatCurrency(remaining);

    }

    // ===================================
    // Due Date
    // ===================================

    if (walletDueDate) {

        if (wallet.dueDate) {

            const date =
                new Date(wallet.dueDate);

            if (!Number.isNaN(date.getTime())) {

                walletDueDate.textContent =
                    date.toLocaleDateString(
                        "en-KE",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    );

            }

            else {

                walletDueDate.textContent =
                    wallet.dueDate;

            }

        }

        else {

            walletDueDate.textContent =
                "Not set";

        }

    }

    // ===================================
    // Settings Inputs
    // ===================================

    if (walletRentGoalInput) {

        walletRentGoalInput.value =
            rentGoal > 0
                ? rentGoal
                : "";

    }

    if (walletDueDateInput) {

        if (wallet.dueDate) {

            const date =
                new Date(wallet.dueDate);

            if (!Number.isNaN(date.getTime())) {

                const year =
                    date.getFullYear();

                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        date.getDate()
                    ).padStart(2, "0");

                walletDueDateInput.value =
                    `${year}-${month}-${day}`;

            }

        }

        else {

            walletDueDateInput.value = "";

        }

    }

}

// ===========================================
// Load Wallet
// ===========================================

async function loadWallet() {

    console.log("-------------------------------------------");
    console.log("LOADING WALLET");
    console.log("-------------------------------------------");

    if (!walletUserId) {

        console.warn(
            "No logged-in User ID found."
        );

        if (walletStatus) {

            walletStatus.textContent =
                "User not identified";

        }

        return;

    }

    try {

        const response = await fetch(

            `/api/wallet/${walletUserId}`

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

        if (!response.ok || !result.success) {

            throw new Error(

                result.message ||
                "Unable to load wallet."

            );

        }

        displayWallet(
    result.wallet
);


// ===========================================
// Load Transaction History
// ===========================================

await loadTransactionHistory();


console.log(
    "✅ Wallet loaded successfully."
);

    }

    catch (error) {

        console.error(
            "Wallet Loading Error:",
            error
        );

        if (walletStatus) {

            walletStatus.textContent =
                "Unable to load wallet";

        }

    }

}

// ===========================================
// Load Transaction History
// ===========================================

async function loadTransactionHistory() {

    console.log("-------------------------------------------");
    console.log("LOADING TRANSACTION HISTORY");
    console.log("-------------------------------------------");


    if (!walletUserId) {

        console.warn(
            "No logged-in User ID found."
        );

        return;

    }


    if (!historyList) {

        console.warn(
            "historyList element not found."
        );

        return;

    }


    try {

        const response =
            await fetch(

                `/api/wallet/${walletUserId}/transactions`

            );


        console.log(
            "Transaction History HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Transaction History API Result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(

                result.message ||
                "Unable to load transaction history."

            );

        }


        const transactions =
            result.transactions || [];


        historyList.innerHTML = "";


        if (historyCount) {

            historyCount.textContent =

                `${transactions.length} ${
                    transactions.length === 1
                        ? "transaction"
                        : "transactions"
                }`;

        }


        if (!transactions.length) {

            historyList.innerHTML = `

                <li class="empty-state">

                    No transactions yet.

                </li>

            `;

            return;

        }


        transactions.forEach(
            transaction => {

                const amount =
                    Number(
                        transaction.amount || 0
                    );


                const date =
                    new Date(
                        transaction.createdAt
                    );


                const formattedDate =
                    date.toLocaleString(
                        "en-KE",
                        {
                            dateStyle: "medium",
                            timeStyle: "short"
                        }
                    );


                const item =
                    document.createElement("li");


              item.innerHTML = `

    <div class="history-info">

        <strong>
            Rent Saved
        </strong>

        <p class="muted">
            ${formattedDate}
        </p>

    </div>


    <div class="history-actions">

        <strong>
            KES ${amount.toLocaleString("en-KE")}
        </strong>

        <button
            type="button"
            class="secondary view-receipt-btn"
            data-id="${transaction.id}"
        >
            View Receipt
        </button>

    </div>

`;


                historyList.appendChild(
                    item
                );

            }
        );

        document
    .querySelectorAll(
        ".view-receipt-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    viewReceipt(
                        button.dataset.id
                    );

                }
            );

        }
    );


        console.log(
            "✅ Transaction history rendered successfully."
        );

    }

    catch (error) {

        console.error(
            "Transaction History Error:",
            error
        );


        historyList.innerHTML = `

            <li class="empty-state">

                Unable to load transaction history.

            </li>

        `;

    }

}

// ===========================================
// View Transaction Receipt
// ===========================================

async function viewReceipt(transactionId) {

    if (!walletUserId) {

        alert("User session not found.");

        return;

    }


    if (!transactionId) {

        alert("Transaction ID not found.");

        return;

    }


    try {

        const response =
            await fetch(

                `/api/wallet/${walletUserId}/transactions/${transactionId}`

            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(

                result.message ||
                "Unable to load receipt."

            );

        }


        const transaction =
            result.transaction;


        const amount =
            Number(
                transaction.amount || 0
            );


        const date =
            new Date(
                transaction.createdAt
            );


        const receiptDate =
            date.toLocaleDateString(
                "en-KE",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        const receiptTime =
            date.toLocaleTimeString(
                "en-KE",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        const existingReceipt =
            document.getElementById(
                "receiptModal"
            );


        if (existingReceipt) {

            existingReceipt.remove();

        }


        const modal =
            document.createElement("div");


        modal.id =
            "receiptModal";


        modal.className =
            "receipt-modal";


        modal.innerHTML = `

            <div
                class="receipt-overlay"
                id="receiptOverlay">
            </div>


            <div
                class="receipt-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="receiptTitle">


                <div
                    class="receipt-card"
                    id="printableReceipt">


                    <div
                        class="receipt-header">

                        <p class="receipt-brand">
                            M-PESA
                        </p>

                        <h2 id="receiptTitle">
                            Rent Wallet
                        </h2>

                        <p class="muted">
                            Rent Saving Receipt
                        </p>

                    </div>


                    <div
                        class="receipt-status">

                        <span>
                            ✓
                        </span>

                        <strong>
                            SUCCESS
                        </strong>

                    </div>


                    <div
                        class="receipt-amount">

                        <p class="muted">
                            Amount Saved
                        </p>

                        <h1>
                            KES ${
                                amount.toLocaleString(
                                    "en-KE"
                                )
                            }
                        </h1>

                    </div>


                    <div
                        class="receipt-details">


                        <div>

                            <span>
                                Transaction ID
                            </span>

                            <strong>
                                ${transaction.id}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Date
                            </span>

                            <strong>
                                ${receiptDate}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Time
                            </span>

                            <strong>
                                ${receiptTime}
                            </strong>

                        </div>


                    </div>


                    <div
                        class="receipt-footer">

                        <p>
                            Thank you for using
                            M-PESA Rent Wallet.
                        </p>

                    </div>


                </div>


                <div
    class="receipt-actions">

    <button
        type="button"
        id="savePdfReceiptBtn">

        Save as PDF

    </button>


    <button
        type="button"
        class="secondary"
        id="printReceiptBtn">

        Print Receipt

    </button>


    <button
        type="button"
        class="secondary"
        id="closeReceiptBtn">

        Close

    </button>

</div>

        `;


        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "closeReceiptBtn"
            )
            .addEventListener(
                "click",
                () => {

                    modal.remove();

                }
            );


        document
            .getElementById(
                "receiptOverlay"
            )
            .addEventListener(
                "click",
                () => {

                    modal.remove();

                }
            );


        function printRentReceipt() {

    const receipt =
        document.getElementById(
            "printableReceipt"
        );


    if (!receipt) {

        console.error(
            "❌ Printable receipt not found."
        );

        alert(
            "Unable to print the receipt."
        );

        return;

    }


    // -----------------------------------------------------
    // Create a clean printable document
    // -----------------------------------------------------

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=800,height=900"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the receipt."
        );

        return;

    }


    printWindow.document.open();


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                M-PESA Rent Wallet Receipt
            </title>


            <style>

                * {
                    box-sizing: border-box;
                }


                body {

                    margin: 0;

                    padding: 40px;

                    background: #ffffff;

                    color: #111111;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                }


                .receipt-card {

                    width: 100%;

                    max-width: 700px;

                    margin: 0 auto;

                    padding: 35px;

                    background: #ffffff;

                    color: #111111;

                    border:
                        1px solid #dddddd;

                    border-radius: 12px;

                }


                .receipt-header {

                    text-align: center;

                    padding-bottom: 25px;

                    border-bottom:
                        1px solid #dddddd;

                }


                .receipt-brand {

                    margin: 0 0 5px;

                    color: #00a651;

                    font-size: 28px;

                    font-weight: 800;

                }


                .receipt-header h2 {

                    margin: 0;

                    color: #111111;

                }


                .receipt-header .muted {

                    color: #666666;

                }


                .receipt-status {

                    margin: 25px 0;

                    padding: 12px;

                    text-align: center;

                    color: #087a3c;

                    background: #eaf8f0;

                    border:
                        1px solid #b7e6c9;

                    border-radius: 8px;

                }


                .receipt-amount {

                    text-align: center;

                    padding: 10px 0 25px;

                }


                .receipt-amount .muted {

                    color: #666666;

                }


                .receipt-amount h1 {

                    margin: 5px 0;

                    color: #111111;

                    font-size: 36px;

                }


                .receipt-details {

                    display: block;

                }


                .receipt-details > div {

                    padding: 15px;

                    margin-bottom: 10px;

                    background: #f7f7f7;

                    border:
                        1px solid #dddddd;

                    border-radius: 8px;

                }


                .receipt-details span {

                    display: block;

                    margin-bottom: 5px;

                    color: #666666;

                    font-size: 13px;

                }


                .receipt-details strong {

                    color: #111111;

                    word-break: break-word;

                }


                .receipt-footer {

                    margin-top: 25px;

                    padding-top: 20px;

                    text-align: center;

                    color: #666666;

                    border-top:
                        1px solid #dddddd;

                }

            </style>

        </head>


        <body>


            ${receipt.outerHTML}


        </body>


        </html>

    `);


    printWindow.document.close();


    // -----------------------------------------------------
    // Wait for document rendering
    // -----------------------------------------------------

    printWindow.onload = () => {

        printWindow.focus();

        printWindow.print();

        printWindow.close();

    };

}


// =========================================================
// PRINT RECEIPT
// =========================================================

const printReceiptBtn =
    document.getElementById(
        "printReceiptBtn"
    );


if (printReceiptBtn) {

    printReceiptBtn.addEventListener(
        "click",
        printRentReceipt
    );

}


// =========================================================
// SAVE AS PDF
// =========================================================

const savePdfReceiptBtn =
    document.getElementById(
        "savePdfReceiptBtn"
    );


if (savePdfReceiptBtn) {

    savePdfReceiptBtn.addEventListener(
        "click",
        printRentReceipt
    );

}

    }

    catch (error) {

        console.error(
            "View Receipt Error:",
            error
        );


        alert(

            error.message ||
            "Unable to load receipt."

        );

    }

}

// ===========================================
// Save Wallet Settings
// ===========================================

async function saveWalletSettings() {

    if (!walletUserId) {

        alert(
            "User session not found."
        );

        return;

    }

    const rentGoal =
        Number(
            walletRentGoalInput
                ? walletRentGoalInput.value
                : 0
        );

    const dueDate =
        walletDueDateInput
            ? walletDueDateInput.value
            : "";

    if (

        !Number.isFinite(rentGoal) ||

        rentGoal < 0

    ) {

        alert(
            "Please enter a valid monthly rent goal."
        );

        return;

    }

    try {

        saveWalletSettingsBtn.disabled =
            true;

        saveWalletSettingsBtn.textContent =
            "Saving...";

        const response =
            await fetch(

                `/api/wallet/${walletUserId}/settings`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        rentGoal,

                        dueDate:
                            dueDate || null

                    })

                }

            );

        const result =
            await response.json();

        if (

            !response.ok ||

            !result.success

        ) {

            throw new Error(

                result.message ||
                "Unable to save wallet settings."

            );

        }

        displayWallet(
            result.wallet
        );

        alert(
            result.message ||
            "Wallet settings saved successfully."
        );

    }

    catch (error) {

        console.error(
            "Save Wallet Settings Error:",
            error
        );

        alert(
            error.message ||
            "Unable to save wallet settings."
        );

    }

    finally {

        saveWalletSettingsBtn.disabled =
            false;

        saveWalletSettingsBtn.textContent =
            "Save Wallet Settings";

    }

}

// ===========================================
// Save Rent
// ===========================================

async function saveRent() {

    if (!walletUserId) {

        alert(
            "User session not found."
        );

        return;

    }

    const amount =
        Number(
            walletSaveAmountInput
                ? walletSaveAmountInput.value
                : 0
        );

    if (

        !Number.isFinite(amount) ||

        amount <= 0

    ) {

        alert(
            "Please enter a valid amount to save."
        );

        return;

    }

    try {

        saveRentBtn.disabled =
            true;

        saveRentBtn.textContent =
            "Saving...";

        const response =
            await fetch(

                `/api/wallet/${walletUserId}/save`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        amount

                    })

                }

            );

        const result =
            await response.json();

        if (

            !response.ok ||

            !result.success

        ) {

            throw new Error(

                result.message ||
                "Unable to save rent."

            );

        }

        displayWallet(
            result.wallet
        );

        if (walletSaveAmountInput) {

            walletSaveAmountInput.value =
                "";

        }

        alert(

            result.message ||
            "Rent saved successfully."

        );

    }

    catch (error) {

        console.error(
            "Save Rent Error:",
            error
        );

        alert(

            error.message ||
            "Unable to save rent."

        );

    }

    finally {

        saveRentBtn.disabled =
            false;

        saveRentBtn.textContent =
            "Save Rent";

    }

}

// ===========================================
// Reset Wallet
// ===========================================

async function resetWallet() {

    if (!walletUserId) {

        alert(
            "User session not found."
        );

        return;

    }

    const confirmed =
        confirm(

            "Are you sure you want to reset this wallet? " +
            "This will clear the rent goal, saved amount and due date."

        );

    if (!confirmed) {

        return;

    }

    try {

        resetWalletBtn.disabled =
            true;

        resetWalletBtn.textContent =
            "Resetting...";

        const response =
            await fetch(

                `/api/wallet/${walletUserId}/reset`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    }

                }

            );

        const result =
            await response.json();

        if (

            !response.ok ||

            !result.success

        ) {

            throw new Error(

                result.message ||
                "Unable to reset wallet."

            );

        }

        displayWallet(
            result.wallet
        );

        if (walletSaveAmountInput) {

            walletSaveAmountInput.value =
                "";

        }

        alert(

            result.message ||
            "Wallet reset successfully."

        );

    }

    catch (error) {

        console.error(
            "Reset Wallet Error:",
            error
        );

        alert(

            error.message ||
            "Unable to reset wallet."

        );

    }

    finally {

        resetWalletBtn.disabled =
            false;

        resetWalletBtn.textContent =
            "Reset Wallet";

    }

}

// ===========================================
// Button Events
// ===========================================

if (saveWalletSettingsBtn) {

    saveWalletSettingsBtn.addEventListener(

        "click",

        saveWalletSettings

    );

}

if (saveRentBtn) {

    saveRentBtn.addEventListener(

        "click",

        saveRent

    );

}

if (resetWalletBtn) {

    resetWalletBtn.addEventListener(

        "click",

        resetWallet

    );

}

// ===========================================
// Initialize
// ===========================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        console.log("-------------------------------------------");
        console.log("WALLET PAGE INITIALIZED");
        console.log("-------------------------------------------");

        await loadWallet();

        console.log(
            "✅ Wallet Module Ready"
        );

    }

);

console.log(
    "✅ Wallet Module Version 11.7 Enterprise Loaded"
);