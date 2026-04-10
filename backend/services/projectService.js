// Project management service with role-based access control and member management
const projectRepository = require('../repositories/projectRepository');
const pool = require('../config/db');

// Create new project with user authentication and default status
async function createProject(data, user) {
  const payload = {
    ...data,
    status: data.status || 'Active',  // Default status
    created_by: user.id
  };
  return projectRepository.createProject(payload);
}

// Get projects based on user role with appropriate access permissions
async function getProjects(userId, userRole) {
  const role = String(userRole || '');
  
  if (role === "User") {
    // Users can see projects they are members of or created
    return projectRepository.getProjectsByUser(userId);
  }
  
  if (role === "Manager") {
    // Managers can see projects they are members of or created (same as users)
    return projectRepository.getProjectsByUser(userId);
  }
  
  if (role === "Admin") {
    // Admins can see all projects
    return projectRepository.getProjects();
  }
  
  // Default: no access
  return [];
}

// Get specific project with role-based access validation
async function getProjectById(id, userId, userRole) {
  const project = await projectRepository.getProjectById(id);
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  
  const role = String(userRole || '');
  
  // Check access permissions
  if (role === "User") {
    // Users can access project if they are members or created it
    const hasAccess = await checkUserProjectAccess(userId, id);
    if (!hasAccess) {
      const err = new Error('Access denied: You do not have permission to view this project');
      err.status = 403;
      throw err;
    }
  } else if (role === "Manager") {
    // Managers can access project if they created it
    if (project.created_by !== userId) {
      const err = new Error('Access denied: You do not have permission to view this project');
      err.status = 403;
      throw err;
    }
  }
  // Admins can access all projects
  
  return project;
}

// Check if user has access to specific project
async function checkUserProjectAccess(userId, projectId) {
  const result = await pool.query(
    `SELECT 1 FROM projects p 
     WHERE p.id = $1 AND (
       p.created_by = $2 OR 
       p.id IN (
         SELECT project_id FROM project_members WHERE user_id = $2
       )
     )`,
    [projectId, userId]
  );
  return result.rows.length > 0;
}

// Update project with authorization validation
async function updateProject(id, data, userId, userRole) {
  const role = String(userRole || '');
  
  // Check if user has permission to update project
  if (role !== 'Admin') {
    // For non-admin users, check if they created the project
    const project = await projectRepository.getProjectById(id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      throw err;
    }
    
    if (project.created_by !== userId) {
      const err = new Error('Access denied: Only project creator can edit this project');
      err.status = 403;
      throw err;
    }
  }
  
  const updatedProject = await projectRepository.updateProject(id, data);
  if (!updatedProject) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return updatedProject;
}

// Delete project with authorization and cleanup
async function deleteProject(id, userId, userRole) {
  const role = String(userRole || '');
  
  // Check if user has permission to delete project
  if (role !== 'Admin') {
    // For non-admin users, check if they created the project
    const project = await projectRepository.getProjectById(id);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      throw err;
    }
    
    if (project.created_by !== userId) {
      const err = new Error('Access denied: Only project creator can delete this project');
      err.status = 403;
      throw err;
    }
  }
  
  await projectRepository.deleteProject(id);
}

// Add member to project with authorization validation
async function addProjectMember(projectId, userId, currentUserId, currentUserRole) {
  const role = String(currentUserRole || '');
  
  // Check if user has permission to add members
  if (role !== 'Admin') {
    // For non-admin users, check if they created the project
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      throw err;
    }
    
    if (project.created_by !== currentUserId) {
      const err = new Error('Access denied: Only project creator can add members');
      err.status = 403;
      throw err;
    }
  }
  
  return await projectRepository.addProjectMember(projectId, userId);
}

// Remove member from project with authorization check
async function removeProjectMember(projectId, userId, currentUserId, currentUserRole) {
  const role = String(currentUserRole || '');
  
  // Check if user has permission to remove members
  if (role !== 'Admin') {
    // For non-admin users, check if they created the project
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      const err = new Error('Project not found');
      err.status = 404;
      throw err;
    }
    
    if (project.created_by !== currentUserId) {
      const err = new Error('Access denied: Only project creator can remove members');
      err.status = 403;
      throw err;
    }
  }
  
  return await projectRepository.removeProjectMember(projectId, userId);
}

// Get all members of a specific project
async function getProjectMembers(projectId) {
  // Check if project exists
  const project = await projectRepository.getProjectById(projectId);
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  
  return projectRepository.getProjectMembers(projectId);
}

// Get all projects with their member details included
async function getProjectsWithMembers() {
  return await projectRepository.getProjectsWithMembers();
}

// Export project service functions
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

