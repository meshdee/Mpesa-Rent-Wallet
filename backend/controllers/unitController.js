const db = require("../database/connection");
const { v4: uuidv4 } = require("uuid");

// ===========================================
// Create Unit
// ===========================================

exports.createUnit = async (req, res) => {

    try {

        const pool = await db();

        const {
            propertyId,
            unitNumber,
            bedrooms,
            monthlyRent
        } = req.body;

        const id = uuidv4();

        await pool.execute(

            `INSERT INTO units
            (
                id,
                propertyId,
                unitNumber,
                bedrooms,
                monthlyRent
            )
            VALUES (?,?,?,?,?)`,

            [
                id,
                propertyId,
                unitNumber,
                bedrooms,
                monthlyRent
            ]

        );

        res.json({

            success: true,

            message: "Unit created successfully."

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Could not create unit."

        });

    }

};

// ===========================================
// Get All Units
// ===========================================

exports.getUnits = async (req, res) => {

    try {

        const pool = await db();

        const [rows] = await pool.execute(

            `SELECT

                u.id,
                u.propertyId,
                u.unitNumber,
                u.bedrooms,
                u.monthlyRent,
                u.status,

                p.propertyName

            FROM units u

            LEFT JOIN properties p

                ON u.propertyId = p.id

            ORDER BY p.propertyName, u.unitNumber`

        );

        res.json(rows);

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Could not load units."

        });

    }

};

// ===========================================
// Get Available Units
// ===========================================

exports.getAvailableUnits = async (req, res) => {

    try {

        const pool = await db();

        const { propertyId } = req.params;

        const [rows] = await pool.execute(

            `SELECT

                id,
                unitNumber

            FROM units

            WHERE propertyId = ?

            AND status = 'VACANT'

            ORDER BY unitNumber`,

            [propertyId]

        );

        res.json(rows);

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Could not load available units."

        });

    }

};

// ===========================================
// Delete Unit
// ===========================================

exports.deleteUnit = async (req, res) => {

    try {

        const pool = await db();

        const { id } = req.params;

        await pool.execute(

            "DELETE FROM units WHERE id = ?",

            [id]

        );

        res.json({

            success:true,

            message:"Unit deleted successfully."

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Could not delete unit."

        });

    }

};