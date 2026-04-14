# Task & Project Management System

A comprehensive, enterprise-grade web application designed to help teams organize, assign, and track project tasks efficiently. This system features robust **Role-Based Access Control (RBAC)** and secure authentication, engineered strictly according to **SOLID principles** and **Clean Architecture** for maximum scalability and maintainability.


## 📋 Business Requirements Implementation

This system successfully implements the complete **Business Requirements Document (BRD) v1.0** including:

* **Three-tier RBAC**: Granular permissions for Admin, Project Manager, and User roles.
* **Project Lifecycle**: End-to-end management from planning to completion with timeline tracking.
* **Task Orchestration**: Assignment, status tracking, and priority-level management.
* **Collaboration Hub**: Integrated comment system for seamless task communication.
* **Insights Engine**: Role-specific dashboards providing actionable performance metrics.
* **Security First**: JWT-based secure authentication with Bcrypt password encryption.

---

## ✨ Implemented Features

### 🔐 Authentication & Security
* **Secure Onboarding**: User registration and login with secure password hashing.
* **Stateless Auth**: JWT Token implementation with automated expiration management.
* **Middleware Guard**: Custom Role-Based Authorization (RBAC) middleware protecting sensitive routes.
* **Data Safety**: Industry-standard encryption using `bcryptjs`.

### 🏗️ Project Management
* **Lifecycle Control**: Create and manage projects with metadata (Name, Timeline, Status).
* **State Tracking**: Visual health indicators (Planned / Active / Completed).
* **Resource Allocation**: Assign specific team members to dedicated project workstreams.
* **Monitoring**: Real-time project progress tracking.

### ✅ Task Management
* **Granular Tasks**: Detailed task creation with priority levels (**Low / Medium / High**).
* **State Management**: Flow tasks through **Pending**, **In Progress**, and **Completed**.
* **Deadline Tracking**: Integrated due-date management to ensure project velocity.
* **Direct Assignment**: Link specific tasks to individual team members.

### 💬 Collaborative Comment System
* **Attributed Threads**: Comments linked directly to tasks and specific users.
* **Audit Trail**: Timestamp tracking for all collaborative interactions and history.

### 📊 Dashboard Analytics
* **User**: Personal view of total, completed, and pending tasks.
* **Manager**: High-level view of project progress and team performance metrics.
* **Admin**: System-wide statistics and comprehensive user management.

---

## 👥 User Roles & Permissions

### **User (Team Member)**
* Register and login to the system.
* View assigned tasks only (privacy-focused).
* Update task status (Pending, In Progress, Completed).
* Add comments to assigned tasks.
* View personal dashboard with task metrics.

### **Project Manager**
* Create and manage entire projects.
* Add and manage users within projects.
* Create tasks and assign them to team members.
* Track project progress and team performance.
* View manager dashboard with project insights.

### **Admin**
* Manage all user accounts and roles.
* Monitor system-wide usage and statistics.
* View overall system performance.
* Manage projects if administrative intervention is required.
* Access to full comprehensive admin dashboard.

---

## 🛠️ Technical Architecture

### 📐 SOLID Principles Implementation
* **S**ingle Responsibility: Each service handles exactly one business domain.
* **O**pen/Closed: System is extensible via interfaces without altering core logic.
* **L**iskov Substitution: Proper inheritance ensures interchangeable components.
* **I**nterface Segregation: Focused, minimal interfaces for specific client needs.
* **D**ependency Inversion: High-level modules depend on abstractions, not concretions.

### 📂 Clean Architecture Layers
```text
Frontend (React + Vite)  <--->  Controllers  <--->  Services  <--->  Repositories  <--->  Database (PostgreSQL)
                            |              |              |                    |
                        JWT Auth        Business Logic   Data Access        PostgreSQL:5432
                        Validation      SOLID Design    SQL Queries        Port: 5001
```

### 🧩 Design Patterns
* **Repository Pattern**: Data access abstraction for clean separation.
* **Service Layer**: Encapsulation of core business logic.
* **Controller Pattern**: Standardized request/response handling.
* **Middleware Pattern**: Pluggable authentication and authorization layers.

---

## 💻 Tech Stack

### Frontend
* **React 18 & Vite**: Lightning-fast UI rendering and development.
* **React Router DOM**: Declarative routing for SPA navigation.
* **Axios**: Optimized HTTP client for API interaction.
* **Lucide React**: Modern, lightweight iconography.
* **React Toastify**: Elegant user notifications.
* **Custom CSS**: No frameworks used (Pure CSS Modules/Custom styling as per BRD).

### Backend
* **Node.js & Express.js**: High-performance asynchronous API framework.
* **PostgreSQL**: Relational data integrity for complex project mapping.
* **JWT & bcryptjs**: Secure token-based auth and password hashing.
* **Morgan**: Request logging for development and auditing.
* **Swagger/OpenAPI**: Standardized, interactive API documentation.

### Database Schema
* **Users**: id, name, email, password, role, created_at.
* **Projects**: id, name, description, start_date, end_date, status, created_by.
* **Tasks**: id, title, description, priority, status, due_date, assigned_user, project_id.
* **Comments**: id, user_id, task_id, comment_text, created_at.
* **Project_Members**: project_id, user_id (Many-to-Many mapping).

---

## 📂 Project Structure

```bash
.
├── backend/
│   ├── config/          # Database & environment configuration
│   ├── controllers/     # Request handlers (8 controllers)
│   ├── middleware/      # Auth & Error handling
│   ├── models/          # Data models (5 models)
│   ├── repositories/    # Data access layer (DAL)
│   ├── routes/          # API endpoints (9 route files)
│   ├── services/        # Business logic layer (7 services)
│   ├── docs/            # Swagger configuration
│   └── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state management
│   │   ├── pages/       # 23 Specialized page components
│   │   ├── services/    # API service layer
│   │   └── styles/      # Custom CSS architecture
│   └── vite.config.js   # Frontend build config
└── docker-compose.yml   # Multi-container orchestration
```

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js 18+
* PostgreSQL 12+
* Git

### 1. Clone Repository
```bash
git clone https://github.com/Vaishnavi-Jadhav/task-project-management-system.git
cd task-project-management-system
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb task_management_db
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Setup

### Using Docker Compose
```bash
# Build and start all services (Backend, Frontend, DB)
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

---

## 🛡️ Security Implementation

* **JWT Authentication**: Token-based security with expiration.
* **Bcrypt Hashing**: One-way encryption for sensitive passwords.
* **RBAC Middleware**: Strict role validation on every API request.
* **Data Protection**: Parameterized queries to prevent SQL Injection and CORS configuration for domain safety.

---

## 📈 Development Process Compliance

* **Tech Stack**: Fully compliant with React+Vite/Node/Postgres requirement.
* **Architecture**: Strict adherence to SOLID and Repository patterns.
* **UI Constraints**: Zero external CSS frameworks; 100% custom styling.
* **Documentation**: Automated Swagger UI for API testing.

---

## ✍️ Author

**Vaishnavi Jadhav**

*Full-Stack Developer*

*Specialized in React, Node.js, and PostgreSQL.*

*SOLID Principles and Clean Architecture advocate.*

*Focused on building scalable, production-ready solutions.*
