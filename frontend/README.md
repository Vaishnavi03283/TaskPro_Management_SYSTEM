# Task & Project Management System - Frontend

A modern, production-ready React frontend for task and project management with role-based access control, real-time dashboards, and comprehensive user management.

## Frontend Overview

This frontend application provides a complete task and project management interface with three distinct user roles (User, Manager, Admin), featuring secure JWT authentication, responsive design, and advanced analytics dashboards.

## Tech Stack

- **Framework**: React 18.2.0 with Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2
- **State Management**: React Context API
- **Notifications**: React Toastify 10.0.6
- **Icons**: Lucide React 0.577.0
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Folder Structure

```
src/
components/           # Reusable UI components
  |- Navbar.jsx      # Navigation bar with user info
  |- Sidebar.jsx     # Main navigation sidebar
  |- ProtectedRoute.jsx # Authentication wrapper
  |- RoleGuard.jsx   # Role-based access control
  |- Performance.jsx # Analytics component
  |- *.css          # Component-specific styles

context/              # Global state management
  |- AuthContext.jsx # Authentication state & role management

pages/               # Page components
  |- auth/          # Authentication pages
    |- Login.jsx
    |- Register.jsx
  |- dashboard/     # Role-specific dashboards
    |- UserDashboard.jsx
    |- ManagerDashboard.jsx
  |- admin/         # Admin-only pages
    |- AdminDashboard.jsx
    |- UserManagement.jsx
  |- projects/      # Project management
    |- ProjectList.jsx
    |- CreateProject.jsx
    |- ProjectDetails.jsx
    |- EditProject.jsx
  |- tasks/         # Task management
    |- TaskList.jsx
    |- CreateTask.jsx
    |- TaskDetails.jsx
    |- EditTask.jsx
    |- TasksManager.jsx
  |- home/          # Landing page
    |- Home.jsx

services/            # API layer and utilities
  |- api.js         # Complete API integration (31 endpoints)
  |- dateFormatter.js # Date formatting utilities

styles/              # Global styles
  |- common.css     # Design system & base styles
  |- index.css      # Global resets
  |- App.css        # App-specific styles
```

## UI Features

### Authentication UI
- **Login Form**: Secure email/password authentication with validation
- **Registration Form**: User signup with role selection
- **Protected Routes**: Automatic redirection based on authentication status
- **Token Management**: Automatic token refresh and logout on expiration

### Dashboard
- **User Dashboard**: Personal task statistics, assigned projects, completion metrics
- **Manager Dashboard**: Project overview, team performance, task distribution
- **Admin Dashboard**: System-wide statistics, user management, analytics

### Task & Project UI
- **Task Management**: Full CRUD operations with status updates, priority levels
- **Project Management**: Create, edit, delete projects with member assignment
- **Task Details**: Comprehensive task view with comments and performance metrics
- **Task Assignment**: User selection and project association

### Role-based UI Rendering
- **User Role**: View assigned tasks, update status, add comments
- **Manager Role**: Create projects/tasks, assign users, track progress
- **Admin Role**: User management, system statistics, role updates

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001/api
```

### Available Environment Variables
- `VITE_API_URL`: Backend API base URL (required)

## API Integration

The frontend integrates with a comprehensive REST API covering:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/user-role` - Update user role (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)

### Projects & Tasks
- Complete CRUD operations for projects and tasks
- Member management and task assignment
- Status updates and priority management

### Analytics & Performance
- Dashboard statistics for all roles
- Performance metrics and team analytics
- System usage tracking (Admin)

## Build & Deployment

### Production Build
```bash
npm run build
```
Build files will be generated in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deployment Notes
- Ensure `VITE_API_URL` is set to production backend URL
- Static hosting compatible (Vercel, Netlify, GitHub Pages)
- No server-side rendering required
- All routes handled by React Router

## UI/UX Highlights

### Design System
- **Custom CSS Architecture**: No framework dependencies (Bootstrap, Tailwind, etc.)
- **Design Tokens**: Consistent color palette, typography, and spacing
- **Responsive Design**: Mobile-first approach with breakpoints
- **Component Library**: Reusable UI patterns and components

### User Experience
- **Toast Notifications**: Non-intrusive feedback for all user actions
- **Loading States**: Skeleton loaders and spinners for better perceived performance
- **Error Handling**: Graceful error states with user-friendly messages
- **Accessibility**: Semantic HTML and ARIA attributes

### Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Vite's built-in optimization
- **State Management**: Efficient Context API usage
- **API Caching**: Strategic data fetching and caching

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions by user role
- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: React's built-in XSS mitigation

## Production Readiness

This frontend is production-ready with:
- **Zero Console Statements**: Clean production code
- **Error Boundaries**: Graceful error handling
- **Optimized Build**: Minified and compressed assets
- **Environment Configuration**: Flexible deployment options
- **Comprehensive Testing**: All major functionality covered
- **Security Best Practices**: Authentication and authorization implemented

## License

This project is part of the Task & Project Management System.
