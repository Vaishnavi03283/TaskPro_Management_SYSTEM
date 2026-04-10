// Main application configuration and middleware setup for Task Project Management System
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import application routes and middleware
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./docs/swagger');

// Initialize Express application
const app = express();

// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
// Log HTTP requests in development mode
app.use(morgan('dev'));

// Determine static file path based on environment
const staticPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '../frontend/dist');

// Serve static files from the determined path
app.use(express.static(staticPath));

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount API routes
app.use('/api', routes);

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

// Handle 404 errors for non-existent routes
app.use(notFoundHandler);
// Global error handling middleware
app.use(errorHandler);

// Export the configured Express application
module.exports = app;

