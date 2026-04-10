// Comment model representing task discussion and collaboration data
class Comment {
  // Initialize comment with task association and user information
  constructor({ id, task_id, user_id, comment_text, created_at, user_name, user_email }) {
    this.id = id; // UUID string
    this.task_id = task_id; // UUID string
    this.user_id = user_id; // UUID string
    this.comment_text = comment_text;
    this.created_at = created_at;
    this.user_name = user_name;
    this.user_email = user_email;
  }
}

// Export Comment class for use in application
module.exports = Comment;

