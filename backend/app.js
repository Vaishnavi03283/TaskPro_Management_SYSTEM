// Core Dependencies -->
const express = require('express');     // Web framework
const cors = require('cors');           // Cross-origin resource sharing
const morgan = require('morgan');       // Request logging
const dotenv = require('dotenv');       // Environment variable management
const swaggerUi = require('swagger-ui-express');// API documentation UI

dotenv.config();

// Express app initialization
const app = express();

// =============================
// MIDDLEWARE Configuration 
// =============================
app.use(cors());                            // Enables CORS for all routes
app.use(express.json());                   // Parses JSON request bodies
app.use(morgan('dev'));                     // Logs HTTP requests in dev format
 
// =============================
// HEALTH CHECK endpoint  -->load balancer /monitoring health checks
// =============================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// =============================
// SWAGGER Documentation  --->> Purpose: Interactive API documentation at /api-docs
// =============================
const swaggerSpec = require('./docs/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================
// API ROUTES --->> Purpose: All API endpoints under /api
// =============================
const routes = require('./routes');
app.use('/api', routes);

// =============================
// ROOT ROUTE --->> Purpose:  API information and navigation
// =============================
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'TaskPro API is running 🚀',
    health: '/health',
    docs: '/api-docs'
  });
});

// =============================
// ERROR HANDLING (LAST) --->> Purpose: Global error handling for all routes
// =============================
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

//Export  configured app
module.exports = app;