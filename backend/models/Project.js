// Project model representing project management data and member associations
class Project {
  // Initialize project with details, timeline, status, and member list
  constructor({ id, name, description, start_date, end_date, status, created_by, created_by_name, members = [] }) {
    this.id = id; // UUID string
    this.name = name;
    this.description = description;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;
    this.created_by = created_by; // UUID string
    this.created_by_name = created_by_name;
    this.members = members;
  }
}

// Export Project class for use in application
module.exports = Project;

