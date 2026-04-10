// Project management routes for CRUD operations and member management
const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Initialize Express router for project endpoints
const router = express.Router();

// Create new project (Manager and Admin only)
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('Manager', 'Admin'),
  projectController.createProject
);
// Get all projects (Authenticated users)
router.get('/', authenticateJWT, projectController.getProjects);
// Get specific project by ID (Authenticated users)
router.get('/:id', authenticateJWT, projectController.getProjectById);
// Update project details (Authenticated users with authorization)
router.put(
  '/:id',
  authenticateJWT,
  projectController.updateProject
);
// Delete project (Authenticated users with authorization)
router.delete(
  '/:id',
  authenticateJWT,
  projectController.deleteProject
);

// Project Member Management Routes
// Add member to project (Authenticated users with authorization)
router.post(
  '/:projectId/members',
  authenticateJWT,
  projectController.addProjectMember
);
// Remove member from project (Authenticated users with authorization)
router.delete(
  '/:projectId/members/:userId',
  authenticateJWT,
  projectController.removeProjectMember
);
// Get all project members (Authenticated users)
router.get(
  '/:projectId/members',
  authenticateJWT,
  projectController.getProjectMembers
);
// Get all projects with member details (Authenticated users)
router.get(
  '/with-members',
  authenticateJWT,
  projectController.getProjectsWithMembers
);

// Export project routes
module.exports = router;

