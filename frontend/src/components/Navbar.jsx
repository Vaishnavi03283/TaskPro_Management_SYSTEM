// Navigation bar component that displays user info and logout functionality across all pages
import React from 'react';
import { LogOut } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
                <div className="navbar-right">
          {user && (
            <>
              <span className="welcome-text">Welcome,</span> <span className="user-name"><strong>{user.name || user.email}</strong></span>
              <span className="user-role">{user.role}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
