// ===========================================
// M-PESA Rent Wallet
// User Controller
// Version 11.5 Enterprise
// ===========================================

"use strict";

const connectDatabase =
    require("../database/connection");


// ===========================================
// Get User Profile
// ===========================================

exports.getUser = async (req, res) => {

    console.log("===========================================");
    console.log("USER PROFILE REQUEST");
    console.log("===========================================");

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

                message: "User ID is required."

            });

        }


        // ===================================
        // Get User
        // ===================================

        const [rows] =
            await db.execute(

                `SELECT
                    id,
                    fullName,
                    phone,
                    email
                 FROM users
                 WHERE id = ?
                 LIMIT 1`,

                [userId]

            );


        // ===================================
        // User Not Found
        // ===================================

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        const user =
            rows[0];


        console.log(
            "User Found:",
            user.fullName
        );


        // ===================================
        // Return User
        // ===================================

        return res.json({

            success: true,

            user: {

                id: user.id,

                fullName:
                    user.fullName,

                phone:
                    user.phone,

                email:
                    user.email

            }

        });

    }

    catch (error) {

        console.error(
            "USER PROFILE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load user profile."

        });

    }

};