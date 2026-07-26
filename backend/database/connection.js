const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

async function connectDatabase() {
    if (pool) {
        return pool;
    }

    pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "mpesa_rent_wallet",
        port: process.env.DB_PORT || 3306,

        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL connected successfully.");
        connection.release();
    } catch (error) {
        console.error("❌ Unable to connect to MySQL.");
        throw error;
    }

    return pool;
}

module.exports = connectDatabase;