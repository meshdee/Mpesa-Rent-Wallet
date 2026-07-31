// ===========================================
// M-PESA Rent Wallet
// Version 10.0 Stable
// backend/server.js
// ===========================================

require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDatabase = require("./database/connection");

// =========================
// Routes
// =========================

const authRoutes = require("./routes/authRoutes");
const landlordRoutes = require("./routes/landlordRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const unitRoutes = require("./routes/unitRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const walletRoutes = require("./routes/walletRoutes");

// =========================
// App
// =========================

const app = express();

const PORT = process.env.PORT || 3000;

const ROOT_DIR = path.join(__dirname, "..");

// =========================
// Middleware
// =========================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(ROOT_DIR));

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/landlord", landlordRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/units", unitRoutes);

app.use("/api/tenants", tenantRoutes);

app.use("/api/wallet", walletRoutes);

// =========================
// Frontend Pages
// =========================

app.get("/", (req, res) => {

    res.sendFile(path.join(ROOT_DIR, "index.html"));

});

app.get("/dashboard", (req, res) => {

    res.sendFile(

        path.join(ROOT_DIR, "pages", "dashboard.html")

    );

});

app.get("/properties", (req, res) => {

    res.sendFile(

        path.join(ROOT_DIR, "pages", "properties.html")

    );

});

app.get("/units", (req, res) => {

    res.sendFile(

        path.join(ROOT_DIR, "pages", "units.html")

    );

});

app.get("/tenants", (req, res) => {

    res.sendFile(

        path.join(ROOT_DIR, "pages", "tenants.html")

    );

});

app.get("/landlord", (req, res) => {

    res.sendFile(

        path.join(ROOT_DIR, "pages", "landlord.html")

    );

});

// =========================
// Health Check
// =========================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        application: "M-PESA Rent Wallet",

        version: "10.0 Stable",

        database: "Connected",

        server: "Running"

    });

});

// =========================
// 404 API Handler
// =========================

app.use("/api/*", (req, res) => {

    res.status(404).json({

        success: false,

        message: "API endpoint not found."

    });

});

// =========================
// Global Error Handler
// =========================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: "Internal Server Error"

    });

});

// =========================
// Start Server
// =========================

async function startServer() {

    try {

        await connectDatabase();

        app.listen(PORT, () => {

            console.log("");

            console.log("==============================================");

            console.log("   M-PESA RENT WALLET VERSION 10.0 STABLE");

            console.log("==============================================");

            console.log(`Server : http://localhost:${PORT}`);

            console.log("Database : MySQL Connected");

            console.log("Environment :", process.env.NODE_ENV || "development");

            console.log("==============================================");

        });

    }

    catch (error) {

        console.error("");

        console.error("Failed to start server");

        console.error(error);

        process.exit(1);

    }

}

startServer();