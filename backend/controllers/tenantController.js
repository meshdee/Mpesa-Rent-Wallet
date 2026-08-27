// ===========================================
// M-PESA Rent Wallet
// Tenant Controller
// Version 11.8 Enterprise
// ===========================================

"use strict";

const connectDatabase =
    require("../database/connection");

const { v4: uuidv4 } =
    require("uuid");

console.log(
    "✅ Tenant Controller Version 11.8 Enterprise Loaded"
);


// ===========================================
// CREATE TENANT
// ===========================================

exports.createTenant = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("CREATE TENANT REQUEST");
    console.log("-------------------------------------------");

    let db;

    try {

        db = await connectDatabase();

        const {

            landlordId,
            propertyId,
            unitId,
            fullName,
            nationalId,
            phone,
            email,
            monthlyRent

        } = req.body;


        console.log("Landlord ID:", landlordId);
        console.log("Property ID:", propertyId);
        console.log("Unit ID:", unitId);
        console.log("Tenant Name:", fullName);


        // ===================================
        // REQUIRED FIELDS
        // ===================================

        if (

            !landlordId ||
            !propertyId ||
            !unitId ||
            !fullName ||
            !phone ||
            !monthlyRent

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide all required tenant information."

            });

        }


        // ===================================
        // VERIFY PROPERTY OWNERSHIP
        // ===================================

        const [propertyRows] =
            await db.execute(

                `SELECT
                    id,
                    landlordId,
                    propertyName
                 FROM properties
                 WHERE id = ?
                 AND landlordId = ?
                 LIMIT 1`,

                [

                    propertyId,
                    landlordId

                ]

            );


        if (propertyRows.length === 0) {

            return res.status(403).json({

                success: false,

                message:
                    "The selected property does not belong to this landlord account."

            });

        }


        // ===================================
        // VERIFY UNIT OWNERSHIP
        // ===================================

        const [unitRows] =
            await db.execute(

                `SELECT

                    u.id,
                    u.propertyId,
                    u.unitNumber,
                    u.status

                 FROM units u

                 INNER JOIN properties p
                    ON u.propertyId = p.id

                 WHERE u.id = ?
                 AND u.propertyId = ?
                 AND p.landlordId = ?

                 LIMIT 1`,

                [

                    unitId,
                    propertyId,
                    landlordId

                ]

            );


        if (unitRows.length === 0) {

            return res.status(403).json({

                success: false,

                message:
                    "The selected unit does not belong to the selected property."

            });

        }


        const unit =
            unitRows[0];


        // ===================================
        // CHECK UNIT AVAILABILITY
        // ===================================

        if (

            unit.status &&
            unit.status.toUpperCase() !== "VACANT"

        ) {

            return res.status(409).json({

                success: false,

                message:
                    "The selected unit is no longer available."

            });

        }


        // ===================================
        // CHECK DUPLICATE NATIONAL ID
        // ===================================

        if (nationalId) {

            const [existingIdRows] =
                await db.execute(

                    `SELECT id
                     FROM tenants
                     WHERE nationalId = ?
                     LIMIT 1`,

                    [

                        nationalId

                    ]

                );


            if (existingIdRows.length > 0) {

                return res.status(409).json({

                    success: false,

                    message:
                        "A tenant with this National ID already exists."

                });

            }

        }


        // ===================================
        // CHECK DUPLICATE PHONE
        // ===================================

        const [existingPhoneRows] =
            await db.execute(

                `SELECT id
                 FROM tenants
                 WHERE phone = ?
                 LIMIT 1`,

                [

                    phone

                ]

            );


        if (existingPhoneRows.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "A tenant with this phone number already exists."

            });

        }


        // ===================================
        // GENERATE TENANT ID
        // ===================================

        const tenantId =
            uuidv4();


        // ===================================
        // CREATE TENANT
        // ===================================

        await db.execute(

            `INSERT INTO tenants
            (
                id,
                landlordId,
                propertyId,
                unitId,
                fullName,
                nationalId,
                phone,
                email,
                monthlyRent
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`,

            [

                tenantId,
                landlordId,
                propertyId,
                unitId,
                fullName,
                nationalId || null,
                phone,
                email || null,
                Number(monthlyRent)

            ]

        );


        // ===================================
        // MARK UNIT OCCUPIED
        // ===================================

        await db.execute(

            `UPDATE units
             SET status = 'OCCUPIED'
             WHERE id = ?
             AND propertyId = ?`,

            [

                unitId,
                propertyId

            ]

        );


        // ===================================
        // SUCCESS
        // ===================================

        console.log(
            "✅ Tenant created successfully:",
            tenantId
        );


        return res.status(201).json({

            success: true,

            message:
                "Tenant registered successfully.",

            tenant: {

                id: tenantId,

                landlordId,

                propertyId,

                unitId,

                fullName,

                nationalId:
                    nationalId || null,

                phone,

                email:
                    email || null,

                monthlyRent:
                    Number(monthlyRent)

            }

        });

    }

    catch (error) {

        console.error(
            "CREATE TENANT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not register tenant."

        });

    }

};


