// ===========================================
// M-PESA Rent Wallet
// Enterprise Edition
// Version 11.5
// backend/server.js
// ===========================================

"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDatabase =
    require("./database/connection");


// ===========================================
// Routes
// ===========================================

const authRoutes =
    require("./routes/authRoutes");

const landlordRoutes =
    require("./routes/landlordRoutes");

const propertyRoutes =
    require("./routes/propertyRoutes");

const unitRoutes =
    require("./routes/unitRoutes");

const tenantRoutes =
    require("./routes/tenantRoutes");

const walletRoutes =
    require("./routes/walletRoutes");

const userRoutes =
    require("./routes/userRoutes");


// ===========================================
// Express Application
// ===========================================

const app = express();

const PORT =
    process.env.PORT || 3000;

const ROOT_DIR =
    path.join(__dirname, "..");


// ===========================================
// Middleware
// ===========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ===========================================
// Static Frontend Files
// ===========================================

// Serve PWA files from /public
app.use(
    express.static(
        path.join(ROOT_DIR, "public")
    )
);

// Serve the main application files
app.use(
    express.static(ROOT_DIR)
);


// ===========================================
// API ROUTES
// ===========================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);


// Landlord
app.use(
    "/api/landlord",
    landlordRoutes
);


// Properties
app.use(
    "/api/properties",
    propertyRoutes
);


// Units
app.use(
    "/api/units",
    unitRoutes
);


// Tenants
app.use(
    "/api/tenants",
    tenantRoutes
);


// Rent Wallet
app.use(
    "/api/wallet",
    walletRoutes
);


// User / Profile
app.use(
    "/api/users",
    userRoutes
);


// ===========================================
// FRONTEND PAGE ROUTES
// ===========================================

// ===========================================
// Login / Home
// ===========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "index.html"
        )
    );

});


// ===========================================
// Dashboard
// ===========================================

app.get("/dashboard", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "dashboard.html"
        )
    );

});


// ===========================================
// Properties
// ===========================================

app.get("/properties", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "properties.html"
        )
    );

});


// ===========================================
// Units
// ===========================================

app.get("/units", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "units.html"
        )
    );

});


// ===========================================
// Tenants
// ===========================================

app.get("/tenants", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "tenants.html"
        )
    );

});


// ===========================================
// Rent Wallet
// ===========================================

app.get("/wallet", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "wallet.html"
        )
    );

});


// ===========================================
// Profile
// ===========================================

app.get("/profile", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "profile.html"
        )
    );

});

// ===========================================
// Settings
// ===========================================

app.get("/settings", (req, res) => {

    res.sendFile(

        path.join(
            ROOT_DIR,
            "pages",
            "settings.html"
        )

    );

});


// ===========================================
// Landlord
// ===========================================

app.get("/landlord", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "landlord.html"
        )
    );

});


// ===========================================
// Tenant Workspace
// ===========================================

app.get("/tenant", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "pages",
            "tenant.html"
        )
    );

});


// ===========================================
// HEALTH CHECK
// ===========================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        application:
            "M-PESA Rent Wallet",

        version:
            "11.5 Enterprise",

        database:
            "Connected",

        server:
            "Running",

        timestamp:
            new Date()

    });

});


// ===========================================
// API 404 HANDLER
// ===========================================

app.use("/api", (req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API endpoint not found.",

        path:
            req.originalUrl

    });

});


// ===========================================
// FRONTEND 404 HANDLER
// ===========================================

app.use((req, res) => {

    res.status(404).send(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>Page Not Found</title>

            <style>

                body {

                    margin: 0;

                    min-height: 100vh;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-family: Arial, sans-serif;

                    background: #f4f7f6;

                    color: #18312d;

                }

                .error-box {

                    background: white;

                    padding: 40px;

                    border-radius: 20px;

                    text-align: center;

                    box-shadow:
                        0 10px 30px
                        rgba(11,34,30,.08);

                }

                h1 {

                    margin-top: 0;

                    color: #00A651;

                }

                a {

                    display: inline-block;

                    margin-top: 20px;

                    padding: 12px 20px;

                    background: #00A651;

                    color: white;

                    text-decoration: none;

                    border-radius: 12px;

                    font-weight: bold;

                }

            </style>

        </head>

        <body>

            <div class="error-box">

                <h1>Page Not Found</h1>

                <p>
                    The page you requested does not exist.
                </p>

                <a href="/dashboard">
                    Return to Dashboard
                </a>

            </div>

        </body>

        </html>

    `);

});


// ===========================================
// GLOBAL ERROR HANDLER
// ===========================================

app.use(
    (err, req, res, next) => {

        console.error("");
        console.error(
            "===================================================="
        );

        console.error(
            "                 SERVER ERROR"
        );

        console.error(
            "===================================================="
        );

        console.error(
            "URL:",
            req.originalUrl
        );

        console.error(
            "METHOD:",
            req.method
        );

        console.error(
            "ERROR MESSAGE:",
            err.message
        );

        console.error(
            "ERROR CODE:",
            err.code
        );

        console.error(
            "SQL STATE:",
            err.sqlState
        );

        console.error(
            "FULL ERROR:",
            err
        );

        console.error(
            "===================================================="
        );

        console.error("");

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }
);


// ===========================================
// START SERVER
// ===========================================

async function startServer() {

    try {

        // ===================================
        // Connect Database
        // ===================================

        await connectDatabase();


        // ===================================
        // Start Express
        // ===================================

        app.listen(
            PORT,
            () => {

                console.log("");

                console.log(
                    "===================================================="
                );

                console.log(
                    "       M-PESA RENT WALLET ENTERPRISE"
                );

                console.log(
                    "                VERSION 11.5"
                );

                console.log(
                    "===================================================="
                );

                console.log(
                    `Server     : http://localhost:${PORT}`
                );

                console.log(
                    "Database   : MySQL Connected"
                );

                console.log(
                    "Environment:",
                    process.env.NODE_ENV ||
                    "development"
                );

                console.log(
                    "Status     : Ready"
                );

                console.log(
                    "===================================================="
                );

                console.log("");

            }
        );

    }

    catch (error) {

        console.error("");

        console.error(
            "FAILED TO START SERVER"
        );

        console.error("");

        console.error(
            error
        );

        console.error("");

        process.exit(1);

    }

}


// ===========================================
// Launch
// ===========================================

startServer();