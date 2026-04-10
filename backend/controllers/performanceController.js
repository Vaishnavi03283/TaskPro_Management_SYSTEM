// Performance analytics controller for task and project metrics
const performanceService = require('../services/performanceService');
const projectRepository = require('../repositories/projectRepository');
const taskRepository = require('../repositories/taskRepository');

// Get performance metrics for specific task with authorization
async function getTaskPerformance(req, res, next) {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Check if user is task creator, project creator, or admin
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await projectRepository.getProjectById(task.project_id);
    const isTaskCreator = task.created_by === userId;
    const isProjectCreator = project.created_by === userId;
    const isAdmin = userRole === 'Admin';

    if (!isTaskCreator && !isProjectCreator && !isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied: Only task creator, project creator, or admin can view task performance' 
      });
    }

    const performance = await performanceService.getTaskPerformance(taskId);
    res.json(performance);
  } catch (err) {
    next(err);
  }
}

// Get team performance metrics for project with authorization
async function getProjectTeamPerformance(req, res, next) {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Check if user is project creator or admin
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isProjectCreator = project.created_by === userId;
    const isAdmin = userRole === 'Admin';

    if (!isProjectCreator && !isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied: Only project creator or admin can view team performance' 
      });
    }

    const performance = await performanceService.getProjectTeamPerformance(projectId);
    res.json(performance);
  } catch (err) {
    next(err);
  }
}

// Get individual user performance with access control
async function getUserPerformance(req, res, next) {
  try {
    const { userId } = req.params;
    const { projectId } = req.query;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    // Users can only view their own performance
    // Admins can view any user's performance
    // Project creators can view performance of their project members
    if (currentUserId !== parseInt(userId) && currentUserRole !== 'Admin') {
      if (projectId) {
        const project = await projectRepository.getProjectById(projectId);
        const isProjectCreator = project.created_by === currentUserId;
        
        if (!isProjectCreator) {
          return res.status(403).json({ 
            message: 'Access denied: You can only view your own performance or project members\' performance' 
          });
        }
      } else {
        return res.status(403).json({ 
          message: 'Access denied: You can only view your own performance' 
        });
      }
    }

    const performance = await performanceService.getUserPerformance(userId, projectId);
    res.json(performance);
  } catch (err) {
    next(err);
  }
}

// Get team comparison metrics for project analysis
async function getTeamComparisonMetrics(req, res, next) {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Only project creators and admins can view team comparison
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isProjectCreator = project.created_by === userId;
    const isAdmin = userRole === 'Admin';

    if (!isProjectCreator && !isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied: Only project creator or admin can view team comparison metrics' 
      });
    }

    const metrics = await performanceService.getTeamComparisonMetrics(projectId);
    res.json(metrics);
  } catch (err) {
    next(err);
  }
}

// Get performance trends over specified time period
async function getPerformanceTrends(req, res, next) {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Only project creators and admins can view performance trends
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isProjectCreator = project.created_by === userId;
    const isAdmin = userRole === 'Admin';

    if (!isProjectCreator && !isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied: Only project creator or admin can view performance trends' 
      });
    }

    const { days = 30 } = req.query;
    const trends = await performanceService.getPerformanceTrends(projectId, parseInt(days));
    res.json(trends);
  } catch (err) {
    next(err);
  }
}

// Get collaboration metrics for team analysis
async function getCollaborationMetrics(req, res, next) {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Only project creators and admins can view collaboration metrics
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isProjectCreator = project.created_by === userId;
    const isAdmin = userRole === 'Admin';

    if (!isProjectCreator && !isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied: Only project creator or admin can view collaboration metrics' 
      });
    }

    const metrics = await performanceService.getCollaborationMetrics(projectId);
    res.json(metrics);
  } catch (err) {
    next(err);
  }
}

// Export performance controller functions
module.exports = {
  getTaskPerformance,
  getProjectTeamPerformance,
  getUserPerformance,
  getTeamComparisonMetrics,
  getPerformanceTrends,
  getCollaborationMetrics
};
