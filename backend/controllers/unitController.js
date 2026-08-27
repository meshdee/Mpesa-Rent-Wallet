// ===========================================
// M-PESA Rent Wallet
// Unit Controller
// Version 11.4 Enterprise
// ===========================================

"use strict";

const db = require("../database/connection");

const { v4: uuidv4 } = require("uuid");

// ===========================================
// Create Unit
// ===========================================

exports.createUnit = async (req, res) => {

    console.log("===========================================");
    console.log("UNIT CREATION REQUEST");
    console.log("Request Body:", req.body);
    console.log("===========================================");

    try {

        const pool = await db();

        const {
            landlordId,
            propertyId,
            unitNumber,
            bedrooms,
            monthlyRent
        } = req.body;

        // ===================================
        // Validate Required Fields
        // ===================================

        if (
            !landlordId ||
            !propertyId ||
            !unitNumber ||
            monthlyRent === undefined ||
            monthlyRent === null
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Landlord, property, unit number and monthly rent are required."

            });

        }

        // ===================================
        // Verify Property Belongs To Landlord
        // ===================================

        const [propertyRows] = await pool.execute(

            `SELECT
                id,
                propertyName,
                landlordId
             FROM properties
             WHERE id = ?
             AND landlordId = ?`,

            [
                propertyId,
                landlordId
            ]

        );

        if (propertyRows.length === 0) {

            console.warn(
                "Property does not belong to landlord."
            );

            return res.status(403).json({

                success: false,

                message:
                    "You cannot create a unit under this property."

            });

        }

        // ===================================
        // Check Duplicate Unit Number
        // ===================================

        const [existingUnits] = await pool.execute(

            `SELECT
                id
             FROM units
             WHERE propertyId = ?
             AND unitNumber = ?`,

            [
                propertyId,
                unitNumber.trim()
            ]

        );

        if (existingUnits.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "This unit number already exists for this property."

            });

        }

        // ===================================
        // Create Unit
        // ===================================

        const id = uuidv4();

        await pool.execute(

            `INSERT INTO units
            (
                id,
                propertyId,
                unitNumber,
                bedrooms,
                monthlyRent,
                status
            )
            VALUES (?,?,?,?,?,'VACANT')`,

            [

                id,

                propertyId,

                unitNumber.trim(),

                Number(bedrooms || 1),

                Number(monthlyRent)

            ]

        );

        console.log(
            "✅ Unit created:",
            id
        );

        res.status(201).json({

            success: true,

            message:
                "Unit created successfully.",

            unitId: id

        });

    }

    catch (error) {

        console.error(
            "Create Unit Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not create unit."

        });

    }

};

// ===========================================
// Get Units For Current Landlord
// ===========================================

exports.getUnits = async (req, res) => {

    console.log("===========================================");
    console.log("LOAD LANDLORD UNITS");
    console.log("===========================================");

    try {

        const pool = await db();

        const { landlordId } = req.params;

        console.log(
            "Landlord ID:",
            landlordId
        );

        // ===================================
        // Validate Landlord ID
        // ===================================

        if (!landlordId) {

            return res.status(400).json({

                success: false,

                message:
                    "Landlord ID is required."

            });

        }

        // ===================================
        // Load Only This Landlord's Units
        // ===================================

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

             INNER JOIN properties p

                ON u.propertyId = p.id

             WHERE p.landlordId = ?

             ORDER BY

                p.propertyName ASC,

                u.unitNumber ASC`,

            [landlordId]

        );

        console.log(
            "Units Found:",
            rows.length
        );

        res.json({

            success: true,

            units: rows

        });

    }

    catch (error) {

        console.error(
            "Get Units Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not load units."

        });

    }

};

// ===========================================
// Get Available Units
// ===========================================

exports.getAvailableUnits = async (req, res) => {

    console.log("===========================================");
    console.log("LOAD AVAILABLE UNITS");
    console.log("===========================================");

    try {

        const pool = await db();

        const { propertyId } = req.params;

        console.log(
            "Property ID:",
            propertyId
        );

        if (!propertyId) {

            return res.status(400).json({

                success: false,

                message:
                    "Property ID is required."

            });

        }

        // ===================================
        // Verify Property Exists
        // ===================================

        const [propertyRows] = await pool.execute(

            `SELECT id
             FROM properties
             WHERE id = ?`,

            [propertyId]

        );

        if (propertyRows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Property does not exist."

            });

        }

        // ===================================
        // Get Vacant Units
        // ===================================

        const [rows] = await pool.execute(

            `SELECT

                id,

                unitNumber,

                bedrooms,

                monthlyRent

             FROM units

             WHERE propertyId = ?

             AND status = 'VACANT'

             ORDER BY unitNumber ASC`,

            [propertyId]

        );

        console.log(
            "Available Units Found:",
            rows.length
        );

        res.json({

            success: true,

            units: rows

        });

    }

    catch (error) {

        console.error(
            "Get Available Units Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not load available units."

        });

    }

};

// ===========================================
// Delete Unit
// ===========================================

exports.deleteUnit = async (req, res) => {

    console.log("===========================================");
    console.log("DELETE UNIT REQUEST");
    console.log("===========================================");

    try {

        const pool = await db();

        const { id } = req.params;

        console.log(
            "Unit ID:",
            id
        );

        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "Unit ID is required."

            });

        }

        // ===================================
        // Check Unit Exists
        // ===================================

        const [unitRows] = await pool.execute(

            `SELECT

                u.id,

                u.status,

                p.propertyName

             FROM units u

             INNER JOIN properties p

                ON u.propertyId = p.id

             WHERE u.id = ?`,

            [id]

        );

        if (unitRows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Unit does not exist."

            });

        }

        // ===================================
        // Prevent Deleting Occupied Unit
        // ===================================

        if (
            unitRows[0].status === "OCCUPIED"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Occupied units cannot be deleted."

            });

        }

        // ===================================
        // Delete Unit
        // ===================================

        await pool.execute(

            `DELETE FROM units
             WHERE id = ?`,

            [id]

        );

        console.log(
            "✅ Unit deleted:",
            id
        );

        res.json({

            success: true,

            message:
                "Unit deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete Unit Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Could not delete unit."

        });

    }

};

// ===========================================
// Controller Loaded
// ===========================================

console.log(
    "✅ Unit Controller Version 11.4 Enterprise Loaded"
);