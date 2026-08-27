// ===========================================
// M-PESA Rent Wallet
// Database Connection
// Version 10.1 Stable
// backend/database/connection.js
// ===========================================

"use strict";

const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// ===========================================
// Load .env from PROJECT ROOT
// ===========================================

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

let pool = null;

// ===========================================
// Create Database Connection Pool
// ===========================================

async function connectDatabase() {

    if (pool) {
        return pool;
    }

    try {

        console.log("");
        console.log("====================================");
        console.log("🔌 Connecting to MySQL...");
        console.log("====================================");

        console.log("DB_HOST     :", process.env.DB_HOST);
        console.log("DB_USER     :", process.env.DB_USER);
        console.log("DB_NAME     :", process.env.DB_NAME);
        console.log("DB_PORT     :", process.env.DB_PORT);
        console.log(
            "DB_PASSWORD :",
            process.env.DB_PASSWORD ? "Loaded ✅" : "Missing ❌"
        );

        pool = mysql.createPool({

            host: process.env.DB_HOST || "localhost",

            user: process.env.DB_USER || "root",

            password: process.env.DB_PASSWORD || "",

            database:
                process.env.DB_NAME || "mpesa_rent_wallet",

            port:
                Number(process.env.DB_PORT || 3306),

            waitForConnections: true,

            connectionLimit: 10,

            queueLimit: 0,

            namedPlaceholders: true,

            timezone: "Z"

        });

        const connection =
            await pool.getConnection();

        console.log("");
        console.log("====================================");
        console.log("✅ MySQL Connection Established");
        console.log("Database :", process.env.DB_NAME);
        console.log("Host     :", process.env.DB_HOST);
        console.log("User     :", process.env.DB_USER);
        console.log("====================================");

        connection.release();

        return pool;

    }

    catch (error) {

        console.error("");
        console.error("====================================");
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        console.error("====================================");

        pool = null;

        throw error;

    }

}

// ===========================================
// Close Pool
// ===========================================

async function closeDatabase() {

    if (pool) {

        await pool.end();

        pool = null;

        console.log(
            "Database connection pool closed."
        );

    }

}

// ===========================================
// Export
// ===========================================

module.exports = connectDatabase;

module.exports.closeDatabase =
    closeDatabase;