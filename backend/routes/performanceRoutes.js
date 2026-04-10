// Performance analytics routes for task and project metrics
const express = require('express');
const performanceController = require('../controllers/performanceController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Initialize Express router for performance endpoints
const router = express.Router();

// Get task-specific performance metrics (Authenticated users with access)
router.get(
  '/task/:taskId',
  authenticateJWT,
  performanceController.getTaskPerformance
);

// Get project team performance metrics (Authenticated users with access)
router.get(
  '/project/:projectId',
  authenticateJWT,
  performanceController.getProjectTeamPerformance
);

// Get individual user performance metrics (Authenticated users with access)
router.get(
  '/user/:userId',
  authenticateJWT,
  performanceController.getUserPerformance
);

// Get team comparison metrics (Authenticated users with access)
router.get(
  '/team/:projectId',
  authenticateJWT,
  performanceController.getTeamComparisonMetrics
);

// Get performance trends over time (Authenticated users with access)
router.get(
  '/trends/:projectId',
  authenticateJWT,
  performanceController.getPerformanceTrends
);

// Get collaboration metrics (Authenticated users with access)
router.get(
  '/collaboration/:projectId',
  authenticateJWT,
  performanceController.getCollaborationMetrics
);

// Export performance routes
module.exports = router;
