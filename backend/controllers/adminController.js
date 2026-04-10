// Administrative operations controller for user management and system statistics
const adminService = require('../services/adminService');

// Retrieve all users with optional search and role filtering
async function getUsers(req, res, next) {
  try {
    const { search, role } = req.query;

    const users = await adminService.getAllUsers({ search, role });

    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Update user role with authorization validation
async function updateUserRole(req, res, next) {
  try {
    const { userId, role } = req.body;

    const user = await adminService.updateUserRole(userId, role);

    res.json(user);
  } catch (err) {
    next(err);
  }
}



// Delete user account with self-deletion prevention
async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;

   
    if (req.user.id == userId) {
      return res.status(400).json({
        message: "You can't delete yourself"
      });
    }

    await adminService.deleteUser(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// Retrieve administrative dashboard statistics
async function getDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

// Get system usage metrics and analytics
async function getSystemUsage(req, res, next) {
  try {
    const usage = await adminService.getSystemUsage();
    res.json(usage);
  } catch (err) {
    next(err);
  }
}


// Export all admin controller functions
module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getSystemUsage
};
