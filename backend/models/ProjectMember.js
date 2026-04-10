// ProjectMember model representing many-to-many relationship between projects and users
class ProjectMember {
  // Initialize project-member association
  constructor({ project_id, user_id }) {
    this.project_id = project_id; // UUID string
    this.user_id = user_id; // UUID string
  }
}

// Export ProjectMember class for use in application
module.exports = ProjectMember;

