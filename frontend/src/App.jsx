// Main application component that handles routing, authentication, and layout for the task management system
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import UserDashboard from './pages/dashboard/UserDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';


import TaskList from './pages/tasks/TaskList';
import TaskDetails from './pages/tasks/TaskDetails';
import CreateTask from './pages/tasks/CreateTask';
import TasksManager from './pages/tasks/TasksManager';
import EditTask from './pages/tasks/EditTask';


import ProjectList from './pages/projects/ProjectList';
import CreateProject from './pages/projects/CreateProject';
import ProjectDetails from './pages/projects/ProjectDetails';
import EditProject from './pages/projects/EditProject';


import UserManagement from './pages/admin/UserManagement';
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role?.toLowerCase() === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role?.toLowerCase() === 'manager') {
    return <ManagerDashboard />;
  }

  return <UserDashboard />;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const isHomeRoute = location.pathname === '/';

  return (
    <div className={`app-layout ${isAuthRoute ? 'auth-layout' : ''} ${isHomeRoute ? 'home-layout' : ''}`}>
      {!isHomeRoute && <Navbar />}
      <div className="main-content">
        {!isHomeRoute && <Sidebar />}
        <div className="page-content">
          <Routes>
            {}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />

            {}
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['User', 'Manager', 'Admin']}>
                    <TaskList />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/task/:id" 
              element={
                <ProtectedRoute>
                  <TaskDetails />
                </ProtectedRoute>
              } 
            />

            {}
            <Route 
              path="/tasks-manager" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['Manager', 'Admin']}>
                    <TasksManager />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-task" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['Manager', 'Admin']}>
                    <CreateTask />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-task/:id" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['Manager']}>
                    <EditTask />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />

            {}
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['User', 'Manager', 'Admin']}>
                    <ProjectList />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/project/:id" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['User', 'Manager', 'Admin']}>
                    <ProjectDetails />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-project" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['Manager', 'Admin']}>
                    <CreateProject />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-project/:id" 
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              } 
            />

            {}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['Admin']}>
                    <UserManagement />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />

            {/* Fallback Routes */}
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
