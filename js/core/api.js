// ===========================================
// M-PESA Rent Wallet
// Enterprise Edition
// Version 11.1
//
// Module: API Engine
//
// Responsibility:
// - GET
// - POST
// - PUT
// - DELETE
// - Error Handling
// ===========================================

"use strict";

const API_BASE = "/api";

async function request(endpoint, options = {}) {

    const response = await fetch(

        API_BASE + endpoint,

        {

            headers: {

                "Content-Type": "application/json",

                ...(options.headers || {})

            },

            ...options

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(

            data.message ||

            "Server Error"

        );

    }

    return data;

}

const api = {

    get(endpoint) {

        return request(endpoint);

    },

    post(endpoint, body) {

        return request(

            endpoint,

            {

                method: "POST",

                body: JSON.stringify(body)

            }

        );

    },

    put(endpoint, body) {

        return request(

            endpoint,

            {

                method: "PUT",

                body: JSON.stringify(body)

            }

        );

    },

    delete(endpoint) {

        return request(

            endpoint,

            {

                method: "DELETE"

            }

        );

    }

};

window.api = api;

console.log("✅ API Engine Version 11.1 Loaded");