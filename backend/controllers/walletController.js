// ===========================================
// M-PESA Rent Wallet
// Wallet Controller
// Version 11.7 Enterprise
// ===========================================

"use strict";

const connectDatabase = require("../database/connection");

const crypto =
    require("crypto");

console.log("✅ Wallet Controller Version 11.7 Enterprise Loaded");

// ===========================================
// Helper: Get or Create Wallet
// ===========================================

async function getOrCreateWallet(db, userId) {

    let [rows] = await db.execute(

        `SELECT *
         FROM wallets
         WHERE userId = ?
         LIMIT 1`,

        [userId]

    );

    if (rows.length === 0) {

        await db.execute(

            `INSERT INTO wallets
            (
                id,
                userId,
                rentGoal,
                savedAmount,
                dueDate
            )
            VALUES
            (
                UUID(),
                ?,
                0,
                0,
                NULL
            )`,

            [userId]

        );

        [rows] = await db.execute(

            `SELECT *
             FROM wallets
             WHERE userId = ?
             LIMIT 1`,

            [userId]

        );

    }

    return rows[0];

}

// ===========================================
// Get Wallet
// ===========================================

exports.getWallet = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { userId } = req.params;

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        const wallet = await getOrCreateWallet(

            db,

            userId

        );

        return res.json({

            success: true,

            wallet

        });

    }

    catch (error) {

        console.error("================================");

        console.error("GET WALLET ERROR");

        console.error(error);

        console.error("================================");

        return res.status(500).json({

            success: false,

            message: "Unable to load wallet."

        });

    }

};

// ===========================================
// Update Wallet Settings
// ===========================================

exports.updateSettings = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { userId } = req.params;

        const {

            rentGoal,

            dueDate

        } = req.body;

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        const numericRentGoal = Number(rentGoal);

        if (

            !Number.isFinite(numericRentGoal) ||

            numericRentGoal < 0

        ) {

            return res.status(400).json({

                success: false,

                message: "Please enter a valid monthly rent goal."

            });

        }

        // Make sure wallet exists

        await getOrCreateWallet(

            db,

            userId

        );

        await db.execute(

            `UPDATE wallets
             SET
                rentGoal = ?,
                dueDate = ?
             WHERE userId = ?`,

            [

                numericRentGoal,

                dueDate || null,

                userId

            ]

        );

        const [rows] = await db.execute(

            `SELECT *
             FROM wallets
             WHERE userId = ?
             LIMIT 1`,

            [userId]

        );

        return res.json({

            success: true,

            message: "Wallet settings updated successfully.",

            wallet: rows[0]

        });

    }

    catch (error) {

        console.error("================================");

        console.error("UPDATE WALLET SETTINGS ERROR");

        console.error(error);

        console.error("================================");

        return res.status(500).json({

            success: false,

            message: "Unable to update wallet settings."

        });

    }

};

// ===========================================
// Save Rent
// ===========================================

