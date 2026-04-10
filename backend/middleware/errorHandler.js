// Handle 404 errors for non-existent routes
function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: 'Route not found'
  });
}

// Global error handling middleware for application-wide error processing
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    message
  });
}

// Export error handling middleware functions
module.exports = {
  notFoundHandler,
  errorHandler
};

