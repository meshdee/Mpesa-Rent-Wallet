const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const generatePropertyCode = require("./utils/propertyCode");
const propertyController = require("./controllers/propertyController");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const ROOT_DIR = path.join(__dirname, "..");

app.use(express.json());
app.use(express.static(ROOT_DIR));

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 3306),
  dateStrings: true
};

const DB_NAME = process.env.DB_NAME || "mpesa_rent_wallet";

let pool = null;

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    createdAt: user.createdAt
  };
}

function createDefaultWallet() {
  return {
    rentGoal: 25000,
    dueDate: "",
    walletBalance: 0,
    transactions: []
  };
}

async function initDatabase() {
  const adminConnection = await mysql.createConnection(DB_CONFIG);

  await adminConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci`
  );

  await adminConnection.end();

  pool = mysql.createPool({
    ...DB_CONFIG,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) NOT NULL,
      fullName VARCHAR(150) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      email VARCHAR(150) NOT NULL,
      passwordHash VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_phone (phone),
      UNIQUE KEY unique_email (email)
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallets (
      userId CHAR(36) NOT NULL,
      rentGoal INT NOT NULL DEFAULT 25000,
      dueDate DATE NULL,
      walletBalance INT NOT NULL DEFAULT 0,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId),
      CONSTRAINT fk_wallet_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id CHAR(36) NOT NULL,
      userId CHAR(36) NOT NULL,
      amount INT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_transactions_userId (userId),
      CONSTRAINT fk_transaction_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);
}

async function getUserByLoginId(loginId) {
  const normalized = String(loginId).trim();
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE phone = ? OR email = ? LIMIT 1",
    [normalized, normalized.toLowerCase()]
  );
  return rows[0] || null;
}

async function getUserById(userId) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);
  return rows[0] || null;
}

async function getWalletByUserId(userId) {
  const [walletRows] = await pool.query(
    "SELECT * FROM wallets WHERE userId = ? LIMIT 1",
    [userId]
  );

  const walletRow = walletRows[0] || null;
  if (!walletRow) {
    const defaultWallet = createDefaultWallet();
    await pool.query(
      "INSERT INTO wallets (userId, rentGoal, dueDate, walletBalance) VALUES (?, ?, ?, ?)",
      [userId, defaultWallet.rentGoal, null, defaultWallet.walletBalance]
    );
  }

  const [freshWalletRows] = await pool.query(
    "SELECT * FROM wallets WHERE userId = ? LIMIT 1",
    [userId]
  );

  const [transactionRows] = await pool.query(
    "SELECT id, amount, createdAt FROM transactions WHERE userId = ? ORDER BY createdAt DESC",
    [userId]
  );

  const freshWallet = freshWalletRows[0];
  return {
    rentGoal: Number(freshWallet.rentGoal),
    dueDate: freshWallet.dueDate ? String(freshWallet.dueDate).slice(0, 10) : "",
    walletBalance: Number(freshWallet.walletBalance),
    transactions: transactionRows.map((tx) => ({
      id: tx.id,
      amount: Number(tx.amount),
      timestamp: tx.createdAt
    }))
  };
}

async function resetWalletByUserId(userId) {
  const defaultWallet = createDefaultWallet();

  await pool.query("DELETE FROM transactions WHERE userId = ?", [userId]);

  await pool.query(
    `UPDATE wallets
     SET rentGoal = ?, dueDate = ?, walletBalance = ?
     WHERE userId = ?`,
    [defaultWallet.rentGoal, null, defaultWallet.walletBalance, userId]
  );
}

app.get("/api/wallet/:userId", async (req, res) => {
  res.sendFile(path.join(ROOT_DIR, "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "M-PESA Rent Wallet API is running"
  });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All registration fields are required."
      });
    }

    const normalizedPhone = String(phone).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const [existingRows] = await pool.query(
      "SELECT id FROM users WHERE phone = ? OR email = ? LIMIT 1",
      [normalizedPhone, normalizedEmail]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A user with that phone number or email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const userId = randomUUID();

    await pool.query(
      `INSERT INTO users (id, fullName, phone, email, passwordHash)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, String(fullName).trim(), normalizedPhone, normalizedEmail, passwordHash]
    );

    const defaultWallet = createDefaultWallet();

    await pool.query(
      `INSERT INTO wallets (userId, rentGoal, dueDate, walletBalance)
       VALUES (?, ?, ?, ?)`,
      [userId, defaultWallet.rentGoal, null, defaultWallet.walletBalance]
    );

    const user = await getUserById(userId);
    const wallet = await getWalletByUserId(userId);

    return res.json({
      success: true,
      user: sanitizeUser(user),
      wallet
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration."
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Login ID and password are required."
      });
    }

    const user = await getUserByLoginId(loginId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No tenant account found."
      });
    }

    const passwordMatch = await bcrypt.compare(String(password), user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid login details."
      });
    }

    const wallet = await getWalletByUserId(user.id);

    return res.json({
      success: true,
      user: sanitizeUser(user),
      wallet
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
});
app.get("/api/wallet/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const wallet = await getWalletByUserId(userId);

    return res.json({
      success: true,
      wallet
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load wallet."
    });
  }
});

