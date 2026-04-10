// Dashboard service for personalized user and administrative views
const dashboardRepository = require('../repositories/dashboardRepository');

// Get personalized dashboard data for authenticated user
async function getUserDashboard(userId) {
  return dashboardRepository.getUserDashboard(userId);
}

// Get manager-specific dashboard with team and project oversight
async function getManagerDashboard(managerId) {
  return dashboardRepository.getManagerDashboard(managerId);
}

// Get administrative dashboard with system-wide statistics
async function getAdminDashboard() {
  return dashboardRepository.getAdminDashboard();
}

// Get personal dashboard for individual user statistics
async function getUserPersonalDashboard(userId) {
  return dashboardRepository.getUserPersonalDashboard(userId);
}

// Export dashboard service functions
module.exports = {
  getUserDashboard,
  getManagerDashboard,
  getAdminDashboard,
  getUserPersonalDashboard
};

