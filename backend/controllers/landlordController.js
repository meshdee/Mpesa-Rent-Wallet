const db = require("../database/connection");
const { v4: uuidv4 } = require("uuid");

// ===========================================
// Register Landlord
// ===========================================

exports.registerLandlord = async (req, res) => {

    try {

        const pool = await db();

        const {
            userId,
            businessName,
            nationalId,
            phone,
            email
        } = req.body;

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }

        // Check if user is already registered as a landlord

        const [existing] = await pool.execute(

            "SELECT id FROM landlords WHERE userId = ?",

            [userId]

        );

        if (existing.length > 0) {

            return res.status(409).json({

                success: false,

                message: "This user is already registered as a landlord."

            });

        }

        const landlordId = uuidv4();

        await pool.execute(

            `INSERT INTO landlords
            (
                id,
                userId,
                businessName,
                nationalId,
                phone,
                email
            )
            VALUES (?,?,?,?,?,?)`,

            [
                landlordId,
                userId,
                businessName || null,
                nationalId || null,
                phone || null,
                email || null
            ]

        );

        res.status(201).json({

            success: true,

            message: "Landlord registered successfully.",

            landlordId

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not register landlord."

        });

    }

};

// ===========================================
// Get Landlord
// ===========================================

exports.getLandlord = async (req, res) => {

    try {

        const pool = await db();

        const { userId } = req.params;

        const [rows] = await pool.execute(

            `SELECT
                id,
                userId,
                businessName,
                nationalId,
                phone,
                email,
                createdAt
            FROM landlords
            WHERE userId = ?`,

            [userId]

        );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Landlord not found."

            });

        }

        res.json({

            success: true,

            landlord: rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not load landlord."

        });

    }

};