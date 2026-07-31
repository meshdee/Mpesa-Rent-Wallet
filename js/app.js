// ===========================================
// M-PESA Rent Wallet
// Version 10.1 Stable
// app.js
// CHUNK 1
// ===========================================

"use strict";

console.log("Initializing M-PESA Rent Wallet...");

// ===========================================
// API Configuration
// ===========================================

const API_BASE = "/api";

// ===========================================
// Local Storage Keys
// ===========================================

const STORAGE = window.STORAGE;

// ===========================================
// Global State
// ===========================================

let user = null;

let wallet = null;

let landlord = null;

let session = {

    isLoggedIn: false,

    userId: null,

    landlordId: null

};

// ===========================================
// DOM Elements
// ===========================================

const elements = {

    authView: document.getElementById("authView"),

    appView: document.getElementById("appView"),

    loginForm: document.getElementById("loginForm"),

    registerForm: document.getElementById("registerForm"),

    showLoginBtn: document.getElementById("showLoginBtn"),

    showRegisterBtn: document.getElementById("showRegisterBtn"),

    loginId: document.getElementById("loginId"),

    loginPassword: document.getElementById("loginPassword"),

    fullName: document.getElementById("fullName"),

    phoneNumber: document.getElementById("phoneNumber"),

    emailAddress: document.getElementById("emailAddress"),

    registerPassword: document.getElementById("registerPassword"),

    confirmPassword: document.getElementById("confirmPassword"),

    logoutBtn: document.getElementById("logoutBtn"),

    tenantDashboard: document.getElementById("tenantDashboard"),

    landlordDashboard: document.getElementById("landlordDashboard"),

    tenantWorkspaceBtn: document.getElementById("tenantWorkspaceBtn"),

    landlordWorkspaceBtn: document.getElementById("landlordWorkspaceBtn")

};

// ===========================================
// Utility
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

// ===========================================
// Local Storage
// ===========================================

function saveSession(){

    localStorage.setItem(

        STORAGE.SESSION,

        JSON.stringify(session)

    );

}

function loadSession(){

    const stored = localStorage.getItem(

        STORAGE.SESSION

    );

    if(!stored){

        return;

    }

    try{

        session = JSON.parse(stored);

    }

    catch{

        session = {

            isLoggedIn:false,

            userId:null,

            landlordId:null

        };

    }

}

function clearSession(){

    localStorage.removeItem(

        STORAGE.SESSION

    );

    session = {

        isLoggedIn:false,

        userId:null,

        landlordId:null

    };

}

// ===========================================
// API Helper
// ===========================================

async function apiFetch(endpoint, options={}){

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
// Authentication Tabs
// ===========================================

function showLoginTab(){

    show(elements.loginForm);

    hide(elements.registerForm);

}

function showRegisterTab(){

    hide(elements.loginForm);

    show(elements.registerForm);

}

// ===========================================
// Register
// ===========================================

async function registerUser(event){

    event.preventDefault();

    const fullName =

        elements.fullName.value.trim();

    const phone =

        elements.phoneNumber.value.trim();

    const email =

        elements.emailAddress.value.trim();

    const password =

        elements.registerPassword.value;

    const confirm =

        elements.confirmPassword.value;

    if(

        !fullName ||

        !phone ||

        !email ||

        !password ||

        !confirm

    ){

        return alert("Complete all fields.");

    }

    if(password !== confirm){

        return alert("Passwords do not match.");

    }

    try{

        const response = await apiFetch(

            "/auth/register",

            {

                method:"POST",

                body:JSON.stringify({

                    fullName,

                    phone,

                    email,

                    password

                })

            }

        );

        alert(response.message);

        elements.registerForm.reset();

        showLoginTab();

    }

    catch(error){

        alert(error.message);

    }

}

// ===========================================
// Login
// ===========================================

async function loginUser(event){

    event.preventDefault();

    const login =

        elements.loginId.value.trim();

    const password =

        elements.loginPassword.value;

    if(!login || !password){

        return alert(

            "Enter your login credentials."

        );

    }

    try{

        const response = await apiFetch(

            "/auth/login",

            {

                method:"POST",

                body:JSON.stringify({

                    login,

                    password

                })

            }

        );

        user = response.user;

        session = {

            isLoggedIn:true,

            userId:user.id,

            landlordId:null

        };

        saveSession();

        localStorage.setItem(

            STORAGE.USER_ID,

            user.id

        );

        localStorage.setItem(

            STORAGE.USER_EMAIL,

            user.email

        );

        console.log("Login successful");

        console.log(user);

        switchToDashboard();

    }

    catch(error){

        alert(error.message);

    }

}

// ===========================================
// CHUNK 2
// Dashboard Engine
// ===========================================

function switchToDashboard(){

    hide(elements.authView);

    show(elements.appView);

}

function switchToAuth(){

    show(elements.authView);

    hide(elements.appView);

}

// ===========================================
// Restore User Session
// ===========================================

async function restoreUserSession(){

    loadSession();

    console.log("Restored session:", session);

    if(

        !session.isLoggedIn ||

        !session.userId

    ){

        switchToAuth();

        return;

    }

    try{

        const response = await apiFetch(

            `/auth/profile/${session.userId}`

        );

        user = response.user;

        console.log("Profile restored:", user);

        switchToDashboard();

    }

    catch(error){

        console.error(

            "Unable to restore profile:",

            error.message

        );

        clearSession();

        switchToAuth();

    }

}

// ===========================================
// Logout
// ===========================================

async function logoutUser(){

    try{

        await apiFetch(

            "/auth/logout",

            {

                method:"POST"

            }

        );

    }

    catch(error){

        console.log(error.message);

    }

    clearSession();

    localStorage.removeItem(

        STORAGE.USER_ID

    );

    localStorage.removeItem(

        STORAGE.USER_EMAIL

    );

    localStorage.removeItem(

        STORAGE.LANDLORD_ID

    );

    user = null;

    wallet = null;

    landlord = null;

    switchToAuth();

}

// ===========================================
// Workspace
// ===========================================

function openTenantWorkspace(){

    hide(elements.landlordDashboard);

    show(elements.tenantDashboard);

}

function openLandlordWorkspace(){

    hide(elements.tenantDashboard);

    show(elements.landlordDashboard);

}

// ===========================================
// Greeting
// ===========================================

function updateGreeting(){

    const greeting =

        document.getElementById("greeting");

    if(!greeting){

        return;

    }

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.textContent =

            "Good Morning";

    }

    else if(hour < 17){

        greeting.textContent =

            "Good Afternoon";

    }

    else{

        greeting.textContent =

            "Good Evening";

    }

}