// ===========================================
// GET WALLET TRANSACTION HISTORY
// ===========================================

app.get(
    "/api/wallet/:userId/transactions",
    async (req, res) => {

        const { userId } = req.params;

        console.log("-------------------------------------------");
        console.log("LOADING WALLET TRANSACTION HISTORY");
        console.log("User ID:", userId);
        console.log("-------------------------------------------");

        try {

            const [transactions] =
                await pool.query(
                    `SELECT
                        id,
                        userId,
                        amount,
                        createdAt
                     FROM transactions
                     WHERE userId = ?
                     ORDER BY createdAt DESC`,
                    [userId]
                );


            console.log(
                "Transactions found:",
                transactions.length
            );


            res.json({

                success: true,

                transactions

            });

        }

        catch (error) {

            console.error(
                "Transaction History Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load transaction history."

            });

        }

    }
);

/* ===========================================================
   PROPERTY MANAGEMENT ROUTES (Version 9.0)
=========================================================== */

app.post("/api/properties", propertyController.createProperty);

app.get("/api/properties", propertyController.getProperties);

app.put("/api/wallet/:userId/settings", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rentGoal, dueDate } = req.body;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const newGoal = Number(rentGoal);
    if (!Number.isFinite(newGoal) || newGoal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid rent goal."
      });
    }

    await pool.query(
      `UPDATE wallets
       SET rentGoal = ?, dueDate = ?
       WHERE userId = ?`,
      [Math.round(newGoal), dueDate || null, userId]
    );

    const wallet = await getWalletByUserId(userId);

    return res.json({
      success: true,
      wallet
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update wallet settings."
    });
  }
});

app.post("/api/wallet/:userId/deposit", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const user = await getUserById(userId);
    if (!user) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount."
      });
    }

    await connection.beginTransaction();

    const [walletRows] = await connection.query(
      "SELECT * FROM wallets WHERE userId = ? FOR UPDATE",
      [userId]
    );

    const walletRow = walletRows[0];
    if (!walletRow) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Wallet not found."
      });
    }

    const rentGoal = Number(walletRow.rentGoal);
    const walletBalance = Number(walletRow.walletBalance);
    const remaining = rentGoal - walletBalance;
    const savedAmount = Math.min(Math.round(numericAmount), remaining);

    if (savedAmount <= 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        message: "Your wallet has already reached the rent goal."
      });
    }

    const newBalance = walletBalance + savedAmount;

    await connection.query(
      "UPDATE wallets SET walletBalance = ? WHERE userId = ?",
      [newBalance, userId]
    );

    await connection.query(
      "INSERT INTO transactions (id, userId, amount) VALUES (?, ?, ?)",
      [randomUUID(), userId, savedAmount]
    );

    await connection.commit();

    const wallet = await getWalletByUserId(userId);

    connection.release();

    return res.json({
      success: true,
      wallet,
      savedAmount
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {}
    connection.release();

    console.error("Deposit error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not save rent."
    });
  }
});

app.delete("/api/wallet/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    await resetWalletByUserId(userId);
    const wallet = await getWalletByUserId(userId);

    return res.json({
      success: true,
      wallet
    });
  } catch (error) {
    console.error("Reset wallet error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reset wallet."
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully."
  });
});
app.post("/api/landlord/register", async (req, res) => {
  try {
    const { userId, nationalId, phone } = req.body;

    if (!userId || !nationalId || !phone) {
      return res.status(400).json({
        success: false,
        message: "All landlord fields are required."
      });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tenant account not found."
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM landlords WHERE userId = ? LIMIT 1",
      [userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This user is already registered as a landlord."
      });
    }

    const landlordId = randomUUID();

    await pool.query(
      `INSERT INTO landlords
      (id, userId, nationalId, phone)
      VALUES (?, ?, ?, ?)`,
      [
        landlordId,
        userId,
        String(nationalId).trim(),
        String(phone).trim()
      ]
    );

    return res.json({
      success: true,
      landlordId,
      message: "Landlord registered successfully."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to register landlord."
    });
  }
});
async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`M-PESA Rent Wallet running at http://localhost:${PORT}`);
      console.log(`Using MySQL database: ${DB_NAME}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();