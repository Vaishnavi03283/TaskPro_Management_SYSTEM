// Dashboard repository for analytics and statistics data retrieval
const pool = require('../config/db');

// Get global system statistics for admin dashboard
const getGlobalStats = async () => {
  const [projectCountsResult, taskCountsResult] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS total_projects FROM projects`),

    pool.query(`
      SELECT 
        COUNT(*)::int AS total_tasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)::int AS completed_tasks,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END)::int AS pending_tasks,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END)::int AS in_progress_tasks
      FROM tasks
    `)
  ]);

  const projectRow = projectCountsResult.rows[0] || {};
  const taskRow = taskCountsResult.rows[0] || {};

  return {
    totalProjects: projectRow.total_projects || 0,
    totalTasks: taskRow.total_tasks || 0,
    completedTasks: taskRow.completed_tasks || 0,
    pendingTasks: taskRow.pending_tasks || 0,
    inProgressTasks: taskRow.in_progress_tasks || 0
  };
};

// Get personalized dashboard data for authenticated user
async function getUserDashboard(userId) {
  const [taskCountsResult] = await Promise.all([
    pool.query(
      `SELECT 
          COUNT(*)::int AS total_tasks,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)::int AS completed_tasks,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END)::int AS pending_tasks,
          SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END)::int AS in_progress_tasks
       FROM tasks
       WHERE assigned_user = $1`,
      [userId]
    )
  ]);

  const row = taskCountsResult.rows[0] || {};

  return {
    totalTasks: row.total_tasks || 0,
    completedTasks: row.completed_tasks || 0,
    pendingTasks: row.pending_tasks || 0,
    inProgressTasks: row.in_progress_tasks || 0
  };
}

// Get manager-specific dashboard with team and project oversight
async function getManagerDashboard(managerId) {
  try {
    const [managerStats, projectStats, recentTasks] = await Promise.all([
      getManagerStats(managerId),
      getProjectProgressStats(managerId),
      getRecentTasksForManager(managerId)
    ]);

    return {
      ...managerStats,
      projectStats,
      recentTasks
    };
  } catch (error) {
    console.error('Error in getManagerDashboard:', error);
    return {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      projectStats: [],
      recentTasks: []
    };
  }
}

// Get personal dashboard for individual user statistics
async function getUserPersonalDashboard(userId) {
  try {
    // Get only assigned tasks
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks
      FROM tasks 
      WHERE assigned_user = $1
    `, [userId]);

    const row = result.rows[0] || {};

    return {
      totalTasks: parseInt(row.total_tasks) || 0,
      completedTasks: parseInt(row.completed_tasks) || 0,
      pendingTasks: parseInt(row.pending_tasks) || 0,
      inProgressTasks: parseInt(row.in_progress_tasks) || 0
    };
  } catch (error) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0
    };
  }
}

// Get statistics for projects managed by specific manager
async function getManagerStats(managerId) {
  try {
    // Simple approach - get projects first
    const projectsResult = await pool.query(
      'SELECT COUNT(*) as total_projects FROM projects WHERE created_by = $1', 
      [managerId]
    );
    
    const totalProjects = parseInt(projectsResult.rows[0]?.total_projects) || 0;
    
    // If no projects, return zeros
    if (totalProjects === 0) {
      return {
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0
      };
    }
    
    // Get tasks from manager's projects
    const tasksResult = await pool.query(
      'SELECT COUNT(*) as total_tasks FROM tasks t JOIN projects p ON t.project_id = p.id WHERE p.created_by = $1',
      [managerId]
    );
    
    const totalTasks = parseInt(tasksResult.rows[0]?.total_tasks) || 0;
    
    // Get task counts by status
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.created_by = $1
      GROUP BY status
    `, [managerId]);
    
    let completedTasks = 0;
    let pendingTasks = 0;
    let inProgressTasks = 0;
    
    statusResult.rows.forEach(row => {
      const count = parseInt(row.count) || 0;
      switch(row.status) {
        case 'Completed':
          completedTasks = count;
          break;
        case 'Pending':
          pendingTasks = count;
          break;
        case 'In Progress':
          inProgressTasks = count;
          break;
      }
    });
    
    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks
    };
  } catch (error) {
    console.error('Error in getManagerStats:', error);
    return {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0
    };
  }
}

// Get comprehensive admin dashboard with system-wide statistics
async function getAdminDashboard() {
  const [globalStats, userStats, projectStats] = await Promise.all([
    getGlobalStats(),
    getUserStats(),
    getProjectProgressStats()
  ]);

  return {
    ...globalStats,
    userStats,
    projectStats
  };
}

// Get project progress statistics with optional manager filter
async function getProjectProgressStats(managerId = null) {
  let query = `
    SELECT 
      p.id AS project_id,
      p.name AS project_name,
      p.status AS project_status,
      COUNT(t.id)::int AS total_tasks,
      SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END)::int AS completed_tasks,
      SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END)::int AS pending_tasks,
      SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END)::int AS in_progress_tasks,
      CASE 
        WHEN COUNT(t.id) = 0 THEN 0
        ELSE ROUND((SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id)), 2)
      END AS completion_percentage
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
  `;
  
  const params = [];
  if (managerId) {
    query += ` WHERE p.created_by = $1`;
    params.push(managerId);
  }
  
  query += ` GROUP BY p.id, p.name, p.status ORDER BY p.created_at DESC LIMIT 10`;
  
  const result = await pool.query(query, params);
  return result.rows;
}

// Get user statistics by role distribution
async function getUserStats() {
  const result = await pool.query(`
    SELECT 
      COUNT(*)::int AS total_users,
      SUM(CASE WHEN role = 'Admin' THEN 1 ELSE 0 END)::int AS admin_users,
      SUM(CASE WHEN role = 'Manager' THEN 1 ELSE 0 END)::int AS manager_users,
      SUM(CASE WHEN role = 'User' THEN 1 ELSE 0 END)::int AS regular_users
    FROM users
  `);
  
  return result.rows[0] || {};
}

// Get recent tasks for manager dashboard
async function getRecentTasksForManager(managerId) {
  const result = await pool.query(`
    SELECT 
      t.id,
      t.title,
      t.status,
      t.priority,
      t.due_date,
      p.name AS project_name,
      u.name AS assigned_user_name
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_user = u.id
    WHERE p.created_by = $1
    ORDER BY t.id DESC
    LIMIT 5
  `, [managerId]);
  
  return result.rows;
}

// Export dashboard repository functions
module.exports = {
  getUserDashboard,
  getManagerDashboard,
  getAdminDashboard,
  getProjectProgressStats,
  getUserStats,
  getRecentTasksForManager,
  getManagerStats,
  getUserPersonalDashboard
};

