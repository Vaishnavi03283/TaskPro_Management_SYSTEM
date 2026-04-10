// Authentication and authorization middleware for JWT token validation
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables for JWT secret
dotenv.config();

// Middleware to authenticate JWT tokens from Authorization header
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Middleware factory to authorize users based on role permissions
function authorizeRoles(...roles) {
  const allowed = roles.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    const userRole = String(req.user.role).toLowerCase();

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
}

// Export authentication middleware functions
module.exports = {
  authenticateJWT,
  authorizeRoles
};


