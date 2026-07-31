const db = require("../database/connection");
const { v4: uuidv4 } = require("uuid");

// ===========================================
// Register Tenant
// ===========================================

exports.createTenant = async (req, res) => {
 console.log("================================");
 console.log("Tenant Registration Request");
 console.log(req.body);
 console.log("================================");

    const pool = await db();

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

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

        const id = uuidv4();

        // Get selected unit

        const [unitRows] = await connection.execute(

            `SELECT
                unitNumber,
                status
             FROM units
             WHERE id=?`,

            [unitId]

        );

        if (unitRows.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Selected unit does not exist."

            });

        }

        if (unitRows[0].status === "OCCUPIED") {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Selected unit is already occupied."

            });

        }

        const unitNumber = unitRows[0].unitNumber;

        await connection.execute(

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
                unitNumber,
                monthlyRent
            )
            VALUES (?,?,?,?,?,?,?,?,?,?)`,

            [
                id,
                landlordId || null,
                propertyId,
                unitId,
                fullName,
                nationalId,
                phone,
                email,
                unitNumber,
                monthlyRent
            ]

        );

        await connection.execute(

            `UPDATE units
             SET status='OCCUPIED'
             WHERE id=?`,

            [unitId]

        );

        await connection.commit();

        res.json({

            success: true,

            message: "Tenant registered successfully."

        });

    }

    catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not register tenant."

        });

    }

    finally {

        connection.release();

    }

};

// ===========================================
// Get All Tenants
// ===========================================

exports.getTenants = async (req, res) => {

    try {

        const pool = await db();

        const [rows] = await pool.execute(

            `SELECT

                t.id,
                t.fullName,
                t.phone,
                t.email,
                t.monthlyRent,

                p.propertyName,

                u.unitNumber,
                u.status

            FROM tenants t

            LEFT JOIN properties p

                ON t.propertyId = p.id

            LEFT JOIN units u

                ON t.unitId = u.id

            ORDER BY p.propertyName,
                     u.unitNumber`

        );

        res.json(rows);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not load tenants."

        });

    }

};

// ===========================================
// Delete Tenant
// ===========================================

exports.deleteTenant = async (req, res) => {

    const pool = await db();

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const { id } = req.params;

        const [rows] = await connection.execute(

            `SELECT unitId
             FROM tenants
             WHERE id=?`,

            [id]

        );

        if (rows.length > 0 && rows[0].unitId) {

            await connection.execute(

                `UPDATE units
                 SET status='VACANT'
                 WHERE id=?`,

                [rows[0].unitId]

            );

        }

        await connection.execute(

            "DELETE FROM tenants WHERE id=?",

            [id]

        );

        await connection.commit();

        res.json({

            success: true,

            message: "Tenant deleted successfully."

        });

    }

    catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not delete tenant."

        });

    }

    finally {

        connection.release();

    }

};