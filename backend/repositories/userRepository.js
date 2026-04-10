// User repository for database operations and user data management
const pool = require('../config/db');
const User = require('../models/User');

// Create new user record in database with hashed password
async function createUser({ name, email, password, role }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, password, role, created_at`,
    [name, email, password, role]
  );
  return new User(result.rows[0]);
}

// Find user by email address for authentication and lookup
async function findByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, password, role, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  if (!result.rows[0]) return null;
  return new User(result.rows[0]);
}

// Retrieve all users from database ordered by creation date
async function findAllUsers() {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows.map((row) => new User(row));
}

// Update user role in database with validation
async function updateUserRole(userId, role) {
  const result = await pool.query(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING id, name, email, password, role, created_at`,
    [role, userId]
  );
  if (!result.rows[0]) return null;
  return new User(result.rows[0]);
}

// Delete user account from database with cleanup
async function deleteUser(userId) {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );
  return result.rowCount > 0;
}

// Export user repository functions
module.exports = {
  createUser,
  findByEmail,
  findAllUsers,
  updateUserRole,
  deleteUser
};