// ===========================================
// Profile Rendering
// ===========================================

function renderUser(){

    if(!user){

        return;

    }

    const profileName =

        document.getElementById("profileName");

    const profilePhone =

        document.getElementById("profilePhone");

    const profileEmail =

        document.getElementById("profileEmail");

    const userNameLine =

        document.getElementById("userNameLine");

    if(profileName){

        profileName.textContent =

            user.fullName;

    }

    if(profilePhone){

        profilePhone.textContent =

            user.phone;

    }

    if(profileEmail){

        profileEmail.textContent =

            user.email;

    }

    if(userNameLine){

        userNameLine.textContent =

            user.fullName;

    }

}

// ===========================================
// Main Renderer
// ===========================================

function renderApplication(){

    if(

        !session.isLoggedIn ||

        !user

    ){

        switchToAuth();

        return;

    }

    switchToDashboard();

    updateGreeting();

    renderUser();

}

// ===========================================
// Register Events
// ===========================================

function registerEventListeners(){

    if(elements.showLoginBtn){

        elements.showLoginBtn.addEventListener(

            "click",

            showLoginTab

        );

    }

    if(elements.showRegisterBtn){

        elements.showRegisterBtn.addEventListener(

            "click",

            showRegisterTab

        );

    }

    if(elements.loginForm){

        elements.loginForm.addEventListener(

            "submit",

            loginUser

        );

    }

    if(elements.registerForm){

        elements.registerForm.addEventListener(

            "submit",

            registerUser

        );

    }

    if(elements.logoutBtn){

        elements.logoutBtn.addEventListener(

            "click",

            logoutUser

        );

    }

    if(elements.tenantWorkspaceBtn){

        elements.tenantWorkspaceBtn.addEventListener(

            "click",

            openTenantWorkspace

        );

    }

    if(elements.landlordWorkspaceBtn){

        elements.landlordWorkspaceBtn.addEventListener(

            "click",

            openLandlordWorkspace

        );

    }

}

// ===========================================
// CHUNK 3
// Wallet Module
// ===========================================

const walletElements = {

    rentGoalInput: document.getElementById("rentGoalInput"),

    dueDateInput: document.getElementById("dueDateInput"),

    saveAmountInput: document.getElementById("saveAmountInput"),

    saveSettingsBtn: document.getElementById("saveSettingsBtn"),

    saveRentBtn: document.getElementById("saveRentBtn"),

    resetWalletBtn: document.getElementById("resetWalletBtn"),

    savedAmount: document.getElementById("savedAmount"),

    remainingAmount: document.getElementById("remainingAmount"),

    progressPercent: document.getElementById("progressPercent"),

    progressFill: document.getElementById("progressFill"),

    historyList: document.getElementById("historyList"),

    historyCount: document.getElementById("historyCount")

};

// ===========================================
// Load Wallet
// ===========================================

async function loadWallet(){

    if(!user){

        return;

    }

    try{

        const response = await apiFetch(

            `/wallet/${user.id}`

        );

        wallet = response.wallet;

    }

    catch(error){

        console.log("Creating default wallet...");

        wallet = {

            rentGoal:0,

            savedAmount:0,

            dueDate:"",

            history:[]

        };

    }

    renderWallet();

}

// ===========================================
// Render Wallet
// ===========================================

