const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint to create a new user account.
router.post('/register', authController.register);

// Endpoint to authenticate a user and receive a JWT.
router.post('/login', authController.login);

module.exports = router;
