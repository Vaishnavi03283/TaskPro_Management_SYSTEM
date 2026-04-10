// Task model representing individual task items with project association and assignment
class Task {
  // Initialize task with details, priority, status, assignment, and project context
  constructor({
    id,
    title,
    description,
    priority,
    status,
    due_date,
    assigned_user,
    assigned_user_name,
    project_id,
    project_name
  }) {
    this.id = id; // UUID string
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.due_date = due_date;
    this.assigned_user = assigned_user; // UUID string
    this.assigned_user_name = assigned_user_name;
    this.project_id = project_id; // UUID string
    this.project_name = project_name;
  }
}

// Export Task class for use in application
module.exports = Task;

