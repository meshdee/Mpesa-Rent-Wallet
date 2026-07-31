// ===========================================
// M-PESA Rent Wallet
// Version 10.0 Stable
// backend/database/connection.js
// ===========================================

const mysql = require("mysql2/promise");
require("dotenv").config();

let pool = null;

// ===========================================
// Create Database Connection Pool
// ===========================================

async function connectDatabase() {

    if (pool) {

        return pool;

    }

    try {

        pool = mysql.createPool({

            host: process.env.DB_HOST || "localhost",

            user: process.env.DB_USER || "root",

            password: process.env.DB_PASSWORD || "",

            database: process.env.DB_NAME || "mpesa_rent_wallet",

            port: Number(process.env.DB_PORT || 3306),

            waitForConnections: true,

            connectionLimit: 10,

            queueLimit: 0,

            namedPlaceholders: true,

            timezone: "Z"

        });

        const connection = await pool.getConnection();

        console.log("");

        console.log("====================================");

        console.log("✅ MySQL Connection Established");

        console.log("Database :", process.env.DB_NAME);

        console.log("Host     :", process.env.DB_HOST || "localhost");

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

        console.log("Database connection pool closed.");

    }

}

module.exports = connectDatabase;

module.exports.closeDatabase = closeDatabase;