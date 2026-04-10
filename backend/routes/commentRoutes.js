// Comment routes for task discussion and collaboration features
const express = require('express');
const commentController = require('../controllers/commentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Initialize Express router for comment endpoints
const router = express.Router();

// Create new comment on task (Authenticated users)
router.post('/', authenticateJWT, commentController.createComment);
// Get all comments for specific task (Authenticated users)
router.get('/:taskId', authenticateJWT, commentController.getCommentsByTask);

// Export comment routes
module.exports = router;

