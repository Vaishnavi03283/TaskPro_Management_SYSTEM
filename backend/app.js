const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// =============================
// HEALTH CHECK
// =============================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// =============================
// SWAGGER
// =============================
const swaggerSpec = require('./docs/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================
// API ROUTES
// =============================
const routes = require('./routes');
app.use('/api', routes);

// =============================
// ROOT ROUTE
// =============================
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'TaskPro API is running 🚀',
    health: '/health',
    docs: '/api-docs'
  });
});

// =============================
// ERROR HANDLING (LAST)
// =============================
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;