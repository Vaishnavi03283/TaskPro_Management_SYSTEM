/**
 * 🚀 TaskPro Enterprise - Production API Documentation
 * 
 * Industry-Grade Task & Project Management System
 * Scalable Architecture | JWT Authentication | Real-time Analytics
 * 
 * @version 1.0.0 Production
 * @author TaskPro Engineering Team
 * @license Enterprise License
 */

const swaggerJsdoc = require("swagger-jsdoc");

// Dynamic server configuration for multi-environment deployment
const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://task-and-project-management-system.onrender.com"
    : "http://localhost:5001";

// Production-ready OpenAPI specification
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚀 TaskPro Enterprise API",
      version: "1.0.0",
      description: `
# TaskPro Enterprise API

## Professional Task & Project Management System

**Enterprise-grade workflow management with real-time analytics and team collaboration.**

---

## Quick Start

### 1. Get JWT Token
- Use \`POST /api/auth/register\` or \`POST /api/auth/login\`
- Copy the token from response

### 2. Authorize
- Click **Authorize** (top-right)
- Paste: \`Bearer <token>\`

### 3. Access API
- All endpoints now authenticated
- Role-based permissions enforced

---

## User Roles
- **Admin**: Full system access
- **Manager**: Projects & teams
- **User**: Tasks & personal dashboard

---

## Core Features
- **Project Management**: Create, track, collaborate
- **Task Management**: Assign, monitor, complete
- **Team Analytics**: Performance insights
- **Real-time Updates**: Live status tracking

---

## Security
- JWT authentication (24h expiry)
- Role-based access control
- Enterprise-grade encryption

---

**Built for scale. Designed for teams.**
      `,
      contact: {
        name: "TaskPro Enterprise Support",
        email: "enterprise@taskpro.com",
        url: "https://taskpro.com/enterprise"
      },
      license: {
        name: "Enterprise License",
        url: "https://taskpro.com/license"
      }
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === "production" 
          ? "🌐 Production Server" 
          : "🔧 Development Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: `
🔐 Enterprise JWT Authentication

**Authentication Flow:**
1. Use POST /api/auth/register or POST /api/auth/login
2. Copy the 'token' from response
3. Click 'Authorize' button above
4. Paste: Bearer <your-enterprise-token>

**Example:** Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

