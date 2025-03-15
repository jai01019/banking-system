//routes/auth.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');

// Secret key for JWT (store this in environment variables in production)
const JWT_SECRET='9b71c3abc1f3c096b8cd38f1101b483de014b8049073d9fb53ae8e2d86936de9b086578cd4cacdf8805620ea00129d241822719e77ce4550ef6622223222f331';

// Login Route (already implemented)
router.post('/login', async (req, res) => {
    try {
        console.log("Login api triggered");
        const { email, password, role } = req.body;

        // Log the request body
        console.log("Request body:", { email, password, role });

        // Find user by email and role
        const [rows] = await db.query(
            'SELECT id, name, email, password, role FROM Users WHERE email = ? AND role = ?',
            [email, role]
        );

        // Ensure rows is an array and has at least one element
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Extract the first user from the rows array
        const user = rows[0];

        // Compare passwords
        console.log("Input password:", password);
        console.log("Stored password:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        // Return user data (excluding password) and token
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        res.json({ user: userData, token, message: 'Login successful' });
    } catch (err) {
        console.error("Error in login route:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM Users WHERE email = ? AND role = ?',
            [email, role]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User with this email and role already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await db.query(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        // Generate a JWT token for the newly registered user
        const token = jwt.sign({ userId: result.insertId, role }, JWT_SECRET, { expiresIn: '1h' });

        // Return success response
        res.status(201).json({
            message: 'Signup successful',
            user: { id: result.insertId, name, email, role },
            token,
        });
    } catch (err) {
        console.error("Error in signup route:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;