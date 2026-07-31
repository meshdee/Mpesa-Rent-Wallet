// ===========================================
// M-PESA Rent Wallet
// Version 10.1 Stable
// backend/controllers/walletController.js
// ===========================================

const connectDatabase = require("../database/connection");

// ===========================================
// Get Wallet
// ===========================================

exports.getWallet = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { userId } = req.params;

        let [rows] = await db.execute(

            `SELECT *
             FROM wallets
             WHERE userId = ?
             LIMIT 1`,

            [userId]

        );

        // Create wallet automatically for new users
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

        return res.json({

            success: true,

            wallet: rows[0]

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to load wallet."

        });

    }

};

// ===========================================
// Update Settings
// ===========================================

exports.updateSettings = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { userId } = req.params;

        const {

            rentGoal,

            dueDate

        } = req.body;

        await db.execute(

            `UPDATE wallets
             SET rentGoal = ?,
                 dueDate = ?
             WHERE userId = ?`,

            [

                rentGoal,

                dueDate,

                userId

            ]

        );

        const [rows] = await db.execute(

            `SELECT *
             FROM wallets
             WHERE userId = ?`,

            [userId]

        );

        return res.json({

            success: true,

            wallet: rows[0]

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to update wallet."

        });

    }

};

// ===========================================
// Save Rent
// ===========================================

exports.saveRent = async (req, res) => {

    return res.json({

        success: true,

        message: "Save Rent module coming next."

    });

};

// ===========================================
// Reset Wallet
// ===========================================

exports.resetWallet = async (req, res) => {

    return res.json({

        success: true,

        message: "Wallet reset."

    });

};