// Task management routes for CRUD operations with role-based access
const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Initialize Express router for task endpoints
const router = express.Router();

// Create new task (Manager and Admin only)
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('Manager', 'Admin'),
  taskController.createTask
);
// Get all tasks (Authenticated users)
router.get('/', authenticateJWT, taskController.getTasks);
// Get specific task by ID (Authenticated users)
router.get('/:id', authenticateJWT, taskController.getTaskById);

// Update task status (User role only for status updates)
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('User'),
  taskController.updateTask
);

// Delete task (Manager and Admin only)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('Manager', 'Admin'),
  taskController.deleteTask
);

// Export task routes
module.exports = router;


