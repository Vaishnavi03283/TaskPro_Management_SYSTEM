// Comment repository for task discussion and collaboration data
const pool = require('../config/db');
const Comment = require('../models/Comment');

// Create new comment with user association and task linking
async function createComment({ task_id, user_id, comment_text }) {
  const insertResult = await pool.query(
    `INSERT INTO comments (task_id, user_id, comment_text)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [task_id, user_id, comment_text]
  );

  const commentId = insertResult.rows[0]?.id;

  const result = await pool.query(
    `SELECT c.*,
            u.name as user_name,
            u.email as user_email
     FROM comments c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [commentId]
  );

  return new Comment(result.rows[0]);
}

// Retrieve all comments for specific task with user details
async function getCommentsByTask(taskId) {
  const result = await pool.query(
    `SELECT c.*,
            u.name as user_name,
            u.email as user_email
     FROM comments c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.task_id = $1
     ORDER BY c.created_at ASC`,
    [taskId]
  );
  return result.rows.map((row) => new Comment(row));
}

// Export comment repository functions
module.exports = {
  createComment,
  getCommentsByTask
};

