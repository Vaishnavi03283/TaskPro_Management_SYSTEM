// Main application configuration and middleware setup for Task Project Management System

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
dotenv.config();

// =============================
// HEALTH CHECK (IMPORTANT)
// =============================

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// Import routes and middleware
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./docs/swagger');

// Initialize Express app
const app = express();

// =============================
// MIDDLEWARE
// =============================

// Enable CORS (allow frontend to access backend)
app.use(cors());

// Parse JSON requests
app.use(express.json());

// HTTP request logger
app.use(morgan('dev'));


// =============================
// SWAGGER DOCS
// =============================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================
// API ROUTES
// =============================

app.use('/api', routes);

// =============================
// ERROR HANDLING
// =============================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Export app
module.exports = app;