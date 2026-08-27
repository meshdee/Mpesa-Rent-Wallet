const db = require("../database/connection");
const { v4: uuidv4 } = require("uuid");

// ===========================================
// Generate Property Code
// ===========================================

function generatePropertyCode() {

    const random = Math.floor(1000 + Math.random() * 9000);

    return `PR-${random}`;

}

// ===========================================
// Create Property
// ===========================================

exports.createProperty = async (req, res) => {

    try {

        const pool = await db();

        const {

            landlordId,
            propertyName,
            location,
            units,
            monthlyRent

        } = req.body;

        if (
            !landlordId ||
            !propertyName ||
            !location
        ) {

            return res.status(400).json({

                success: false,

                message: "Please complete all required fields."

            });

        }

        // Prevent duplicate property names
        const [existing] = await pool.execute(

            `SELECT id
             FROM properties
             WHERE landlordId = ?
             AND propertyName = ?`,

            [

                landlordId,
                propertyName

            ]

        );

        if (existing.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Property already exists."

            });

        }

        const id = uuidv4();

        const propertyCode = generatePropertyCode();

        await pool.execute(

            `INSERT INTO properties
            (
                id,
                landlordId,
                propertyCode,
                propertyName,
                location,
                units,
                monthlyRent
            )
            VALUES (?,?,?,?,?,?,?)`,

            [

                id,
                landlordId,
                propertyCode,
                propertyName,
                location,
                units,
                monthlyRent

            ]

        );

        res.status(201).json({

            success: true,

            message: "Property created successfully.",

            propertyId: id,

            propertyCode

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not create property."

        });

    }

};

// ===========================================
// Get Properties
// ===========================================
exports.getProperties = async (req, res) => {

    try {

        const pool = await db();

        const { landlordId } = req.params;

        const [rows] = await pool.execute(

            `SELECT
                id,
                landlordId,
                propertyCode,
                propertyName,
                location,
                units,
                monthlyRent,
                createdAt
            FROM properties
            WHERE landlordId = ?
            ORDER BY createdAt DESC`,

            [landlordId]

        );

        res.json({

            success: true,

            properties: rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not load properties."

        });

    }

};

// ===========================================
// Delete Property
// ===========================================

exports.deleteProperty = async (req, res) => {

    try {

        const pool = await db();

        const { id } = req.params;

        await pool.execute(

            "DELETE FROM properties WHERE id = ?",

            [id]

        );

        res.json({

            success: true,

            message: "Property deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not delete property."

        });

    }

};