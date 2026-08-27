// ===========================================
// M-PESA Rent Wallet PWA
// Service Worker
// Version 1.1
// ===========================================

"use strict";

const CACHE_NAME = "mpesa-rent-wallet-v7";

const APP_SHELL = [
    "/",
    "/index.html",

    // CSS
    "/css/style.css",

    // JavaScript
    "/js/app.js",
    "/js/auth.js",
    "/js/property.js",
    "/js/landlord.js",
    "/js/mobile-nav.js",
    "/js/config/storage.js",
    "/js/offline-status.js",
    "/js/pwa-splash.js",

    // PWA
    "/manifest.json",
    "/icons/192.png",
    "/icons/512.png"
];


// ===========================================
// INSTALL
// ===========================================

self.addEventListener("install", event => {

    console.log(
        "📦 M-PESA Rent Wallet Service Worker installing..."
    );

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log(
                    "📦 Caching M-PESA Rent Wallet app shell..."
                );

                return cache.addAll(APP_SHELL);

            })

            .then(() => {

                console.log(
                    "✅ App shell cached successfully."
                );

            })

    );


});


// ===========================================
// ACTIVATE
// ===========================================

self.addEventListener("activate", event => {

    console.log(
        "✅ M-PESA Rent Wallet Service Worker activated."
    );

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {

                            console.log(
                                "🗑 Removing old cache:",
                                name
                            );

                            return caches.delete(name);

                        })

                );

            })

            .then(() => {

                console.log(
                    "✅ Old caches cleaned."
                );

            })

    );

    self.clients.claim();

});

// ===========================================
// FETCH
// ===========================================

self.addEventListener("fetch", event => {

    const request = event.request;


    // ===========================================
    // Only GET requests
    // ===========================================

    if (request.method !== "GET") {

        return;

    }


    // ===========================================
    // Never cache API/database requests
    // ===========================================

    if (request.url.includes("/api/")) {

        return;

    }


    // ===========================================
    // Network First
    // Development-friendly strategy
    // ===========================================

    event.respondWith(

        fetch(request)

            .then(networkResponse => {

                return networkResponse;

            })

            .catch(() => {

                return caches.match(request)

                    .then(cachedResponse => {

                        if (cachedResponse) {

                            return cachedResponse;

                        }

                        return caches.match(
                            "/index.html"
                        );

                    });

            })

    );

});

// ===========================================
// UPDATE MESSAGE
// ===========================================

self.addEventListener("message", event => {

    if (event.data === "SKIP_WAITING") {

        self.skipWaiting();

    }

});