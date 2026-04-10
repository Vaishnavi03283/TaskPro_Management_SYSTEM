// Dashboard routes for personalized user and administrative views
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Initialize Express router for dashboard endpoints
const router = express.Router();

// Get personalized user dashboard (All authenticated roles)
router.get(
  '/user',
  authenticateJWT,
  authorizeRoles('User', 'Manager', 'Admin'),
  dashboardController.getUserDashboard
);

// Get role-based manager dashboard (Authenticated users)
router.get(
  '/manager',
  authenticateJWT,
  dashboardController.getManagerDashboard
);

// Export dashboard routes
module.exports = router;