// ===========================================
// GET TENANTS FOR CURRENT LANDLORD
// ===========================================

exports.getTenants = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("LOAD LANDLORD TENANTS");
    console.log("-------------------------------------------");

    try {

        const db =
            await connectDatabase();


        const { landlordId } =
            req.params;


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
        // GET TENANTS
        // ===================================

        const [rows] =
            await db.execute(

                `SELECT

                    t.id,

                    t.landlordId,

                    t.propertyId,

                    t.unitId,

                    t.fullName,

                    t.nationalId,

                    t.phone,

                    t.email,

                    t.monthlyRent,

                    t.createdAt,

                    p.propertyName,

                    u.unitNumber

                 FROM tenants t

                 INNER JOIN properties p
                    ON t.propertyId = p.id

                 INNER JOIN units u
                    ON t.unitId = u.id

                 WHERE t.landlordId = ?

                 ORDER BY

                    p.propertyName,
                    u.unitNumber,
                    t.fullName`,

                [

                    landlordId

                ]

            );


        console.log(
            "Tenants Found:",
            rows.length
        );


        return res.json({

            success: true,

            tenants: rows

        });

    }

    catch (error) {

        console.error(
            "GET TENANTS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not load tenants."

        });

    }

};


// ===========================================
// DELETE TENANT
// ===========================================

exports.deleteTenant = async (req, res) => {

    console.log("-------------------------------------------");
    console.log("DELETE TENANT");
    console.log("-------------------------------------------");

    try {

        const db =
            await connectDatabase();


        const { id } =
            req.params;


        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "Tenant ID is required."

            });

        }


        // ===================================
        // FIND TENANT
        // ===================================

        const [tenantRows] =
            await db.execute(

                `SELECT

                    id,
                    landlordId,
                    propertyId,
                    unitId

                 FROM tenants

                 WHERE id = ?

                 LIMIT 1`,

                [

                    id

                ]

            );


        if (tenantRows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Tenant not found."

            });

        }


        const tenant =
            tenantRows[0];


        // ===================================
        // DELETE TENANT
        // ===================================

        await db.execute(

            `DELETE FROM tenants
             WHERE id = ?`,

            [

                id

            ]

        );


        // ===================================
        // RETURN UNIT TO VACANT
        // ===================================

        await db.execute(

            `UPDATE units

             SET status = 'VACANT'

             WHERE id = ?

             AND propertyId = ?`,

            [

                tenant.unitId,
                tenant.propertyId

            ]

        );


        console.log(
            "✅ Tenant deleted:",
            id
        );


        return res.json({

            success: true,

            message:
                "Tenant deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "DELETE TENANT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Could not delete tenant."

        });

    }

};