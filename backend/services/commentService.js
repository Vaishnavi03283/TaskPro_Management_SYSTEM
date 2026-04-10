// Comment service for task discussion and collaboration features
const commentRepository = require('../repositories/commentRepository');

// Create new comment on specific task with user association
async function createComment({ task_id, user_id, comment_text }) {
  return commentRepository.createComment({ task_id, user_id, comment_text });
}

// Retrieve all comments for a specific task
async function getCommentsByTask(taskId) {
  return commentRepository.getCommentsByTask(taskId);
}

// Export comment service functions
module.exports = {
  createComment,
  getCommentsByTask
};

