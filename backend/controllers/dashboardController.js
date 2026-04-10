// Dashboard controller for personalized user and administrative views
const dashboardService = require('../services/dashboardService');

// Get personalized dashboard data for authenticated user
async function getUserDashboard(req, res, next) {
  try {
    const data = await dashboardService.getUserDashboard(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Get role-based dashboard data (admin, manager, or user)
async function getManagerDashboard(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = String(req.user?.role || '').toLowerCase();
    
    let data;
    if (userRole === 'admin') {
      data = await dashboardService.getAdminDashboard();
    } else if (userRole === 'manager') {
      data = await dashboardService.getManagerDashboard(userId);
    } else {
      // For regular users, show their personal statistics
      data = await dashboardService.getUserPersonalDashboard(userId);
    }
    
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Export dashboard controller functions
module.exports = {
  getUserDashboard,
  getManagerDashboard
};

