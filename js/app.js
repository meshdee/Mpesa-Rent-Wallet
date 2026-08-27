// ===========================================
// M-PESA Rent Wallet
// Version 11.0 Enterprise Stable
// app.js
// CHUNK 1
// ===========================================

"use strict";

console.log("Initializing M-PESA Rent Wallet Enterprise...");


// ===========================================
// Global State
// ===========================================

let user = null;

let wallet = null;

let landlord = null;

let properties = [];

let tenants = [];

// ===========================================
// DOM Elements
// ===========================================

const elements = {

    authView: document.getElementById("authView"),

    appView: document.getElementById("appView"),

    // Authentication Forms
    loginForm: document.getElementById("loginForm"),

    registerForm: document.getElementById("registerForm"),

    // Authentication Tabs
    showLoginBtn: document.getElementById("showLoginBtn"),

    showRegisterBtn: document.getElementById("showRegisterBtn"),

    // Login Inputs
    loginId: document.getElementById("loginId"),

    loginPassword: document.getElementById("loginPassword"),

    // Registration Inputs
    fullName: document.getElementById("fullName"),

    phoneNumber: document.getElementById("phoneNumber"),

    emailAddress: document.getElementById("emailAddress"),

    registerPassword: document.getElementById("registerPassword"),

    confirmPassword: document.getElementById("confirmPassword"),

    // Dashboard
    logoutBtn: document.getElementById("logoutBtn"),

    tenantWorkspaceBtn: document.getElementById("tenantWorkspaceBtn"),

    landlordWorkspaceBtn: document.getElementById("landlordWorkspaceBtn"),

    tenantDashboard: document.getElementById("tenantDashboard"),

    landlordDashboard: document.getElementById("landlordDashboard")

};

// ===========================================
// Utility Functions
// ===========================================

function show(element){

    if(element){

        element.classList.remove("hidden");

    }

}

function hide(element){

    if(element){

        element.classList.add("hidden");

    }

}

function formatMoney(amount){

    return `KES ${Number(amount || 0).toLocaleString()}`;

}

function currentUserId(){

    return localStorage.getItem(STORAGE.USER_ID);

}

function currentUserEmail(){

    return localStorage.getItem(STORAGE.USER_EMAIL);

}

function currentLandlordId(){

    return localStorage.getItem(STORAGE.LANDLORD_ID);

}

function userLoggedIn(){

    return (

        localStorage.getItem(STORAGE.SESSION) === "ACTIVE" &&

        currentUserId()

    );

}

// ===========================================
// Session Helpers
// ===========================================

function clearSession(){

    localStorage.removeItem(STORAGE.SESSION);

    localStorage.removeItem(STORAGE.USER_ID);

    localStorage.removeItem(STORAGE.USER_EMAIL);

    localStorage.removeItem(STORAGE.LANDLORD_ID);

}

function saveLandlordId(id){

    localStorage.setItem(

        STORAGE.LANDLORD_ID,

        id

    );

}

// ===========================================
// API Helper
// ===========================================