function renderWallet(){

    if(!wallet){

        return;

    }

    const goal = Number(wallet.rentGoal || 0);

    const saved = Number(wallet.savedAmount || 0);

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

    if(walletElements.savedAmount){

        walletElements.savedAmount.textContent =

            `KES ${saved.toLocaleString()}`;

    }

    if(walletElements.remainingAmount){

        walletElements.remainingAmount.textContent =

            `KES ${remaining.toLocaleString()}`;

    }

    if(walletElements.progressPercent){

        walletElements.progressPercent.textContent =

            `${progress}%`;

    }

    if(walletElements.progressFill){

        walletElements.progressFill.style.width =

            `${progress}%`;

    }

    if(walletElements.rentGoalInput){

        walletElements.rentGoalInput.value =

            goal;

    }

    if(walletElements.dueDateInput){

        walletElements.dueDateInput.value =

            wallet.dueDate || "";

    }

    renderHistory();

}

// ===========================================
// Wallet History
// ===========================================

function renderHistory(){

    if(!walletElements.historyList){

        return;

    }

    walletElements.historyList.innerHTML = "";

    const history = wallet.history || [];

    if(walletElements.historyCount){

        walletElements.historyCount.textContent =

            `${history.length} Transactions`;

    }

    if(history.length === 0){

        walletElements.historyList.innerHTML =

            "<li>No transactions yet.</li>";

        return;

    }

    history.forEach(item=>{

        const li = document.createElement("li");

        li.innerHTML =

        `<strong>KES ${Number(item.amount).toLocaleString()}</strong>
        <br>
        <small>${item.date}</small>`;

        walletElements.historyList.appendChild(li);

    });

}

// ===========================================
// Save Wallet Settings
// ===========================================

async function saveWalletSettings(){

    if(!user){

        return;

    }

    try{

        const response = await apiFetch(

            `/wallet/${user.id}/settings`,

            {

                method:"PUT",

                body:JSON.stringify({

                    rentGoal:Number(

                        walletElements.rentGoalInput.value

                    ),

                    dueDate:

                        walletElements.dueDateInput.value

                })

            }

        );

        wallet = response.wallet;

        renderWallet();

        alert("Wallet updated.");

    }

    catch(error){

        alert(error.message);

    }

}

// ===========================================
// Save Rent
// ===========================================

async function saveRent(){

    if(!user){

        return;

    }

    const amount = Number(

        walletElements.saveAmountInput.value

    );

    if(amount <= 0){

        return alert("Enter amount.");

    }

    try{

        const response = await apiFetch(

            `/wallet/${user.id}/save`,

            {

                method:"POST",

                body:JSON.stringify({

                    amount

                })

            }

        );

        wallet = response.wallet;

        walletElements.saveAmountInput.value = "";

        renderWallet();

        alert("Amount saved.");

    }

    catch(error){

        alert(error.message);

    }

}

// ===========================================
// Reset Wallet
// ===========================================

async function resetWallet(){

    if(!confirm(

        "Reset Rent Wallet?"

    )){

        return;

    }

    try{

        const response = await apiFetch(

            `/wallet/${user.id}/reset`,

            {

                method:"POST"

            }

        );

        wallet = response.wallet;

        renderWallet();

    }

    catch(error){

        alert(error.message);

    }

}

// ===========================================
// Wallet Event Listeners
// ===========================================

function registerWalletEvents(){

    if(walletElements.saveSettingsBtn){

        walletElements.saveSettingsBtn.addEventListener(

            "click",

            saveWalletSettings

        );

    }

    if(walletElements.saveRentBtn){

        walletElements.saveRentBtn.addEventListener(

            "click",

            saveRent

        );

    }

    if(walletElements.resetWalletBtn){

        walletElements.resetWalletBtn.addEventListener(

            "click",

            resetWallet

        );

    }

}

// ===========================================
// CHUNK 4
// Application Engine
// ===========================================

// ===========================================
// Refresh Dashboard
// ===========================================

async function refreshDashboard(){

    if(!session.isLoggedIn){

        return;

    }

    await loadWallet();

    renderApplication();

}

// ===========================================
// Application Startup
// ===========================================

async function startApplication(){

    console.log("Initializing M-PESA Rent Wallet...");

    registerEventListeners();

    registerWalletEvents();

    await restoreUserSession();

    if(session.isLoggedIn){

        await refreshDashboard();

    }

    else{

        switchToAuth();

    }

}

// ===========================================
// Global Helpers
// ===========================================

window.logoutUser = logoutUser;

window.refreshDashboard = refreshDashboard;

window.renderApplication = renderApplication;

window.loadWallet = loadWallet;

// ===========================================
// DOM Ready
// ===========================================

document.addEventListener(

    "DOMContentLoaded",

    async ()=>{

        try{

            await startApplication();

            console.log("M-PESA Rent Wallet Ready.");

        }

        catch(error){

            console.error(

                "Application failed to start.",

                error

            );

            switchToAuth();

        }

    }

);

// ===========================================
// END OF FILE
// VERSION 10.1 STABLE
// ===========================================