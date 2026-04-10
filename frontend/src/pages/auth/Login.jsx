// Login page component that handles user authentication with email and password validation
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI, showErrorToast, showSuccessToast } from '../../services/api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        showErrorToast('Please fill all fields');
        setLoading(false);
        return;
      }

      const response = await authAPI.login(email, password);
      
      if (response && response.token && response.user) {
        login(response.user, response.token);
        showSuccessToast('Login successful!');

        // Redirect based on role
        const userRole = response.user.role?.toLowerCase();
        // All users go to dashboard, role-based routing handles the rest
        navigate('/dashboard');
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Auth Header */}
      <div className="auth-header">
        <div className="auth-logo">TaskPro</div>
        <div className="auth-home-link" onClick={() => navigate('/')}>
          Home
        </div>
      </div>

      {/* Auth Content */}
      <div className="auth-content">
        <div className="auth-card">
        <h1>Welcome back </h1>
        <p className="auth-subtitle">Manage your tasks efficiently with TaskPro Editionary Workspace </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
