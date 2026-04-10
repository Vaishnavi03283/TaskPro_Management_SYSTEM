// Server entry point for Task Project Management System API
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Determine which environment file to use (.env.local takes precedence)
const envFile = fs.existsSync(path.join(__dirname, '.env.local')) ? '.env.local' : '.env';
// Load environment variables from the determined file
dotenv.config({ path: path.join(__dirname, envFile) });

// Import the configured Express application
const app = require('./app');

// Set the server port from environment variables or default to 5001
const PORT = process.env.PORT || 5001;

// Start the server and listen on the configured port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

