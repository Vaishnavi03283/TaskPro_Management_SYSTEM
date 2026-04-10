// PostgreSQL database connection configuration and pool management
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables for database configuration
dotenv.config();

// Get database connection string from environment
const connectionString = process.env.DATABASE_URL;

// Create PostgreSQL connection pool with environment-based configuration
const pool = new Pool(
  connectionString
    ? {
        // Use connection string for production/Heroku
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        // Use individual environment variables for development
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        database: process.env.DB_NAME || 'task_management',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
      }
);

// Handle database connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export the configured database pool
module.exports = pool;