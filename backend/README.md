# Task & Project Management System - Backend API

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-4.19.2-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D13-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A production-ready RESTful API for task and project management with role-based access control, JWT authentication, and comprehensive analytics. Built with Node.js, Express, PostgreSQL, and following clean architecture principles.

## Table of Contents

- [Backend Overview](#backend-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Error Handling Strategy](#error-handling-strategy)
- [Security Practices](#security-practices)
- [Authentication & Authorization](#authentication--authorization)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

## Backend Overview

This backend API provides a robust foundation for task and project management with enterprise-grade security, scalability, and maintainability. Built following clean architecture principles with separation of concerns, dependency injection, and comprehensive error handling.

### Key Design Principles
- **Clean Architecture**: Controllers, Services, and Repositories pattern
- **SOLID Principles**: Single responsibility, open/closed, dependency inversion
- **Security First**: JWT authentication, role-based access control, input validation
- **Production Ready**: Connection pooling, error handling, environment configuration
- **API Developer Friendly**: Comprehensive documentation, standardized responses

## Tech Stack

### Core Framework
- **Node.js** (>= 18.0.0) - JavaScript runtime environment
- **Express.js** (4.19.2) - Web application framework
- **PostgreSQL** (>= 13.0) - Primary relational database with UUID support

### Authentication & Security
- **jsonwebtoken** (9.0.2) - JWT token generation and verification
- **bcryptjs** (2.4.3) - Password hashing and comparison
- **cors** (2.8.5) - Cross-Origin Resource Sharing configuration

### Development & Documentation
- **morgan** (1.10.0) - HTTP request logger
- **swagger-jsdoc** (6.2.8) - API documentation generation
- **swagger-ui-express** (5.0.1) - Interactive API documentation
- **nodemon** (3.1.0) - Development server with auto-restart

### Database & Utilities
- **pg** (8.11.5) - PostgreSQL client with connection pooling
- **uuid** (13.0.0) - UUID generation for primary keys
- **dotenv** (16.4.5) - Environment variable management

## Project Structure

```
backend/
|-- config/
|   |-- db.js                 # PostgreSQL connection configuration
|-- controllers/
|   |-- adminController.js    # Admin operations handler
|   |-- authController.js     # Authentication handler
|   |-- commentController.js  # Comment operations
|   |-- dashboardController.js # Dashboard data handler
|   |-- projectController.js  # Project CRUD operations
|   |-- taskController.js     # Task CRUD operations
|   |-- userController.js     # User profile management
|   |-- performanceController.js # Analytics handler
|-- middleware/
|   |-- authMiddleware.js     # JWT authentication & authorization
|   |-- errorHandler.js       # Centralized error handling
|-- models/
|   |-- Comment.js            # Comment data model
|   |-- Project.js            # Project data model
|   |-- ProjectMember.js      # Project-member relationship
|   |-- Task.js               # Task data model
|   |-- User.js               # User data model
|-- repositories/
|   |-- commentRepository.js  # Comment data access layer
|   |-- dashboardRepository.js # Dashboard data queries
|   |-- performanceRepository.js # Analytics data access
|   |-- projectRepository.js  # Project data access layer
|   |-- taskRepository.js     # Task data access layer
|   |-- userRepository.js     # User data access layer
|-- routes/
|   |-- adminRoutes.js        # Admin-specific endpoints
|   |-- authRoutes.js         # Authentication endpoints
|   |-- commentRoutes.js      # Comment endpoints
|   |-- dashboardRoutes.js    # Dashboard endpoints
|   |-- index.js              # Route aggregation
|   |-- performanceRoutes.js  # Analytics endpoints
|   |-- projectRoutes.js      # Project endpoints
|   |-- taskRoutes.js         # Task endpoints
|   |-- userRoutes.js         # User endpoints
|-- services/
|   |-- adminService.js       # Admin business logic
|   |-- authService.js        # Authentication service
|   |-- commentService.js     # Comment business logic
|   |-- dashboardService.js   # Dashboard data processing
|   |-- performanceService.js # Analytics business logic
|   |-- projectService.js     # Project business logic
|   |-- taskService.js        # Task business logic
|-- docs/
|   |-- postman-collection.json # API collection for testing
|   |-- postman-environment.json # Environment configuration
|   |-- sql_schema.sql        # Database schema
|   |-- swagger.js            # API documentation configuration
|-- app.js                    # Express application setup
|-- server.js                 # Server entry point
|-- package.json              # Dependencies and scripts
|-- .env                      # Environment variables (git-ignored)
```

## Features

### Authentication (JWT)
- **Secure Registration**: Password hashing with bcrypt
- **JWT Login**: Token-based authentication with expiration
- **Token Validation**: Middleware for protected routes
- **Role-based Authorization**: Admin, Manager, User permissions

### Role-Based Authorization
- **Admin**: Full system access, user management, all projects/tasks
- **Manager**: Project management, task assignment, team analytics
- **User**: View assigned tasks, update status, create comments

### Project & Task APIs
- **Project CRUD**: Create, read, update, delete projects
- **Member Management**: Add/remove users from projects
- **Task Management**: Full lifecycle with assignment and tracking
- **Status Updates**: Pending, In Progress, Completed states
- **Priority Levels**: Low, Medium, High priority assignment

### Comments System
- **Task Comments**: Add comments to specific tasks
- **User Attribution**: Track who created each comment
- **Timestamp Tracking**: Automatic creation time recording
- **Comment Management**: Update and delete comments

### Performance Analytics
- **User Dashboards**: Personal task statistics and completion rates
- **Manager Dashboards**: Project progress and team performance
- **Admin Analytics**: System-wide statistics and user management
- **Trend Analysis**: Performance metrics over time
- **Team Collaboration**: Cross-functional performance insights

## API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/auth/register` | Register new user with password hashing | No | Public |
| POST | `/api/auth/login` | User authentication with JWT token | No | Public |

### User Management APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users/profile` | Get current user profile | Yes | All |
| PUT | `/api/users/profile` | Update user profile | Yes | All |
| GET | `/api/admin/users` | Get all users with search & filtering | Yes | Admin |
| PUT | `/api/admin/user-role` | Update user role assignment | Yes | Admin |
| DELETE | `/api/admin/users/:id` | Delete user account | Yes | Admin |

### Project APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/projects` | Get all projects (role-based) | Yes | All |
| POST | `/api/projects` | Create new project | Yes | Manager, Admin |
| GET | `/api/projects/:id` | Get specific project details | Yes | All |
| PUT | `/api/projects/:id` | Update project information | Yes | Manager, Admin |
| DELETE | `/api/projects/:id` | Delete project | Yes | Manager, Admin |
| GET | `/api/projects/:projectId/members` | Get project members | Yes | All |
| POST | `/api/projects/:projectId/members` | Add member to project | Yes | Manager, Admin |
| DELETE | `/api/projects/:projectId/members/:userId` | Remove member from project | Yes | Manager, Admin |

### Task APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/tasks` | Get tasks (role-based filtering) | Yes | All |
| POST | `/api/tasks` | Create new task | Yes | Manager, Admin |
| GET | `/api/tasks/:id` | Get specific task details | Yes | All |
| PUT | `/api/tasks/:id` | Update task (status, assignment) | Yes | All |
| DELETE | `/api/tasks/:id` | Delete task | Yes | Manager, Admin |
| GET | `/api/tasks/project/:projectId` | Get all tasks for project | Yes | All |

### Comment APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/comments/task/:taskId` | Get all comments for task | Yes | All |
| POST | `/api/comments` | Add new comment to task | Yes | All |
| PUT | `/api/comments/:id` | Update existing comment | Yes | All |
| DELETE | `/api/comments/:id` | Delete comment | Yes | All |

### Dashboard APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/dashboard/user` | Personal dashboard statistics | Yes | User, Manager, Admin |
| GET | `/api/dashboard/manager` | Role-based dashboard (auto-detect) | Yes | All |
| GET | `/api/admin/dashboard/stats` | System-wide statistics | Yes | Admin |
| GET | `/api/admin/system/usage` | System usage analytics | Yes | Admin |

### Performance Analytics APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/performance/user/:userId` | Individual user performance | Yes | All |
| GET | `/api/performance/project/:projectId` | Project performance analytics | Yes | All |
| GET | `/api/performance/team/:managerId` | Team performance under manager | Yes | Manager, Admin |

### System APIs

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/health` | System health check | No | Public |
| GET | `/api-docs` | Swagger API documentation | No | Public |

## Environment Variables

### Required Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
# OR individual database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=1d
```

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5001` |
| `JWT_EXPIRES_IN` | Token expiration time | `1d` |
| `LOG_LEVEL` | Logging level | `info` |

## Database Setup

### Prerequisites
- **Node.js** >= 18.0.0
- **PostgreSQL** >= 13.0
- **npm** or **yarn** package manager

### Installation Steps

#### 1. Clone and Install
```bash
git clone <repository-url>
cd Task-Project-Management-System-main/backend
npm install
```

#### 2. Create Database
```sql
CREATE DATABASE task_management;
```

#### 3. Run Schema Setup
```bash
# Execute the SQL schema
psql -d task_management -f docs/sql_schema.sql
```

#### 4. Environment Configuration
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Database Schema
The system uses PostgreSQL with the following main entities:
- **users**: User accounts with role-based permissions (Admin, Manager, User)
- **projects**: Project management with member associations
- **tasks**: Task management with assignment and status tracking
- **comments**: Task-based communication system
- **project_members**: Many-to-many relationship between projects and users

## Running the Server

### Development Mode
```bash
npm run dev
```
- Starts with nodemon for auto-restart
- Enables detailed HTTP request logging
- Uses development database settings

### Production Mode
```bash
npm start
```
- Optimized for production environment
- Minimal logging for performance
- Uses production database configuration

### Health Check
```bash
curl http://localhost:5001/api/health
```

### Available Scripts
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

## Error Handling Strategy

### Centralized Error Handling
The API implements a comprehensive error handling strategy through:
- **Global Error Middleware**: Catches all errors across the application
- **Custom Error Classes**: Specific error types for different scenarios
- **Consistent Error Format**: Standardized JSON error responses

### Error Response Format
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes
| Status | Usage | Example |
|--------|-------|---------|
| `200` | Success | Resource retrieved successfully |
| `201` | Created | New resource created |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource does not exist |
| `500` | Internal Error | Server processing error |

### Common Error Scenarios
- **Authentication Errors**: Invalid credentials, expired tokens
- **Authorization Errors**: Insufficient role permissions
- **Validation Errors**: Missing required fields, invalid data types
- **Resource Errors**: User/project/task not found
- **Database Errors**: Connection failures, constraint violations

### Error Logging Strategy
- **Development**: Full stack traces and detailed error information
- **Production**: Sanitized error messages with reference IDs
- **Database Errors**: Automatic retry with exponential backoff
- **Critical Errors**: Alert notifications for system failures

## Security Practices

### Authentication Security
- **JWT Tokens**: Secure token-based authentication with expiration
- **Password Hashing**: Bcrypt with salt rounds (10)
- **Token Expiration**: Configurable token lifetime (default: 1 day)
- **Secure Headers**: Proper HTTP security headers

### Authorization Security
- **Role-Based Access Control (RBAC)**: Three-tier permission system
- **Route Protection**: Middleware-based authentication and authorization
- **Least Privilege**: Users only access necessary resources
- **Self-Protection**: Users cannot delete their own accounts

### Input Validation & Sanitization
- **Request Validation**: Validate all incoming request data
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Input sanitization for user-generated content
- **Data Type Validation**: Strict type checking for all inputs

### Environment Security
- **Environment Variables**: Sensitive data stored in .env files
- **Database Security**: Connection pooling with SSL support
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Rate Limiting**: Protection against brute force attacks

### Security Headers
```javascript
// Implemented security headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: "1; mode=block"
- Strict-Transport-Security: max-age=31536000
```

## Authentication & Authorization

### JWT Token Flow
1. **Registration/Login**: User credentials validated, JWT token issued
2. **Token Usage**: Include `Authorization: Bearer <token>` header
3. **Token Validation**: Middleware validates token on protected routes
4. **Role Authorization**: Role-based access control for specific endpoints

### Token Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "User"
  }
}
```

### Role Permissions Matrix

| Feature | Admin | Manager | User |
|---------|-------|---------|------|
| **User Management** | Full CRUD | Read Only | Profile Only |
| **Project Management** | Full CRUD | Own Projects | View Assigned |
| **Task Management** | Full CRUD | Own Projects | Assigned Tasks |
| **Comments** | Full CRUD | Full CRUD | Full CRUD |
| **Analytics** | System-wide | Team-based | Personal |
| **Dashboard** | Admin Dashboard | Manager Dashboard | User Dashboard |

## API Documentation

### Interactive Documentation
Access the interactive Swagger UI at:
```
http://localhost:5001/api-docs
```

### OpenAPI Specification
The raw OpenAPI JSON is available at:
```
http://localhost:5001/api-docs-json
```

### Postman Collection
A comprehensive Postman collection is available in `docs/postman-collection.json` with:
- All API endpoints pre-configured
- Environment variables setup
- Authentication flow automation
- Sample request bodies

### API Response Format
All API responses follow a consistent format:

**Success Response:**
```json
{
  "data": { /* Response data */ },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deployment

### Production Deployment

#### Environment Setup
1. **Production Database**: Configure PostgreSQL with proper indexing
2. **Environment Variables**: Set all required production variables
3. **Security**: Configure HTTPS, CORS, and security headers
4. **Monitoring**: Set up application monitoring and logging

#### Docker Deployment
```dockerfile
# Production Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/task_management
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=task_management
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Cloud Deployment Compatibility
- **AWS EC2/ECS**: Full compatibility with container orchestration
- **Google Cloud Platform**: Cloud Run and Compute Engine support
- **Microsoft Azure**: App Service and Container Instances
- **Heroku**: Direct deployment with PostgreSQL add-on
- **DigitalOcean**: App Platform and Droplets

### Environment-Specific Configurations
- **Development**: Local database, verbose logging, hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized settings, minimal logging, SSL enabled

---

**Built with passion for efficient project management**
