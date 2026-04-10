// User model representing user accounts with authentication and role-based access
class User {
  // Initialize user with credentials, profile information, and role assignment
  constructor({ id, name, email, password, role, created_at }) {
    this.id = id; // UUID string
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.created_at = created_at;
  }
}

// Export User class for use in application
module.exports = User;

