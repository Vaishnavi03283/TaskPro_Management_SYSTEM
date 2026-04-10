// Administrative routes for user management and system analytics
const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Initialize Express router for admin endpoints
const router = express.Router();

// Get all users with search and role filtering (Admin only)
router.get(
  '/users',
  authenticateJWT,
  authorizeRoles('Admin'),
  adminController.getUsers
);

// Update user role (Admin only)
router.put(
  '/user-role',
  authenticateJWT,
  authorizeRoles('Admin'),
  adminController.updateUserRole
);

// Delete user account (Admin only)
router.delete(
  '/users/:id',
  authenticateJWT,
  authorizeRoles('Admin'),
  adminController.deleteUser
);

// Get dashboard statistics (Admin only)
router.get(
  '/dashboard/stats',
  authenticateJWT,
  authorizeRoles('Admin'),
  adminController.getDashboardStats
);

// Get system usage analytics (Admin only)
router.get(
  '/system/usage',
  authenticateJWT,
  authorizeRoles('Admin'),
  adminController.getSystemUsage
);

// Export admin routes
module.exports = router;
