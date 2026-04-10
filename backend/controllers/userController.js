// User management controller for retrieving user information
const userRepository = require('../repositories/userRepository');

// Get all users with optional role filtering
async function getAllUsers(req, res, next) {
  try {
    const { role } = req.query;
    
    if (role) {
      // Filter users by specific role
      const allUsers = await userRepository.findAllUsers();
      const filteredUsers = allUsers.filter(user => user.role === role);
      return res.json(filteredUsers);
    }
    
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Export user controller functions
module.exports = {
  getAllUsers
};
