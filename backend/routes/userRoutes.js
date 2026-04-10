// User management routes for retrieving user information
const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Initialize Express router for user endpoints
const router = express.Router();

// Get all users with optional role filtering (Authenticated users)
router.get('/', authenticateJWT, userController.getAllUsers);

// Export user routes
module.exports = router;
