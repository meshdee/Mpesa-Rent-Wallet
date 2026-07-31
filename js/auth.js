// ===========================================
// M-PESA Rent Wallet
// Authentication Module
// Version 10.0 - Part 1
// ===========================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginId = document.getElementById("loginId");
const loginPassword = document.getElementById("loginPassword");

const fullName = document.getElementById("fullName");
const phoneNumber = document.getElementById("phoneNumber");
const emailAddress = document.getElementById("emailAddress");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

// ===========================================
// Register
// ===========================================

async function registerUser(e) {

    e.preventDefault();

    if (registerPassword.value !== confirmPassword.value) {

        alert("Passwords do not match.");

        return;

    }

    const response = await fetch("/api/auth/register", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            fullName: fullName.value.trim(),

            phone: phoneNumber.value.trim(),

            email: emailAddress.value.trim(),

            password: registerPassword.value

        })

    });

    const result = await response.json();

    alert(result.message);

}

// ===========================================
// Login
// ===========================================

async function loginUser(e) {

    e.preventDefault();

    const response = await fetch("/api/auth/login", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            login: loginId.value.trim(),

            password: loginPassword.value

        })

    });

    const result = await response.json();

    if (!result.success) {

        alert(result.message);

        return;

    }

    localStorage.setItem(

        STORAGE.userId,

        result.user.id

    );

    localStorage.setItem(

        STORAGE.userEmail,

        result.user.email

    );

    localStorage.setItem(

        STORAGE.session,

        "ACTIVE"

    );

    alert("Login successful.");

    location.reload();

}

// ===========================================
// Logout
// ===========================================

function logout() {

    localStorage.removeItem(STORAGE.userId);

    localStorage.removeItem(STORAGE.userEmail);

    localStorage.removeItem(STORAGE.landlordId);

    localStorage.removeItem(STORAGE.session);

    location.reload();

}

// ===========================================
// Events
// ===========================================

if (loginForm) {

    loginForm.addEventListener(

        "submit",

        loginUser

    );

}

if (registerForm) {

    registerForm.addEventListener(

        "submit",

        registerUser

    );

}