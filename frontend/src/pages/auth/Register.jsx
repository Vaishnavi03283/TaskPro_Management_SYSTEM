// User registration page component that handles new account creation with form validation
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI, showErrorToast, showSuccessToast } from '../../services/api';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        showErrorToast('Please fill all fields');
        setLoading(false);
        return;
      }

      if (!email.includes('@') || !email.includes('.com')) {
        showErrorToast('Please enter a valid email (must include @ and .com)');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        showErrorToast('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        showErrorToast('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      
      // REGISTER API CALLED 
      await authAPI.register(name, email, password, role);
      
      showSuccessToast('Registration successful! Please login to continue.');
      navigate('/login');
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
        <div className="auth-logo">✦TaskPro</div>
        <div className="auth-home-link" onClick={() => navigate('/')}>
          Home
        </div>
      </div>

      {/* Auth Content */}
      <div className="auth-content">
        <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join the ecosystem to Manage your tasks efficiently</p>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="User">User (Team Member)</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
