// ===========================================
// Authentication Helper
// ===========================================

function getCurrentUserId() {

    return localStorage.getItem(STORAGE.USER_ID);

}

function getCurrentUserEmail() {

    return localStorage.getItem(STORAGE.USER_EMAIL);

}

function isLoggedIn() {

    return !!localStorage.getItem(STORAGE.SESSION);

}