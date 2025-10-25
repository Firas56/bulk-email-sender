const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Middleware function to check for a valid JWT
const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header is present and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the secret key from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach the user object (excluding the password hash) to the request
            req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
            req.userId = decoded.id; 
            next();

        } catch (error) {
            console.error('Token verification failed:', error.message);
            // If verification fails, respond with 401
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    // If no token is found in the header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

module.exports = protect;