⚠️ Security: Tokens expire after 24 hours for enterprise security
          `
        }
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: { 
              type: "string", 
              format: "uuid",
              description: "Unique enterprise user identifier"
            },
            name: { 
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Full name for enterprise directory"
            },
            email: { 
              type: "string", 
              format: "email",
              description: "Corporate email address (unique)"
            },
            password: { 
              type: "string",
              minLength: 8,
              description: "Secure password (min 8 characters)"
            },
            role: { 
              type: "string",
              enum: ["Admin", "Manager", "User"],
              default: "User",
              description: "Enterprise role with specific permissions"
            },
            created_at: { 
              type: "string", 
              format: "date-time",
              description: "Account creation timestamp"
            }
          },
          example: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Sarah Johnson",
            email: "sarah.johnson@enterprise.com",
            role: "Manager",
            created_at: "2024-01-15T10:30:00Z"
          }
        },
        Project: {
          type: "object",
          required: ["name"],
          properties: {
            id: { 
              type: "string", 
              format: "uuid",
              description: "Unique project identifier"
            },
            name: { 
              type: "string",
              minLength: 2,
              maxLength: 200,
              description: "Project name for enterprise tracking"
            },
            description: { 
              type: "string",
              maxLength: 1000,
              description: "Comprehensive project description"
            },
            start_date: { 
              type: "string", 
              format: "date",
              description: "Project kickoff date (YYYY-MM-DD)"
            },
            end_date: { 
              type: "string", 
              format: "date",
              description: "Project completion date (YYYY-MM-DD)"
            },
            status: { 
              type: "string",
              enum: ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
              default: "Planning",
              description: "Current project lifecycle status"
            },
            created_by: { 
              type: "string", 
              format: "uuid",
              description: "Project creator user ID"
            },
            created_at: { 
              type: "string", 
              format: "date-time",
              description: "Project creation timestamp"
            }
          },
          example: {
            id: "456e7890-e89b-12d3-a456-426614174111",
            name: "Q1 Digital Transformation",
            description: "Enterprise digital transformation initiative",
            start_date: "2024-01-01",
            end_date: "2024-03-31",
            status: "Active",
            created_by: "123e4567-e89b-12d3-a456-426614174000"
          }
        },
        Task: {
          type: "object",
          required: ["title"],
          properties: {
            id: { 
              type: "string", 
              format: "uuid",
              description: "Unique task identifier"
            },
            title: { 
              type: "string",
              minLength: 2,
              maxLength: 300,
              description: "Clear, actionable task title"
            },
            description: { 
              type: "string",
              maxLength: 2000,
              description: "Detailed task requirements and context"
            },
            priority: { 
              type: "string",
              enum: ["Low", "Medium", "High", "Critical"],
              default: "Medium",
              description: "Task priority for resource allocation"
            },
            status: { 
              type: "string",
              enum: ["Pending", "In Progress", "Completed", "Cancelled"],
              default: "Pending",
              description: "Current task execution status"
            },
            due_date: { 
              type: "string", 
              format: "date",
              description: "Task deadline (YYYY-MM-DD)"
            },
            assigned_user_id: { 
              type: "string", 
              format: "uuid", 
              nullable: true,
              description: "Assigned team member ID"
            },
            project_id: { 
              type: "string", 
              format: "uuid", 
              nullable: true,
              description: "Associated project ID"
            }
          },
          example: {
            id: "789e0123-e89b-12d3-a456-426614174222",
            title: "Implement API Authentication",
            description: "Integrate JWT authentication system",
            priority: "High",
            status: "In Progress",
            due_date: "2024-02-15",
            assigned_user_id: "123e4567-e89b-12d3-a456-426614174000",
            project_id: "456e7890-e89b-12d3-a456-426614174111"
          }
        },
        Comment: {
          type: "object",
          required: ["task_id", "comment_text"],
          properties: {
            id: { 
              type: "string", 
              format: "uuid",
              description: "Unique comment identifier"
            },
            task_id: { 
              type: "string", 
              format: "uuid",
              description: "Associated task ID"
            },
            user_id: { 
              type: "string", 
              format: "uuid",
              description: "Comment author ID"
            },
            comment_text: { 
              type: "string",
              maxLength: 1000,
              description: "Comment content"
            },
            created_at: { 
              type: "string", 
              format: "date-time",
              description: "Comment timestamp"
            }
          },
          example: {
            id: "012f3456-e89b-12d3-a456-426614174333",
            task_id: "789e0123-e89b-12d3-a456-426614174222",
            user_id: "123e4567-e89b-12d3-a456-426614174000",
            comment_text: "Authentication middleware implemented successfully",
            created_at: "2024-02-10T14:30:00Z"
          }
        },
        ProjectMember: {
          type: "object",
          description: "Enterprise project-team member relationship",
          properties: {
            project_id: { 
              type: "string", 
              format: "uuid",
              description: "Project identifier"
            },
            user_id: { 
              type: "string", 
              format: "uuid",
              description: "Team member identifier"
            }
          },
          example: {
            project_id: "456e7890-e89b-12d3-a456-426614174111",
            user_id: "123e4567-e89b-12d3-a456-426614174000"
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["🔐 Authentication"],
          summary: "Enterprise User Registration",
          description: "Register new enterprise user with role-based permissions",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["name", "email", "password"],
                  properties: {
                    name: { 
                      type: "string",
                      description: "Full name for enterprise directory"
                    },
                    email: { 
                      type: "string",
                      format: "email",
                      description: "Corporate email address"
                    },
                    password: { 
                      type: "string",
                      minLength: 8,
                      description: "Secure password (min 8 characters)"
                    },
                    role: {
                      type: "string",
                      enum: ["Admin", "Manager", "User"],
                      default: "User",
                      description: "Enterprise role assignment"
                    }
                  }
                },
                example: {
                  name: "Michael Chen",
                  email: "michael.chen@enterprise.com",
                  password: "SecurePass123!",
                  role: "Manager"
                }
              }
            }
          },
          responses: {
            201: {
              description: "✅ User successfully registered",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                      token: { type: "string" }
                    }
                  }
                }
              }
            },
            400: { description: "❌ Invalid input data" },
            409: { description: "❌ Email already exists" }
          }
        }
      },
      "/api/auth/login": {
        post: {
          tags: ["🔐 Authentication"],
          summary: "Enterprise User Login",
          description: "Authenticate enterprise user and return JWT token",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["email", "password"],
                  properties: {
                    email: { 
                      type: "string",
                      format: "email",
                      description: "Corporate email address"
                    },
                    password: { 
                      type: "string",
                      description: "User password"
                    }
                  }
                },
                example: {
                  email: "michael.chen@enterprise.com",
                  password: "SecurePass123!"
                }
              }
            }
          },
          responses: {
            200: {
              description: "✅ Authentication successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                      token: { type: "string" }
                    }
                  }
                }
              }
            },
            401: { description: "❌ Invalid credentials" },
            404: { description: "❌ User not found" }
          }
        }
      },
      "/api/users": {
        get: {
          tags: ["👥 User Management"],
          summary: "Get Enterprise Users Directory",
          description: "Retrieve all users for team assignment and collaboration",
          responses: {
            200: {
              description: "✅ Users retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      },
      "/api/admin/users": {
        get: {
          tags: ["👑 Administration"],
          summary: "Enterprise User Management",
          description: "Admin-only endpoint for comprehensive user management",
          parameters: [
            { 
              name: "search", 
              in: "query", 
              schema: { type: "string" },
              description: "Search users by name or email"
            },
            { 
              name: "role", 
              in: "query", 
              schema: { type: "string", enum: ["Admin", "Manager", "User"] },
              description: "Filter by enterprise role"
            }
          ],
          responses: {
            200: {
              description: "✅ Users retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            },
            403: { description: "❌ Admin access required" }
          }
        }
      },
      "/api/admin/user-role": {
        put: {
          tags: ["👑 Administration"],
          summary: "Update User Enterprise Role",
          description: "Admin-only endpoint to modify user permissions",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["userId", "role"],
                  properties: {
                    userId: { 
                      type: "string", 
                      format: "uuid",
                      description: "Target user ID"
                    },
                    role: {
                      type: "string",
                      enum: ["Admin", "Manager", "User"],
                      description: "New enterprise role"
                    }
                  }
                },
                example: {
                  userId: "123e4567-e89b-12d3-a456-426614174000",
                  role: "Manager"
                }
              }
            }
          },
          responses: {
            200: {
              description: "✅ User role updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Admin access required" },
            404: { description: "❌ User not found" }
          }
        }
      },
      "/api/admin/users/{id}": {
        delete: {
          tags: ["👑 Administration"],
          summary: "Remove Enterprise User",
          description: "Admin-only endpoint for user removal (cannot delete self)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "User ID to remove"
            }
          ],
          responses: {
            200: {
              description: "✅ User removed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Admin access required or cannot delete self" },
            404: { description: "❌ User not found" }
          }
        }
      },
      "/api/admin/dashboard/stats": {
        get: {
          tags: ["📊 Analytics"],
          summary: "Enterprise Dashboard Statistics",
          description: "Admin-only endpoint for comprehensive system analytics",
          responses: {
            200: {
              description: "✅ Dashboard statistics retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalUsers: { 
                        type: "integer",
                        description: "Total registered users"
                      },
                      totalProjects: { 
                        type: "integer",
                        description: "Total projects created"
                      },
                      totalTasks: { 
                        type: "integer",
                        description: "Total tasks created"
                      },
                      activeProjects: { 
                        type: "integer",
                        description: "Currently active projects"
                      },
                      completedTasks: { 
                        type: "integer",
                        description: "Tasks marked as completed"
                      },
                      systemHealth: {
                        type: "string",
                        enum: ["Excellent", "Good", "Fair", "Poor"],
                        description: "Overall system health status"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Admin access required" }
          }
        }
      },
      "/api/admin/system/usage": {
        get: {
          tags: ["📊 Analytics"],
          summary: "Enterprise System Usage Analytics",
          description: "Admin-only endpoint for detailed system usage metrics",
          responses: {
            200: {
              description: "✅ System usage analytics retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      dailyActiveUsers: { 
                        type: "integer",
                        description: "Users active in last 24 hours"
                      },
                      weeklyActiveUsers: { 
                        type: "integer",
                        description: "Users active in last 7 days"
                      },
                      monthlyActiveUsers: { 
                        type: "integer",
                        description: "Users active in last 30 days"
                      },
                      apiCallsToday: { 
                        type: "integer",
                        description: "Total API calls today"
                      },
                      storageUsed: { 
                        type: "string",
                        description: "Database storage consumption"
                      },
                      averageResponseTime: {
                        type: "number",
                        description: "Average API response time in ms"
                      },
                      uptime: {
                        type: "string",
                        description: "System uptime percentage"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Admin access required" }
          }
        }
      },
      "/api/projects": {
        get: {
          tags: ["📁 Project Management"],
          summary: "Get Enterprise Project Portfolio",
          description: "Retrieve all projects with role-based filtering",
          responses: {
            200: {
              description: "✅ Projects retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Project" }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ["📁 Project Management"],
          summary: "Create Enterprise Project",
          description: "Manager/Admin endpoint for project creation",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["name"],
                  properties: {
                    name: { 
                      type: "string",
                      minLength: 2,
                      maxLength: 200,
                      description: "Project name"
                    },
                    description: { 
                      type: "string",
                      maxLength: 1000,
                      description: "Project description"
                    },
                    start_date: { 
                      type: "string",
                      format: "date",
                      description: "Project start date (YYYY-MM-DD)"
                    },
                    end_date: { 
                      type: "string",
                      format: "date",
                      description: "Project end date (YYYY-MM-DD)"
                    },
                    status: {
                      type: "string",
                      enum: ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
                      default: "Planning",
                      description: "Initial project status"
                    }
                  }
                },
                example: {
                  name: "Q2 Product Launch",
                  description: "Enterprise product launch initiative",
                  start_date: "2024-04-01",
                  end_date: "2024-06-30",
                  status: "Planning"
                }
              }
            }
          },
          responses: {
            201: {
              description: "✅ Project created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      project: { $ref: "#/components/schemas/Project" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Manager/Admin access required" }
          }
        }
      },
      "/api/projects/{id}": {
        get: {
          tags: ["📁 Project Management"],
          summary: "Get Project Details",
          description: "Retrieve specific project information",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Project retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Project"
                  }
                }
              }
            },
            404: { description: "❌ Project not found" }
          }
        },
        put: {
          tags: ["📁 Project Management"],
          summary: "Update Project",
          description: "Manager/Admin endpoint for project updates",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    start_date: { type: "string", format: "date" },
                    end_date: { type: "string", format: "date" },
                    status: {
                      type: "string",
                      enum: ["Planning", "Active", "On Hold", "Completed", "Cancelled"]
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "✅ Project updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      project: { $ref: "#/components/schemas/Project" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Manager/Admin access required" },
            404: { description: "❌ Project not found" }
          }
        },
        delete: {
          tags: ["📁 Project Management"],
          summary: "Archive Project",
          description: "Manager/Admin endpoint for project removal",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          responses: {
            204: { description: "✅ Project archived successfully" },
            403: { description: "❌ Manager/Admin access required" },
            404: { description: "❌ Project not found" }
          }
        }
      },
      "/api/projects/{projectId}/members": {
        get: {
          tags: ["👥 Team Management"],
          summary: "Get Project Team Members",
          description: "Retrieve all members of a specific project",
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Project members retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            },
            404: { description: "❌ Project not found" }
          }
        },
        post: {
          tags: ["👥 Team Management"],
          summary: "Add Team Member to Project",
          description: "Manager/Admin endpoint for team member assignment",
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["userId"],
                  properties: {
                    userId: { 
                      type: "string", 
                      format: "uuid",
                      description: "User ID to add to project"
                    }
                  }
                },
                example: {
                  userId: "123e4567-e89b-12d3-a456-426614174000"
                }
              }
            }
          },
          responses: {
            201: {
              description: "✅ Team member added successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      member: { $ref: "#/components/schemas/ProjectMember" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Manager/Admin access required" },
            404: { description: "❌ Project or user not found" }
          }
        }
      },
      "/api/projects/{projectId}/members/{userId}": {
        delete: {
          tags: ["👥 Team Management"],
          summary: "Remove Team Member from Project",
          description: "Manager/Admin endpoint for team member removal",
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            },
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "User ID to remove"
            }
          ],
          responses: {
            200: {
              description: "✅ Team member removed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Manager/Admin access required" },
            404: { description: "❌ Project or user not found" }
          }
        }
      },
      "/api/projects/with-members": {
        get: {
          tags: ["📁 Project Management"],
          summary: "Get Projects with Team Members",
          description: "Retrieve all projects including their team members",
          responses: {
            200: {
              description: "✅ Projects with members retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        project: { $ref: "#/components/schemas/Project" },
                        members: {
                          type: "array",
                          items: { $ref: "#/components/schemas/User" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tasks": {
        get: {
          tags: ["✅ Task Management"],
          summary: "Get Tasks (Role-Based)",
          description: "Retrieve tasks with role-based filtering (User: own tasks, Manager/Admin: all tasks)",
          responses: {
            200: {
              description: "✅ Tasks retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ["✅ Task Management"],
          summary: "Create Enterprise Task",
          description: "Manager/Admin endpoint for task creation and assignment",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["title"],
                  properties: {
                    title: { 
                      type: "string",
                      minLength: 2,
                      maxLength: 300,
                      description: "Task title"
                    },
                    description: { 
                      type: "string",
                      maxLength: 2000,
                      description: "Task description"
                    },
                    priority: {
                      type: "string",
                      enum: ["Low", "Medium", "High", "Critical"],
                      default: "Medium",
                      description: "Task priority"
                    },
                    due_date: { 
                      type: "string",
                      format: "date",
                      description: "Task due date (YYYY-MM-DD)"
                    },
                    assigned_user_id: { 
                      type: "string", 
                      format: "uuid",
                      nullable: true,
                      description: "Assigned user ID"
                    },
                    project_id: { 
                      type: "string", 
                      format: "uuid",
                      nullable: true,
                      description: "Associated project ID"
                    }
                  }
                },
                example: {
                  title: "Implement Dashboard Analytics",
                  description: "Create real-time analytics dashboard",
                  priority: "High",
                  due_date: "2024-03-15",
                  assigned_user_id: "123e4567-e89b-12d3-a456-426614174000",
                  project_id: "456e7890-e89b-12d3-a456-426614174111"
                }
              }
            }
          },
          responses: {
            201: {
              description: "✅ Task created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      task: { $ref: "#/components/schemas/Task" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Manager/Admin access required" }
          }
        }
      },
      "/api/tasks/{id}": {
        get: {
          tags: ["✅ Task Management"],
          summary: "Get Task Details",
          description: "Retrieve specific task information",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Task retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task"
                  }
                }
              }
            },
            404: { description: "❌ Task not found" }
          }
        },
        put: {
          tags: ["✅ Task Management"],
          summary: "Update Task Status",
          description: `
