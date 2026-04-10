const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

// Initialize Express app FIRST
const app = express();

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// =============================
// HEALTH CHECK (FIXED)
// =============================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// =============================
// IMPORT ROUTES
// =============================
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./docs/swagger');

// =============================
// SWAGGER
// =============================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================
// API ROUTES
// =============================
app.use('/api', routes);

// =============================
// ERROR HANDLING
// =============================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;