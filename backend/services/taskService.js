// Task management service with role-based access control and permissions
const taskRepository = require('../repositories/taskRepository');
const pool = require('../config/db');

// Create new task with default status and user assignment
async function createTask(data) {
  const taskData = {
    ...data,
    assigned_user: data.assigned_user_id, 
    status: data.status || 'Pending'
  };
  return taskRepository.createTask(taskData);
}

// Get tasks based on user role with appropriate access permissions
async function getTasks(userId, userRole) {
  const role = String(userRole || '');
  
  if (role === "User") {
    // Users can see: 
    // 1. Tasks assigned to them
    // 2. Tasks from projects they are members of
    return taskRepository.getTasksByProjectMember(userId);
  }
  
  if (role === "Manager") {
    // Managers can see tasks from their own projects only
    return taskRepository.getTasksByManager(userId);
  }
  
  if (role === "Admin") {
    // Admins can see all tasks
    return taskRepository.getTasks();
  }
  
  // Default: no access
  return [];
}

// Get specific task with role-based access validation
async function getTaskById(id, userId, userRole) {
  const task = await taskRepository.getTaskById(id);
  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  
  const role = String(userRole || '');
  
  // Check access permissions
  if (role === "User") {
    // Users can access task if:
    // 1. Task is assigned to them
    // 2. They are member of the project
    const hasAccess = await checkUserTaskAccess(userId, id);
    if (!hasAccess) {
      const err = new Error('Access denied: You do not have permission to view this task');
      err.status = 403;
      throw err;
    }
  } else if (role === "Manager") {
    // Managers can access task if they created the project
    const hasAccess = await checkManagerTaskAccess(userId, id);
    if (!hasAccess) {
      const err = new Error('Access denied: You do not have permission to view this task');
      err.status = 403;
      throw err;
    }
  }
  // Admins can access all tasks
  
  return task;
}

// Check if user has access to specific task
async function checkUserTaskAccess(userId, taskId) {
  const result = await pool.query(
    `SELECT 1 FROM tasks t 
     WHERE t.id = $1 AND (
       t.assigned_user = $2 OR 
       t.project_id IN (
         SELECT project_id FROM project_members WHERE user_id = $2
       )
     )`,
    [taskId, userId]
  );
  return result.rows.length > 0;
}

// Check if manager has access to specific task
async function checkManagerTaskAccess(managerId, taskId) {
  const result = await pool.query(
    `SELECT 1 FROM tasks t
     JOIN projects p ON t.project_id = p.id
     WHERE t.id = $1 AND p.created_by = $2`,
    [taskId, managerId]
  );
  return result.rows.length > 0;
}

// Update task with role-based authorization validation
async function updateTask(id, data, userRole) {
  const role = String(userRole || ''); 
  if (Object.prototype.hasOwnProperty.call(data, 'status')) {
    if (role !== 'User') {
      const err = new Error('Only team members can update task status');
      err.status = 403;
      throw err;
    }
  }

   if (!['User', 'Manager', 'Admin'].includes(role)) {
    const err = new Error('You do not have permission to update tasks');
    err.status = 403;
    throw err;
  }
  
  const task = await taskRepository.updateTask(id, data);
  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  return task;
}

// Delete task with authorization and cleanup
async function deleteTask(id) {
  await taskRepository.deleteTask(id);
}

// Export task service functions
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};