exports.saveRent = async (req, res) => {

    const db =
        await connectDatabase();

    const connection =
        await db.getConnection();

    try {

        const { userId } =
            req.params;

        const { amount } =
            req.body;


        // ===========================================
        // Validate User
        // ===========================================

        if (!userId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID is required."

            });

        }


        // ===========================================
        // Validate Amount
        // ===========================================

        const numericAmount =
            Number(amount);

        if (

            !Number.isFinite(
                numericAmount
            ) ||

            numericAmount <= 0

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid amount to save."

            });

        }


        // ===========================================
        // Begin Database Transaction
        // ===========================================

        await connection.beginTransaction();


        // ===========================================
        // Get Wallet
        // ===========================================

        let [walletRows] =
            await connection.execute(

                `SELECT *
                 FROM wallets
                 WHERE userId = ?
                 LIMIT 1
                 FOR UPDATE`,

                [userId]

            );


        // ===========================================
        // Create Wallet If It Does Not Exist
        // ===========================================

        if (walletRows.length === 0) {

            await connection.execute(

                `INSERT INTO wallets
                (
                    id,
                    userId,
                    tenantId,
                    rentGoal,
                    savedAmount,
                    dueDate
                )
                VALUES
                (
                    UUID(),
                    ?,
                    NULL,
                    0,
                    0,
                    NULL
                )`,

                [userId]

            );


            [walletRows] =
                await connection.execute(

                    `SELECT *
                     FROM wallets
                     WHERE userId = ?
                     LIMIT 1
                     FOR UPDATE`,

                    [userId]

                );

        }


        const wallet =
            walletRows[0];


        // ===========================================
        // Current Saved Amount
        // ===========================================

        const currentSaved =
            Number(
                wallet.savedAmount
            ) || 0;


        const newSavedAmount =
            currentSaved +
            numericAmount;


        // ===========================================
        // Receipt V2 Relationship Data
        // ===========================================

        const tenantId =
            wallet.tenantId || null;


        let propertyId =
            null;

        let unitId =
            null;


        if (tenantId) {

            const [tenantRows] =
                await connection.execute(

                    `SELECT
                        propertyId,
                        unitId
                     FROM tenants
                     WHERE id = ?
                     LIMIT 1`,

                    [tenantId]

                );


            if (
                tenantRows.length > 0
            ) {

                propertyId =
                    tenantRows[0]
                        .propertyId || null;


                unitId =
                    tenantRows[0]
                        .unitId || null;

            }

        }


        // ===========================================
        // Update Wallet Balance
        // ===========================================

        await connection.execute(

            `UPDATE wallets
             SET savedAmount = ?
             WHERE userId = ?`,

            [

                newSavedAmount,

                userId

            ]

        );


        // ===========================================
        // Create Receipt V2 Transaction
        // ===========================================

        const transactionId =
            crypto.randomUUID();


        await connection.execute(

            `INSERT INTO transactions
            (
                id,
                userId,
                amount,
                tenantId,
                propertyId,
                unitId,
                rentPeriodStart,
                rentPeriodEnd,
                paymentMethod
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                DATE_FORMAT(
                    CURDATE(),
                    '%Y-%m-01'
                ),
                LAST_DAY(
                    CURDATE()
                ),
                ?
            )`,

            [

                transactionId,

                userId,

                numericAmount,

                tenantId,

                propertyId,

                unitId,

                "M-PESA"

            ]

        );


        // ===========================================
        // Get Updated Wallet
        // ===========================================

        const [updatedRows] =
            await connection.execute(

                `SELECT *
                 FROM wallets
                 WHERE userId = ?
                 LIMIT 1`,

                [userId]

            );


        // ===========================================
        // Commit Everything
        // ===========================================

        await connection.commit();


        // ===========================================
        // Success Response
        // ===========================================

        return res.json({

            success: true,

            message:
                "Rent saved successfully.",

            wallet:
                updatedRows[0],

            transaction: {

                id:
                    transactionId,

                amount:
                    numericAmount,

                tenantId,

                propertyId,

                unitId,

                paymentMethod:
                    "M-PESA"

            }

        });

    }


    catch (error) {

        // ===========================================
        // Rollback
        // ===========================================

        await connection.rollback();


        console.error(
            "================================"
        );

        console.error(
            "SAVE RENT ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to save rent."

        });

    }


    finally {

        connection.release();

    }

};

// ===========================================
// Reset Wallet
// ===========================================

exports.resetWallet = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { userId } = req.params;

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        // Make sure wallet exists

        await getOrCreateWallet(

            db,

            userId

        );

        await db.execute(

            `UPDATE wallets
             SET
                rentGoal = 0,
                savedAmount = 0,
                dueDate = NULL
             WHERE userId = ?`,

            [userId]

        );

        const [rows] = await db.execute(

            `SELECT *
             FROM wallets
             WHERE userId = ?
             LIMIT 1`,

            [userId]

        );

        return res.json({

            success: true,

            message: "Wallet reset successfully.",

            wallet: rows[0]

        });

    }

    catch (error) {

        console.error("================================");

        console.error("RESET WALLET ERROR");

        console.error(error);

        console.error("================================");

        return res.status(500).json({

            success: false,

            message: "Unable to reset wallet."

        });

    }

};

// ===========================================
// Get Transaction History
// ===========================================

exports.getTransactions = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { userId } = req.params;


        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }


        const [transactions] =
            await db.execute(

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


        return res.json({

            success: true,

            transactions

        });

    }

    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "GET TRANSACTION HISTORY ERROR"
        );

        console.error(error);

        console.error(
            "================================"
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load transaction history."

        });

    }

};

// ===========================================
// Get Single Transaction
// ===========================================

exports.getTransaction = async (req, res) => {

    try {

        const db = await connectDatabase();

        const {
            userId,
            transactionId
        } = req.params;


        if (!userId || !transactionId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID and transaction ID are required."

            });

        }


        const [rows] =
            await db.execute(

                `SELECT
                    id,
                    userId,
                    amount,
                    createdAt
                 FROM transactions
                 WHERE id = ?
                 AND userId = ?
                 LIMIT 1`,

                [
                    transactionId,
                    userId
                ]

            );


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Transaction not found."

            });

        }


        return res.json({

            success: true,

            transaction: rows[0]

        });

    }

    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "GET SINGLE TRANSACTION ERROR"
        );

        console.error(error);

        console.error(
            "================================"
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load transaction."

        });

    }

};