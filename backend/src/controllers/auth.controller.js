import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { pool } from "../db.js";
import { config } from "../config.js";
import { generateUUID } from "../utils/id.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = generateUUID();

    // Generate verification token
    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    // Insert user
    await pool.query(
      `
      INSERT INTO users
      (
        id,
        name,
        email,
        password_hash,
        role,
        verification_token
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'USER',
        $5
      )
      `,
      [
        userId,
        name,
        email,
        passwordHash,
        verificationToken,
      ]
    );

    // Send verification email
    await sendVerificationEmail(
      email,
      verificationToken
    );

    return res.status(201).json({
      message:
        "User registered successfully. Please verify your email.",
    });

  } catch (err) {
    console.error("Register error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE verification_token = $1
      `,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    await pool.query(
      `
      UPDATE users
      SET
        is_verified = true,
        verification_token = NULL
      WHERE verification_token = $1
      `,
      [token]
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/login`
    );

  } catch (err) {
    console.error("Verify email error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // Check verification
    if (!user.is_verified) {
      return res.status(401).json({
        message:
          "Please verify your email before logging in",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });
  }
};