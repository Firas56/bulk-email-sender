const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;


// --- Helper function to generate a JWT ---
const generateToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '24h', // Token expires in 24 hours
    });
};

// 1. User Registration (POST /api/auth/register)
exports.register = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists.' });
        }

        // --- Hashing the Password (Security Critical Step) ---
        const salt = await bcrypt.genSalt(10); // Generates a salt (cost factor 10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        user = await User.create({
            email,
            password: hashedPassword, 
        });

        // Generate a token for the new session
        const token = generateToken(user.id);

        // Send back success response with the token
        res.status(201).json({
            id: user.id,
            email: user.email,
            token: token,
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// 2. User Login (POST /api/auth/login)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials (User not found).' });
        }

        // --- Comparing the Password (Authentication Critical Step) ---
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials (Password mismatch).' });
        }

        // Passwords match! Generate the token for the session.
        const token = generateToken(user.id);

        // Send back success response with the token
        res.status(200).json({
            id: user.id,
            email: user.email,
            token: token,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