🚨 **USER ROLE ONLY** 

This endpoint is exclusively for users with "User" role to update their assigned task status.

**Important Notes:**
- Only "User" role can access this endpoint
- Only "status" field can be updated
- Manager/Admin roles cannot use this endpoint
- Users can only update tasks assigned to them
          `,
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  properties: {
                    status: {
                      type: "string",
                      enum: ["Pending", "In Progress", "Completed"],
                      description: "New task status"
                    }
                  }
                },
                example: {
                  status: "Completed"
                }
              }
            }
          },
          responses: {
            200: {
              description: "✅ Task status updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      task: { $ref: "#/components/schemas/Task" }
                    }
                  }
                }
              }
            },
            403: { description: "❌ User role required or task not assigned to user" },
            404: { description: "❌ Task not found" }
          }
        },
        delete: {
          tags: ["✅ Task Management"],
          summary: "Remove Task",
          description: "Manager/Admin endpoint for task removal",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task ID"
            }
          ],
          responses: {
            204: { description: "✅ Task removed successfully" },
            403: { description: "❌ Manager/Admin access required" },
            404: { description: "❌ Task not found" }
          }
        }
      },
      "/api/comments": {
        post: {
          tags: ["💬 Collaboration"],
          summary: "Add Task Comment",
          description: "Add comment to task for team collaboration",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  required: ["task_id", "comment_text"],
                  properties: {
                    task_id: { 
                      type: "string", 
                      format: "uuid",
                      description: "Task ID to comment on"
                    },
                    comment_text: { 
                      type: "string",
                      maxLength: 1000,
                      description: "Comment content"
                    }
                  }
                },
                example: {
                  task_id: "789e0123-e89b-12d3-a456-426614174222",
                  comment_text: "Task completed successfully. Ready for review."
                }
              }
            }
          },
          responses: {
            201: {
              description: "✅ Comment added successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      comment: { $ref: "#/components/schemas/Comment" }
                    }
                  }
                }
              }
            },
            404: { description: "❌ Task not found" }
          }
        }
      },
      "/api/comments/{taskId}": {
        get: {
          tags: ["💬 Collaboration"],
          summary: "Get Task Comments",
          description: "Retrieve all comments for a specific task",
          parameters: [
            {
              name: "taskId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Comments retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Comment" }
                  }
                }
              }
            },
            404: { description: "❌ Task not found" }
          }
        }
      },
      "/api/dashboard/user": {
        get: {
          tags: ["📊 Analytics"],
          summary: "Personal Dashboard",
          description: "User dashboard with personal productivity metrics",
          responses: {
            200: {
              description: "✅ Dashboard data retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      assignedTasks: {
                        type: "integer",
                        description: "Total tasks assigned to user"
                      },
                      completedTasks: {
                        type: "integer",
                        description: "Tasks completed by user"
                      },
                      pendingTasks: {
                        type: "integer",
                        description: "Tasks pending completion"
                      },
                      productivityScore: {
                        type: "number",
                        description: "Personal productivity score (0-100)"
                      },
                      recentActivity: {
                        type: "array",
                        description: "Recent user activity"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/dashboard/manager": {
        get: {
          tags: ["📊 Analytics"],
          summary: "Manager Dashboard",
          description: "Manager/Admin dashboard with team performance metrics",
          responses: {
            200: {
              description: "✅ Dashboard data retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      teamSize: {
                        type: "integer",
                        description: "Total team members"
                      },
                      activeProjects: {
                        type: "integer",
                        description: "Active projects count"
                      },
                      teamProductivity: {
                        type: "number",
                        description: "Team productivity score (0-100)"
                      },
                      taskCompletionRate: {
                        type: "number",
                        description: "Task completion percentage"
                      },
                      topPerformers: {
                        type: "array",
                        description: "Top performing team members"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/performance/task/{taskId}": {
        get: {
          tags: ["📈 Performance Analytics"],
          summary: "Task Performance Metrics",
          description: "Get detailed performance metrics for specific task (Task Creator/Project Creator/Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "taskId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Task performance data retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      task: { $ref: "#/components/schemas/Task" },
                      timeToComplete: {
                        type: "number",
                        description: "Time taken to complete (hours)"
                      },
                      efficiency: {
                        type: "number",
                        description: "Task efficiency score (0-100)"
                      },
                      qualityScore: {
                        type: "number",
                        description: "Task quality score (0-100)"
                      },
                      comments: {
                        type: "integer",
                        description: "Number of comments"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Access denied - insufficient permissions" },
            404: { description: "❌ Task not found" }
          }
        }
      },
      "/api/performance/project/{projectId}": {
        get: {
          tags: ["📈 Performance Analytics"],
          summary: "Project Team Performance",
          description: "Get comprehensive team performance metrics for project (Project Creator/Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Project performance data retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      project: { $ref: "#/components/schemas/Project" },
                      teamPerformance: {
                        type: "array",
                        description: "Individual team member performance"
                      },
                      overallEfficiency: {
                        type: "number",
                        description: "Overall team efficiency (0-100)"
                      },
                      taskCompletionRate: {
                        type: "number",
                        description: "Project task completion rate (%)"
                      },
                      collaborationScore: {
                        type: "number",
                        description: "Team collaboration score (0-100)"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Access denied - insufficient permissions" },
            404: { description: "❌ Project not found" }
          }
        }
      },
      "/api/performance/user/{userId}": {
        get: {
          tags: ["📈 Performance Analytics"],
          summary: "User Performance Analytics",
          description: "Get detailed performance metrics for user (Self/Project Creator/Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "User ID"
            },
            {
              name: "projectId",
              in: "query",
              required: false,
              schema: { type: "string", format: "uuid" },
              description: "Optional project ID for project-specific metrics"
            }
          ],
          responses: {
            200: {
              description: "✅ User performance data retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                      totalTasks: {
                        type: "integer",
                        description: "Total tasks assigned"
                      },
                      completedTasks: {
                        type: "integer",
                        description: "Tasks completed"
                      },
                      averageCompletionTime: {
                        type: "number",
                        description: "Average time to complete tasks (hours)"
                      },
                      qualityRating: {
                        type: "number",
                        description: "Overall quality rating (0-100)"
                      },
                      productivityTrend: {
                        type: "array",
                        description: "Productivity trend over time"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Access denied - insufficient permissions" },
            404: { description: "❌ User not found" }
          }
        }
      },
      "/api/performance/team/{projectId}": {
        get: {
          tags: ["📈 Performance Analytics"],
          summary: "Team Comparison Metrics",
          description: "Get comparative team performance analysis (Project Creator/Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Team comparison data retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      project: { $ref: "#/components/schemas/Project" },
                      teamMembers: {
                        type: "array",
                        description: "Team member performance comparison"
                      },
                      topPerformer: {
                        type: "object",
                        description: "Best performing team member"
                      },
                      collaborationMetrics: {
                        type: "object",
                        description: "Team collaboration analysis"
                      },
                      efficiencyRanking: {
                        type: "array",
                        description: "Team efficiency ranking"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Access denied - insufficient permissions" },
            404: { description: "❌ Project not found" }
          }
        }
      },
      "/api/performance/trends/{projectId}": {
        get: {
          tags: ["📈 Performance Analytics"],
          summary: "Performance Trends Analysis",
          description: "Get performance trends and analytics over time (Project Creator/Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            },
            {
              name: "days",
              in: "query",
              required: false,
              schema: { type: "integer", default: 30 },
              description: "Number of days for trend analysis"
            }
          ],
          responses: {
            200: {
              description: "✅ Performance trends retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      project: { $ref: "#/components/schemas/Project" },
                      timeRange: {
                        type: "string",
                        description: "Analysis time range"
                      },
                      productivityTrend: {
                        type: "array",
                        description: "Productivity trend data"
                      },
                      taskCompletionTrend: {
                        type: "array",
                        description: "Task completion trend"
                      },
                      teamEfficiencyTrend: {
                        type: "array",
                        description: "Team efficiency trend"
                      },
                      predictions: {
                        type: "object",
                        description: "Performance predictions"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Access denied - insufficient permissions" },
            404: { description: "❌ Project not found" }
          }
        }
      },
      "/api/performance/collaboration/{projectId}": {
        get: {
          tags: ["📈 Performance Analytics"],
          summary: "Collaboration Metrics",
          description: "Get detailed collaboration and communication metrics (Project Creator/Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project ID"
            }
          ],
          responses: {
            200: {
              description: "✅ Collaboration metrics retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      project: { $ref: "#/components/schemas/Project" },
                      collaborationScore: {
                        type: "number",
                        description: "Overall collaboration score (0-100)"
                      },
                      communicationFrequency: {
                        type: "object",
                        description: "Communication frequency analysis"
                      },
                      teamEngagement: {
                        type: "number",
                        description: "Team engagement level (0-100)"
                      },
                      commentAnalysis: {
                        type: "object",
                        description: "Comment and discussion analysis"
                      },
                      collaborationNetwork: {
                        type: "object",
                        description: "Team collaboration network"
                      }
                    }
                  }
                }
              }
            },
            403: { description: "❌ Access denied - insufficient permissions" },
            404: { description: "❌ Project not found" }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

// Generate and export Swagger specification
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;