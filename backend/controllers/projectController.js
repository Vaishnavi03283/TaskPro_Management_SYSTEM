// Project management controller for CRUD operations and member management
const projectService = require('../services/projectService');

// Create new project with authentication and validation
async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.body, req.user);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

// Get all projects accessible to current user based on role
async function getProjects(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const projects = await projectService.getProjects(userId, userRole);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

// Get specific project details with authorization check
async function getProjectById(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const project = await projectService.getProjectById(req.params.id, userId, userRole);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

// Update project details with authorization validation
async function updateProject(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const project = await projectService.updateProject(req.params.id, req.body, userId, userRole);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

// Delete project with authorization and cleanup
async function deleteProject(req, res, next) {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    await projectService.deleteProject(req.params.id, userId, userRole);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Add member to project with authorization validation
async function addProjectMember(req, res, next) {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    
    const result = await projectService.addProjectMember(projectId, userId, currentUserId, currentUserRole);
    
    if (result) {
      res.status(201).json({ 
        message: 'Member added successfully',
        member: result 
      });
    } else {
      res.status(409).json({ 
        message: 'User is already a member of this project' 
      });
    }
  } catch (err) {
    next(err);
  }
}

// Remove member from project with authorization check
async function removeProjectMember(req, res, next) {
  try {
    const { projectId, userId } = req.params;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    
    const result = await projectService.removeProjectMember(projectId, userId, currentUserId, currentUserRole);
    
    if (result) {
      res.json({ 
        message: 'Member removed successfully',
        member: result 
      });
    } else {
      res.status(404).json({ 
        message: 'User is not a member of this project' 
      });
    }
  } catch (err) {
    next(err);
  }
}

// Get all members of a specific project
async function getProjectMembers(req, res, next) {
  try {
    const { projectId } = req.params;
    
    const members = await projectService.getProjectMembers(projectId);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

// Get all projects with their member details included
async function getProjectsWithMembers(req, res, next) {
  try {
    const projects = await projectService.getProjectsWithMembers();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

// Export project controller functions
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectMembers,
  getProjectsWithMembers
};

