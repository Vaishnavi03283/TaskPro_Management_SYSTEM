// Authentication routes for user registration and login endpoints
const express = require('express');
const authController = require('../controllers/authController');

// Initialize Express router for authentication endpoints
const router = express.Router();

// Register new user account
router.post('/register', authController.register);
// Authenticate user and return JWT token
router.post('/login', authController.login);

// Export authentication routes
module.exports = router;