async function apiFetch(

    endpoint,

    options = {}

){

    const response = await fetch(

        API_BASE + endpoint,

        {

            headers:{

                "Content-Type":"application/json",

                ...(options.headers || {})

            },

            ...options

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw new Error(

            data.message ||

            "Server Error"

        );

    }

    return data;

}

// ===========================================
// Navigation
// ===========================================

function switchToAuth(){

    show(elements.authView);

    hide(elements.appView);

}

function switchToDashboard(){

    hide(elements.authView);

    show(elements.appView);

}

console.log("✅ app.js Chunk 1 Loaded");

// ===========================================
// CHUNK 2
// Dashboard Engine
// Version 11.0 Enterprise Stable
// ===========================================

// ===========================================
// Restore Logged In User
// ===========================================

async function restoreUserSession(){

    if(!userLoggedIn()){

        switchToAuth();

        return false;

    }

    user = {

        id: currentUserId(),

        email: currentUserEmail()

    };

    console.log("Current User:", user);

    switchToDashboard();

    return true;

}

// ===========================================
// Load User Profile
// ===========================================

async function loadUserProfile(){

    if(!user){

        return;

    }

    try{

        const response = await apiFetch(

            `/users/${user.id}`

        );

        user = response.user;

        renderUser();

    }

    catch(error){

        console.log(

            "Profile unavailable.",

            error.message

        );

    }

}

// ===========================================
// Load Wallet
// ===========================================

async function loadWallet(){

    if(!user){

        return;

    }

    try{

        wallet = await apiFetch(

            `/wallet/${user.id}`

        );

    }

    catch(error){

        console.log(

            "Wallet not found. Creating default wallet..."

        );

        wallet = {

            rentGoal:25000,

            walletBalance:0,

            dueDate:"",

            history:[]

        };

    }

    renderWallet();

}

// ===========================================
// Greeting
// ===========================================

function updateGreeting(){

    const greeting = document.getElementById("greeting");

    if(!greeting){

        return;

    }

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.textContent = "Good Morning";

    }

    else if(hour < 17){

        greeting.textContent = "Good Afternoon";

    }

    else{

        greeting.textContent = "Good Evening";

    }

}

// ===========================================
// Render User
// ===========================================

function renderUser(){

    if(!user){

        return;

    }

    const ids = {

        profileName:

            document.getElementById("profileName"),

        profilePhone:

            document.getElementById("profilePhone"),

        profileEmail:

            document.getElementById("profileEmail"),

        dashboardUserName:

            document.getElementById("dashboardUserName"),

        userNameLine:

            document.getElementById("userNameLine")

    };

    if(ids.profileName){

        ids.profileName.textContent =

            user.fullName || "-";

    }

    if(ids.profilePhone){

        ids.profilePhone.textContent =

            user.phone || "-";

    }

    if(ids.profileEmail){

        ids.profileEmail.textContent =

            user.email || "-";

    }

    if(ids.dashboardUserName){

        ids.dashboardUserName.textContent =

            user.fullName || "-";

    }

    if(ids.userNameLine){

        ids.userNameLine.textContent =

            user.fullName || "-";

    }

}

// ===========================================
// Render Wallet
// ===========================================

function renderWallet(){

    if(!wallet){

        return;

    }

    const saved = Number(

        wallet.walletBalance || 0

    );

    const goal = Number(

        wallet.rentGoal || 25000

    );

    const remaining = Math.max(

        goal - saved,

        0

    );

    const progress =

        goal === 0

        ? 0

        : Math.round(

            (saved / goal) * 100

        );

    const savedAmount =

        document.getElementById("savedAmount");

    const remainingAmount =

        document.getElementById("remainingAmount");

    const progressPercent =

        document.getElementById("progressPercent");

    const progressFill =

        document.getElementById("progressFill");

    if(savedAmount){

        savedAmount.textContent =

            formatMoney(saved);

    }

    if(remainingAmount){

        remainingAmount.textContent =

            formatMoney(remaining);

    }

    if(progressPercent){

        progressPercent.textContent =

            `${progress}%`;

    }

    if(progressFill){

        progressFill.style.width =

            `${progress}%`;

    }

}

// ===========================================
// Main Renderer
// ===========================================

function renderApplication(){

    if(!userLoggedIn()){

        switchToAuth();

        return;

    }

    switchToDashboard();

    updateGreeting();

    renderUser();

    renderWallet();

}

console.log("✅ app.js Chunk 2 Loaded");

// ===========================================
// CHUNK 3
// Application Engine
// Version 11.0 Enterprise Stable
// ===========================================

// ===========================================
// Refresh Dashboard
// ===========================================

async function refreshDashboard() {

    if (!userLoggedIn()) {

        return;

    }

    await loadUserProfile();

    await loadWallet();

    renderApplication();

}

// ===========================================
// Logout
// ===========================================

