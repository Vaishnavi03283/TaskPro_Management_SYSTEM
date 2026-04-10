// Authentication controller for user registration and login operations
const authService = require('../services/authService');

// Register new user account with validation
async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// Authenticate user and return access token
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Export authentication controller functions
module.exports = {
  register,
  login
};

