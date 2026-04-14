// Sidebar navigation component that provides role-based navigation links for different user types
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  Plus,
  Users,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { hasRole, hasAnyRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* TaskPro at top of sidebar */}
      <div className="sidebar-taskpro">
        <div className="sidebar-taskpro-logo" onClick={() => navigate('/')}>
          ✦ TaskPro
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {/* Common Navigation */}
        <div className="nav-section">
          <p className="nav-title">Main</p>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </div>
        
        {hasRole("User") && (
          <div className="nav-section">
            <p className="nav-title">My Tasks</p>
            <Link
              to="/tasks"
              className={`nav-link ${isActive("/tasks") ? "active" : ""}`}
            >
              <CheckSquare size={18} />
              My Tasks
            </Link>
          </div>
        )}

        {hasRole("Manager") && (
          <div className="nav-section">
            <p className="nav-title">Management</p>
            <Link
              to="/projects"
              className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            >
              <Folder size={18} />
              Projects
            </Link>
            <Link
              to="/tasks"
              className={`nav-link ${isActive("/tasks") ? "active" : ""}`}
            > <CheckSquare size={18} />
                    All Tasks
            </Link>
            <Link
              to="/create-project"
              className={`nav-link ${isActive("/create-project") ? "active" : ""}`}
            >
              <Plus size={18} />
              New Project
            </Link>
            <Link
              to="/create-task"
              className={`nav-link ${isActive("/create-task") ? "active" : ""}`}
            >
              <Plus size={18} />
              New Task
            </Link>
          </div>
        )}

        {hasRole("Admin") && (
          <div className="nav-section">
            <p className="nav-title">Management</p>
            <Link
              to="/projects"
              className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            >
              <Folder size={18} />
              Projects
            </Link>
            <Link
              to="/tasks-manager"
              className={`nav-link ${isActive("/tasks-manager") ? "active" : ""}`}
            > <CheckSquare size={18} />
                    All Tasks
            </Link>
            <Link
              to="/create-project"
              className={`nav-link ${isActive("/create-project") ? "active" : ""}`}
            >
              <Plus size={18} />
              New Project
            </Link>
            <Link
              to="/create-task"
              className={`nav-link ${isActive("/create-task") ? "active" : ""}`}
            >
              <Plus size={18} />
              New Task
            </Link>
          </div>
        )}

        {hasRole("Admin") && (
          <div className="nav-section">
            <p className="nav-title">Admin</p>
            <Link
              to="/admin/users"
              className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}
            >
               <Users size={18} />
                User Management
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
