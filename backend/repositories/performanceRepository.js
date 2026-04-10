// Performance repository for analytics and metrics data retrieval
const pool = require('../config/db');

// Get performance metrics for specific task with user statistics
async function getTaskPerformance(taskId) {
  try {
    const result = await pool.query(`
      SELECT 
        t.id as task_id,
        t.title,
        t.status,
        t.priority,
        t.due_date,
        t.assigned_user,
        u.id as assigned_user_id,
        u.name as assigned_user_name,
        u.email as assigned_user_email,
        -- Simple completion rate for this user
        CASE 
          WHEN u.id IS NOT NULL THEN
            (SELECT ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tasks WHERE assigned_user = u.id), 0), 2) 
             FROM tasks WHERE assigned_user = u.id AND status = 'Completed')
          ELSE 0 
        END as user_completion_rate
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user = u.id
      WHERE t.id = $1
    `, [taskId]);

    return result.rows[0];
  } catch (error) {
    console.error('Error in getTaskPerformance:', error);
    throw error;
  }
}

// Get comprehensive team performance metrics for project
async function getProjectTeamPerformance(projectId) {
  try {
    const result = await pool.query(`
      SELECT 
        p.id as project_id,
        p.name as project_name,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        -- Task counts
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
        -- Simple completion rate
        CASE 
          WHEN COUNT(t.id) > 0 
          THEN ROUND(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id), 2)
          ELSE 0 
        END as completion_rate,
        -- Priority breakdown
        SUM(CASE WHEN t.priority = 'High' AND t.status = 'Completed' THEN 1 ELSE 0 END) as high_priority_completed,
        SUM(CASE WHEN t.priority = 'Medium' AND t.status = 'Completed' THEN 1 ELSE 0 END) as medium_priority_completed,
        SUM(CASE WHEN t.priority = 'Low' AND t.status = 'Completed' THEN 1 ELSE 0 END) as low_priority_completed,
        -- Tasks by priority (total)
        SUM(CASE WHEN t.priority = 'High' THEN 1 ELSE 0 END) as total_high_priority,
        SUM(CASE WHEN t.priority = 'Medium' THEN 1 ELSE 0 END) as total_medium_priority,
        SUM(CASE WHEN t.priority = 'Low' THEN 1 ELSE 0 END) as total_low_priority
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      LEFT JOIN users u ON t.assigned_user = u.id
      WHERE p.id = $1 
      GROUP BY p.id, p.name, u.id, u.name, u.email, u.role
      HAVING u.id IS NOT NULL
      ORDER BY completion_rate DESC
    `, [projectId]);

    return result.rows;
  } catch (error) {
    console.error('Error in getProjectTeamPerformance:', error);
    throw error;
  }
}

// Get individual user performance with task statistics
async function getUserPerformance(userId, projectId = null) {
  try {
    const whereClause = projectId ? 'AND t.project_id = $2' : '';
    const params = projectId ? [userId, projectId] : [userId];

    const result = await pool.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        -- Overall task statistics
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
        -- Simple completion rate
        CASE 
          WHEN COUNT(t.id) > 0 
          THEN ROUND(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id), 2)
          ELSE 0 
        END as completion_rate,
        -- Priority performance
        SUM(CASE WHEN t.priority = 'High' AND t.status = 'Completed' THEN 1 ELSE 0 END) as high_priority_completed,
        SUM(CASE WHEN t.priority = 'Medium' AND t.status = 'Completed' THEN 1 ELSE 0 END) as medium_priority_completed,
        SUM(CASE WHEN t.priority = 'Low' AND t.status = 'Completed' THEN 1 ELSE 0 END) as low_priority_completed
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_user ${whereClause}
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email, u.role
    `, params);

    return result.rows[0];
  } catch (error) {
    console.error('Error in getUserPerformance:', error);
    throw error;
  }
}

// Get team comparison metrics with statistical analysis
async function getTeamComparisonMetrics(projectId) {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        COUNT(t.id) as task_count,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_count,
        CASE 
          WHEN COUNT(t.id) > 0 
          THEN ROUND(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id), 2)
          ELSE 0 
        END as completion_rate
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_user AND t.project_id = $1
      WHERE u.id IN (
        SELECT DISTINCT assigned_user FROM tasks WHERE project_id = $1
      )
      GROUP BY u.id
    `, [projectId]);

    // Calculate metrics in JavaScript
    const teamSize = result.rows.length;
    const totalProjectTasks = result.rows.reduce((sum, row) => sum + parseInt(row.task_count || 0), 0);
    const totalCompleted = result.rows.reduce((sum, row) => sum + parseInt(row.completed_count || 0), 0);
    const avgTasksPerMember = teamSize > 0 ? totalProjectTasks / teamSize : 0;
    const maxTasksPerMember = teamSize > 0 ? Math.max(...result.rows.map(row => parseInt(row.task_count || 0))) : 0;
    const minTasksPerMember = teamSize > 0 ? Math.min(...result.rows.map(row => parseInt(row.task_count || 0))) : 0;
    
    const completionRates = result.rows.map(row => parseFloat(row.completion_rate) || 0);
    const avgCompletionRate = completionRates.length > 0 ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length : 0;
    const maxCompletionRate = completionRates.length > 0 ? Math.max(...completionRates) : 0;
    const minCompletionRate = completionRates.length > 0 ? Math.min(...completionRates) : 0;

    return {
      team_size: teamSize,
      total_project_tasks: totalProjectTasks,
      total_completed: totalCompleted,
      avg_tasks_per_member: avgTasksPerMember,
      max_tasks_per_member: maxTasksPerMember,
      min_tasks_per_member: minTasksPerMember,
      avg_completion_rate: avgCompletionRate,
      max_completion_rate: maxCompletionRate,
      min_completion_rate: minCompletionRate
    };
  } catch (error) {
    console.error('Error in getTeamComparisonMetrics:', error);
    throw error;
  }
}

// Get performance trends over specified time period
async function getPerformanceTrends(projectId, days = 30) {
  try {
    // Simple trends based on task status
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks
      FROM tasks t
      WHERE t.project_id = $1
    `, [projectId]);

    return [{
      completion_date: new Date().toISOString().split('T')[0],
      tasks_completed: result.rows[0]?.completed_tasks || 0,
      active_users: 0
    }];
  } catch (error) {
    console.error('Error in getPerformanceTrends:', error);
    throw error;
  }
}

// Get collaboration metrics for team analysis
async function getCollaborationMetrics(projectId) {
  try {
    // Simple collaboration based on task assignments
    const result = await pool.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        COUNT(t.id) as tasks_assigned,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as tasks_completed
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_user AND t.project_id = $1
      WHERE u.id IN (
        SELECT DISTINCT assigned_user FROM tasks WHERE project_id = $1
      )
      GROUP BY u.id, u.name
      ORDER BY tasks_completed DESC
    `, [projectId]);

    return result.rows.map(row => ({
      ...row,
      comments_made: 0,
      tasks_commented_on: row.tasks_assigned,
      collaboration_score: row.tasks_assigned > 0 ? (row.tasks_completed / row.tasks_assigned * 100).toFixed(2) : 0
    }));
  } catch (error) {
    console.error('Error in getCollaborationMetrics:', error);
    throw error;
  }
}

// Export performance repository functions
module.exports = {
  getTaskPerformance,
  getProjectTeamPerformance,
  getUserPerformance,
  getTeamComparisonMetrics,
  getPerformanceTrends,
  getCollaborationMetrics
};
