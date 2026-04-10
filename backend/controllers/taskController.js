// Task management controller for CRUD operations with role-based access
const taskService = require('../services/taskService');

// Create new task with validation and authorization
async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

// Get all tasks accessible to current user based on role
async function getTasks(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const tasks = await taskService.getTasks(userId, userRole);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

// Get specific task details with authorization check
async function getTaskById(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const task = await taskService.getTaskById(req.params.id, userId, userRole);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

// Update task details with role-based authorization
async function updateTask(req, res, next) {
  try {
    const userRole = req.user?.role;
    const task = await taskService.updateTask(req.params.id, req.body, userRole);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

// Delete task with authorization and cleanup
async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Export task controller functions
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};

