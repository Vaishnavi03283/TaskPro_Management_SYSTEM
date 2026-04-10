// Comment controller for task discussion and collaboration features
const commentService = require('../services/commentService');

// Create new comment on specific task
async function createComment(req, res, next) {
  try {
    const comment = await commentService.createComment({
      task_id: req.body.task_id,
      user_id: req.user.id,
      comment_text: req.body.comment_text
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

// Retrieve all comments for a specific task
async function getCommentsByTask(req, res, next) {
  try {
    const comments = await commentService.getCommentsByTask(req.params.taskId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

// Export comment controller functions
module.exports = {
  createComment,
  getCommentsByTask
};

