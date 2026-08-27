// ===========================================
// M-PESA Rent Wallet
// Landlord Controller
// Version 11.8 Enterprise
// ===========================================

"use strict";

const connectDatabase =
    require("../database/connection");

const { v4: uuidv4 } =
    require("uuid");

console.log(
    "✅ Landlord Controller Version 11.8 Enterprise Loaded"
);


// ===========================================
// REGISTER LANDLORD
// ===========================================

exports.registerLandlord = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("REGISTER LANDLORD REQUEST");
    console.log("-------------------------------------------");

    try {

        const db =
            await connectDatabase();

        const {
            userId,
            businessName,
            nationalId,
            phone,
            email
        } = req.body;


        console.log("User ID:", userId);


        // ===================================
        // Validate User ID
        // ===================================

        if (!userId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID is required."

            });

        }


        // ===================================
        // Check Existing Landlord
        // ===================================

        const [existingRows] =
            await db.execute(

                `SELECT
                    id,
                    userId,
                    businessName,
                    nationalId,
                    phone,
                    email,
                    createdAt

                 FROM landlords

                 WHERE userId = ?

                 LIMIT 1`,

                [

                    userId

                ]

            );


        if (existingRows.length > 0) {

            console.log(
                "Landlord already exists:",
                existingRows[0].id
            );


            return res.status(409).json({

                success: false,

                message:
                    "This user is already registered as a landlord.",

                landlordId:
                    existingRows[0].id,

                landlord:
                    existingRows[0]

            });

        }


        // ===================================
        // Create Landlord ID
        // ===================================

        const landlordId =
            uuidv4();


        // ===================================
        // Create Landlord
        // ===================================

        await db.execute(

            `INSERT INTO landlords

            (
                id,
                userId,
                businessName,
                nationalId,
                phone,
                email
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`,

            [

                landlordId,
                userId,
                businessName || null,
                nationalId || null,
                phone || null,
                email || null

            ]

        );


        console.log(
            "✅ Landlord created:",
            landlordId
        );


        return res.status(201).json({

            success: true,

            message:
                "Landlord registered successfully.",

            landlordId

        });

    }

    catch (error) {

        console.error(
            "REGISTER LANDLORD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not register landlord."

        });

    }

};


// ===========================================
// GET LANDLORD BY USER ID
// ===========================================

exports.getLandlord = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("GET LANDLORD REQUEST");
    console.log("-------------------------------------------");

    try {

        const db =
            await connectDatabase();

        const { userId } =
            req.params;


        // ===================================
        // Validate User ID
        // ===================================

        if (!userId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID is required."

            });

        }


        console.log(
            "User ID:",
            userId
        );


        // ===================================
        // Get Landlord
        // ===================================

        const [rows] =
            await db.execute(

                `SELECT

                    id,
                    userId,
                    businessName,
                    nationalId,
                    phone,
                    email,
                    createdAt

                 FROM landlords

                 WHERE userId = ?

                 LIMIT 1`,

                [

                    userId

                ]

            );


        // ===================================
        // Not Found
        // ===================================

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Landlord not found."

            });

        }


        const landlord =
            rows[0];


        console.log(
            "Landlord Found:",
            landlord.id
        );


        // ===================================
        // Return Landlord
        // ===================================

        return res.json({

            success: true,

            landlord

        });

    }

    catch (error) {

        console.error(
            "GET LANDLORD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not load landlord."

        });

    }

};


// ===========================================
// UPDATE LANDLORD
// ===========================================

exports.updateLandlord = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("UPDATE LANDLORD REQUEST");
    console.log("-------------------------------------------");

    try {

        const db =
            await connectDatabase();

        const { userId } =
            req.params;


        const {

            businessName,
            nationalId,
            phone,
            email

        } = req.body;


        // ===================================
        // Validate User ID
        // ===================================

        if (!userId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID is required."

            });

        }


        // ===================================
        // Verify Landlord
        // ===================================

        const [existingRows] =
            await db.execute(

                `SELECT id

                 FROM landlords

                 WHERE userId = ?

                 LIMIT 1`,

                [

                    userId

                ]

            );


        if (existingRows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Landlord not found."

            });

        }


        // ===================================
        // Update
        // ===================================

        await db.execute(

            `UPDATE landlords

             SET

                businessName = ?,
                nationalId = ?,
                phone = ?,
                email = ?

             WHERE userId = ?`,

            [

                businessName || null,
                nationalId || null,
                phone || null,
                email || null,
                userId

            ]

        );


        // ===================================
        // Return Updated Landlord
        // ===================================

        const [rows] =
            await db.execute(

                `SELECT

                    id,
                    userId,
                    businessName,
                    nationalId,
                    phone,
                    email,
                    createdAt

                 FROM landlords

                 WHERE userId = ?

                 LIMIT 1`,

                [

                    userId

                ]

            );


        console.log(
            "✅ Landlord updated:",
            rows[0].id
        );


        return res.json({

            success: true,

            message:
                "Landlord information updated successfully.",

            landlord:
                rows[0]

        });

    }

    catch (error) {

        console.error(
            "UPDATE LANDLORD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not update landlord."

        });

    }

};


// ===========================================
// GET LANDLORD STATISTICS
// ===========================================

exports.getLandlordStatistics = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("GET LANDLORD STATISTICS");
    console.log("-------------------------------------------");

    try {

        const db =
            await connectDatabase();

        const { landlordId } =
            req.params;


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


        console.log(
            "Landlord ID:",
            landlordId
        );


        // ===================================
        // Properties
        // ===================================

        const [propertyRows] =
            await db.execute(

                `SELECT COUNT(*) AS total

                 FROM properties

                 WHERE landlordId = ?`,

                [

                    landlordId

                ]

            );


        // ===================================
        // Units
        // ===================================

        const [unitRows] =
            await db.execute(

                `SELECT

                    COUNT(*) AS total,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'OCCUPIED'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS occupied,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN status = 'VACANT'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS vacant

                 FROM units u

                 INNER JOIN properties p
                    ON u.propertyId = p.id

                 WHERE p.landlordId = ?`,

                [

                    landlordId

                ]

            );


        // ===================================
        // Tenants
        // ===================================

        const [tenantRows] =
            await db.execute(

                `SELECT

                    COUNT(*) AS total,

                    COALESCE(
                        SUM(monthlyRent),
                        0
                    ) AS monthlyRent

                 FROM tenants

                 WHERE landlordId = ?`,

                [

                    landlordId

                ]

            );


        const statistics = {

            properties:
                Number(
                    propertyRows[0].total
                ),

            units:
                Number(
                    unitRows[0].total
                ),

            occupiedUnits:
                Number(
                    unitRows[0].occupied
                ),

            vacantUnits:
                Number(
                    unitRows[0].vacant
                ),

            tenants:
                Number(
                    tenantRows[0].total
                ),

            monthlyRent:
                Number(
                    tenantRows[0].monthlyRent
                )

        };


        console.log(
            "Landlord Statistics:",
            statistics
        );


        return res.json({

            success: true,

            statistics

        });

    }

    catch (error) {

        console.error(
            "GET LANDLORD STATISTICS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not load landlord statistics."

        });

    }

};