// ===========================================
// M-PESA Rent Wallet
// Version 10.1 Stable
// backend/controllers/authController.js
// ===========================================

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const connectDatabase = require("../database/connection");

// ===========================================
// Register
// ===========================================

exports.register = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { fullName, phone, email, password } = req.body;

        if (!fullName || !phone || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const cleanPhone = phone.trim();

        const cleanEmail = email.trim().toLowerCase();

        const [existing] = await db.execute(

            `SELECT id
             FROM users
             WHERE phone = ?
             OR LOWER(email)=?
             LIMIT 1`,

            [cleanPhone, cleanEmail]

        );

        if (existing.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Phone number or email already registered."

            });

        }

        const passwordHash = await bcrypt.hash(password, 10);

        const id = uuidv4();

        await db.execute(

            `INSERT INTO users
            (
                id,
                fullName,
                phone,
                email,
                passwordHash
            )
            VALUES
            (?,?,?,?,?)`,

            [
                id,
                fullName.trim(),
                cleanPhone,
                cleanEmail,
                passwordHash
            ]

        );

        return res.status(201).json({

            success: true,

            message: "Registration successful.",

            user: {

                id,
                fullName,
                phone: cleanPhone,
                email: cleanEmail

            }

        });

    }

    catch (error) {

        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                success: false,

                message: "Phone number or email already exists."

            });

        }

        return res.status(500).json({

            success: false,

            message: "Registration failed."

        });

    }

};

// ===========================================
// Login
// ===========================================

exports.login = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { login, password } = req.body;

        if (!login || !password) {

            return res.status(400).json({

                success: false,

                message: "Phone/email and password required."

            });

        }

        const credential = login.trim();

        const [rows] = await db.execute(

            `SELECT *
             FROM users
             WHERE phone=?
             OR LOWER(email)=LOWER(?)
             LIMIT 1`,

            [credential, credential]

        );

        if (rows.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Invalid login credentials."

            });

        }

        const user = rows[0];

        const valid = await bcrypt.compare(

            password,

            user.passwordHash

        );

        if (!valid) {

            return res.status(401).json({

                success: false,

                message: "Incorrect password."

            });

        }

        return res.json({

            success: true,

            message: "Login successful.",

            user: {

                id: user.id,

                fullName: user.fullName,

                phone: user.phone,

                email: user.email

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Login failed."

        });

    }

};

// ===========================================
// Get User Profile
// ===========================================

exports.getProfile = async (req, res) => {

    try {

        const db = await connectDatabase();

        const { id } = req.params;

        const [rows] = await db.execute(

            `SELECT
                id,
                fullName,
                phone,
                email
             FROM users
             WHERE id = ?
             LIMIT 1`,

            [id]

        );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.json({

            success: true,

            user: rows[0]

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to load profile."

        });

    }

};

// ===========================================
// Logout
// ===========================================

exports.logout = async (req, res) => {

    return res.json({

        success: true,

        message: "Logout successful."

    });

};