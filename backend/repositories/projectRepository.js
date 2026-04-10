// Project repository for database operations and project data management
const pool = require('../config/db');
const Project = require('../models/Project');

// Create new project record in database with creator association
async function createProject({ name, description, start_date, end_date, status, created_by }) {
  const result = await pool.query(
    `INSERT INTO projects (name, description, start_date, end_date, status, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description, start_date, end_date, status, created_by]
  );
  return new Project(result.rows[0]);
}

// Retrieve all projects with creator information
async function getProjects() {
  const result = await pool.query(
    `SELECT p.*,
            u.name AS created_by_name
     FROM projects p
     JOIN users u ON u.id = p.created_by
     ORDER BY p.created_at DESC`
  );
  return result.rows.map((row) => new Project(row));
}

// Get specific project by ID with creator details
async function getProjectById(id) {
  const result = await pool.query(
    `SELECT p.*,
            u.name AS created_by_name
     FROM projects p
     JOIN users u ON u.id = p.created_by
     WHERE p.id = $1`,
    [id]
  );
  if (!result.rows[0]) return null;
  return new Project(result.rows[0]);
}

// Update project record with field validation
async function updateProject(id, fields) {
  const { name, description, start_date, end_date, status } = fields;
  const result = await pool.query(
    `UPDATE projects
     SET name = $1,
         description = $2,
         start_date = $3,
         end_date = $4,
         status = $5
     WHERE id = $6
     RETURNING *`,
    [name, description, start_date, end_date, status, id]
  );
  if (!result.rows[0]) return null;
  return new Project(result.rows[0]);
}

// Delete project record from database
async function deleteProject(id) {
  await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
}

// Add member to project with conflict handling
async function addProjectMember(projectId, userId) {
  const result = await pool.query(
    `INSERT INTO project_members (project_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (project_id, user_id) DO NOTHING
     RETURNING *`,
    [projectId, userId]
  );
  return result.rows[0];
}

// Remove member from project with validation
async function removeProjectMember(projectId, userId) {
  const result = await pool.query(
    `DELETE FROM project_members 
     WHERE project_id = $1 AND user_id = $2
     RETURNING *`,
    [projectId, userId]
  );
  return result.rows[0];
}

// Get all members of specific project
async function getProjectMembers(projectId) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at
     FROM users u
     JOIN project_members pm ON u.id = pm.user_id
     WHERE pm.project_id = $1
     ORDER BY u.name`,
    [projectId]
  );
  return result.rows;
}

// Get all projects with their member details included
async function getProjectsWithMembers() {
  // Get all projects first
  const projectsQuery = `
    SELECT p.id, p.name, p.description, p.start_date, p.end_date, 
           p.status, p.created_by, p.created_at,
           u.name AS created_by_name
    FROM projects p
    JOIN users u ON u.id = p.created_by
    ORDER BY p.created_at DESC
  `;
  
  const projectsResult = await pool.query(projectsQuery);
  const projects = projectsResult.rows;
  
  // For each project, get members separately
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    
    try {
      const membersQuery = `
        SELECT u.id, u.name, u.email, u.role
        FROM users u
        INNER JOIN project_members pm ON u.id = pm.user_id
        WHERE pm.project_id = $1
        ORDER BY u.name
      `;
      
      const membersResult = await pool.query(membersQuery, [project.id]);
      project.members = membersResult.rows;
    } catch (err) {
      project.members = [];
    }
  }
  
  return projects;
}

// Get projects accessible to specific user (created or member)
async function getProjectsByUser(userId) {
  const result = await pool.query(
    `SELECT p.*,
            u.name AS created_by_name,
            CASE 
              WHEN p.created_by = $1 THEN true
              ELSE false
            END AS is_owner,
            pm.user_id IS NOT NULL AS is_member
     FROM projects p
     JOIN users u ON u.id = p.created_by
     LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = $1
     WHERE p.created_by = $1 OR pm.user_id IS NOT NULL
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return result.rows.map((row) => new Project(row));
}

// Get projects created by specific manager
async function getProjectsByManager(managerId) {
  const result = await pool.query(
    `SELECT p.*,
            u.name AS created_by_name,
            true AS is_owner,
            true AS is_member
     FROM projects p
     JOIN users u ON u.id = p.created_by
     WHERE p.created_by = $1
     ORDER BY p.created_at DESC`,
    [managerId]
  );
  return result.rows.map((row) => new Project(row));
}

// Export project repository functions
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectMembers,
  getProjectsWithMembers,
  getProjectsByUser,
  getProjectsByManager
};

