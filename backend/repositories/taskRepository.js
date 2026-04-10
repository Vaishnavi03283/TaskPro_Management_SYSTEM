// Task repository for database operations and task data management
const pool = require('../config/db');
const Task = require('../models/Task');

// Create new task record in database with project association
async function createTask({
  title,
  description,
  priority,
  status,
  due_date,
  assigned_user,
  project_id
}) {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, priority, status, due_date, assigned_user, project_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [title, description, priority, status, due_date, assigned_user, project_id]
  );
  return new Task(result.rows[0]);
}

// Retrieve all tasks with user and project information
async function getTasks() {
  const result = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     ORDER BY t.due_date ASC NULLS LAST`
  );
  return result.rows.map((row) => new Task(row));
}

// Get specific task by ID with user and project details
async function getTaskById(id) {
  const result = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.id = $1`,
    [id]
  );
  if (!result.rows[0]) return null;
  return new Task(result.rows[0]);
}

// Update task record dynamically with field validation
async function updateTask(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  // Dynamically construct the SET clause
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  const result = await pool.query(
    `UPDATE tasks
     SET ${setClause}
     WHERE id = $${keys.length + 1}
     RETURNING *`,
    [...values, id]
  );

  if (!result.rows[0]) return null;

  // Fetch the updated task with joins
  const taskWithData = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.id = $1`,
    [id]
  );

  return new Task(taskWithData.rows[0]);
}

// Delete task record from database
async function deleteTask(id) {
  await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
}

// Get tasks assigned to specific user
async function getTasksByUser(userId) {
  const result = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.assigned_user = $1`,
    [userId]
  );
  return result.rows.map((row) => new Task(row));
}

// Get all tasks belonging to specific project
async function getTasksByProject(projectId) {
  const result = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.project_id = $1`,
    [projectId]
  );
  return result.rows.map((row) => new Task(row));
}

// Get tasks accessible to project member (assigned or project tasks)
async function getTasksByProjectMember(userId) {
  const result = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE t.project_id IN (
       SELECT project_id FROM project_members WHERE user_id = $1
     ) OR t.assigned_user = $1
     ORDER BY t.due_date ASC NULLS LAST`,
    [userId]
  );
  return result.rows.map((row) => new Task(row));
}

// Get tasks from projects managed by specific manager
async function getTasksByManager(managerId) {
  const result = await pool.query(
    `SELECT t.*,
            u.name as assigned_user_name,
            p.name as project_name
     FROM tasks t
     LEFT JOIN users u ON t.assigned_user = u.id
     LEFT JOIN projects p ON t.project_id = p.id
     WHERE p.created_by = $1
     ORDER BY t.due_date ASC NULLS LAST`,
    [managerId]
  );
  return result.rows.map((row) => new Task(row));
}

// Export task repository functions
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUser,
  getTasksByProject,
  getTasksByProjectMember,
  getTasksByManager
};