function logout() {

    clearSession();

    user = null;

    landlord = null;

    wallet = null;

    properties = [];

    tenants = [];

    window.location.href = "../index.html";

}

// ===========================================
// Workspace Navigation
// ===========================================

function openTenantWorkspace() {

    if (elements.tenantDashboard) {

        show(elements.tenantDashboard);

    }

    if (elements.landlordDashboard) {

        hide(elements.landlordDashboard);

    }

}

function openLandlordWorkspace() {

    if (elements.landlordDashboard) {

        show(elements.landlordDashboard);

    }

    if (elements.tenantDashboard) {

        hide(elements.tenantDashboard);

    }

}

// ===========================================
// Event Registration
// ===========================================
// ===========================================
// Authentication Tabs
// ===========================================

function showLoginForm() {

    elements.loginForm.classList.remove("hidden");

    elements.registerForm.classList.add("hidden");

    document
        .getElementById("showLoginBtn")
        .classList.add("active");

    document
        .getElementById("showRegisterBtn")
        .classList.remove("active");

}

function showRegisterForm() {

    elements.registerForm.classList.remove("hidden");

    elements.loginForm.classList.add("hidden");

    document
        .getElementById("showRegisterBtn")
        .classList.add("active");

    document
        .getElementById("showLoginBtn")
        .classList.remove("active");

}

function registerEventListeners() {

    if (elements.showLoginBtn) {

    elements.showLoginBtn.addEventListener(
        "click",
        showLoginForm
    );

}

if (elements.showRegisterBtn) {

    elements.showRegisterBtn.addEventListener(
        "click",
        showRegisterForm
    );

}

    if (elements.logoutBtn) {

        elements.logoutBtn.addEventListener(

            "click",

            logout

        );

    }

    if (elements.landlordWorkspaceBtn) {

        elements.landlordWorkspaceBtn.addEventListener(

            "click",

            openLandlordWorkspace

        );

    }

    if (elements.tenantWorkspaceBtn) {

        elements.tenantWorkspaceBtn.addEventListener(

            "click",

            openTenantWorkspace

        );

    }

}

// ===========================================
// Wallet Events
// ===========================================

function registerWalletEvents() {

    const saveGoalBtn =

        document.getElementById("saveGoalBtn");

    if (saveGoalBtn) {

        saveGoalBtn.addEventListener(

            "click",

            () => {

                console.log(

                    "Rent Goal feature coming in Version 11."

                );

            }

        );

    }

    const depositBtn =

        document.getElementById("depositBtn");

    if (depositBtn) {

        depositBtn.addEventListener(

            "click",

            () => {

                console.log(

                    "Deposit feature coming in Version 11."

                );

            }

        );

    }

}

console.log("✅ app.js Chunk 3 Loaded");

// ===========================================
// CHUNK 4
// Application Startup
// Version 11.0 Enterprise Stable
// ===========================================

// ===========================================
// Start Application
// ===========================================

async function startApplication() {

    console.log("Initializing M-PESA Rent Wallet...");

    registerEventListeners();

    registerWalletEvents();

    const loggedIn = await restoreUserSession();

    if (!loggedIn) {

        switchToAuth();

        return;

    }

    await refreshDashboard();

    console.log("M-PESA Rent Wallet Ready.");

}

// ===========================================
// Initialize
// ===========================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        startApplication();

    }

);

console.log("✅ app.js Version 11.0 Enterprise Stable Loaded");

// ===========================================
// PWA SERVICE WORKER REGISTRATION
// ===========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {

                console.log(
                    "✅ PWA Service Worker registered:",
                    registration.scope
                );

            })
            .catch((error) => {

                console.error(
                    "❌ PWA Service Worker registration failed:",
                    error
                );

            });

    });

}

// ===========================================
// MOBILE NAVIGATION
// ===========================================

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const dashboardShell =
    document.querySelector(".dashboard-shell");

if (mobileMenuBtn && dashboardShell) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            const isOpen =
                dashboardShell.classList.toggle(
                    "mobile-menu-open"
                );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        }
    );

}