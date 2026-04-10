// Admin dashboard component that provides system-wide statistics, user management, and administrative controls
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, adminAPI, showErrorToast } from '../../services/api';
import { 
  Users, 
  Folder, 
  ClipboardList, 
  CheckCircle, 
  Activity, 
  TrendingUp,
  Clock,
  BarChart3,
  PieChart,
  ArrowRight,
  Download,
  Settings,
  RefreshCw
} from "lucide-react";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardData, usageData] = await Promise.all([
        dashboardAPI.getAdminDashboard(),
        adminAPI.getSystemUsage()
      ]);
      
      const processedStats = {
        ...dashboardData,
        activeUsersToday: dashboardData.activeUsersToday || 
          (dashboardData.recentLogins ? dashboardData.recentLogins.length : 0)
      };
      
      
      setStats(processedStats);
      setUsage(usageData);
    } catch (error) {
      setApiError(true);
      
      const fallbackStats = {
        totalUsers: 0,
        totalProjects: 0,
        totalTasks: 0,
        activeUsersToday: 0,
        completedTasks: 0,
        systemUptime: "0%",
        recentLogins: [],
        projectDistribution: {
          "Active": 0,
          "Completed": 0,
          "Pending": 0
        }
      };
      
      const fallbackUsage = {
        dailyActiveUsers: [],
        weeklyActivity: [],
        taskCompletionRate: 0,
        projectProgress: [],
        userActivity: []
      };
      
      setStats(fallbackStats);
      setUsage(fallbackUsage);
      
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        showErrorToast(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="spinner-large"></div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-header-subtitle">Real-time infrastructure monitoring and operational overview.</p>
        </div>
        <div className="dashboard-header-actions">
          <div className="system-status-bar">
            <span className="status-dot"></span>
            System Stable
          </div>
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <Settings size={14} />
            System Controls
          </button>
        </div>
      </div>

      {/* System Statistics Cards */}
      <div className="stats-section">
        <h2>System Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={22} />
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.totalUsers || 0}</p>
              <span className="stat-label">Registered users</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon projects">
              <Folder size={22} />
            </div>
            <div className="stat-content">
              <h3>Total Projects</h3>
              <p className="stat-number">{stats?.totalProjects || 0}</p>
              <span className="stat-label">Active projects</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon tasks">
              <ClipboardList size={22} />
            </div>
            <div className="stat-content">
              <h3>Total Tasks</h3>
              <p className="stat-number">{stats?.totalTasks || 0}</p>
              <span className="stat-label">All tasks</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active">
              <Activity size={22} />
            </div>
            <div className="stat-content">
              <h3>Active Today</h3>
              <p className="stat-number">
                {stats?.activeUsersToday !== undefined && stats?.activeUsersToday !== null 
                  ? stats.activeUsersToday 
                  : (stats?.recentLogins?.length || 0)}
              </p>
              <span className="stat-label">Users active today</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <CheckCircle size={22} />
            </div>
            <div className="stat-content">
              <h3>Completed Tasks</h3>
              <p className="stat-number">{stats?.completedTasks || 0}</p>
              <span className="stat-label">Tasks finished</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon uptime">
              <TrendingUp size={22} />
            </div>
            <div className="stat-content">
              <h3>System Uptime</h3>
              <p className="stat-number">{stats?.systemUptime || '0%'}</p>
              <span className="stat-label">Availability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="analytics-section">
        <h2>Analytics</h2>
        <div className="analytics-grid">
          {/* Project Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3><PieChart size={18} /> Project Distribution</h3>
            </div>
            <div className="chart-content">
              {stats?.projectDistribution && (
                <div className="distribution-list">
                  {Object.entries(stats.projectDistribution).map(([status, count]) => (
                    <div key={status} className="distribution-item">
                      <span className="status-label">{status}</span>
                      <span className="status-count">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Task Completion Rate */}
          <div className="chart-card">
            <div className="chart-header">
              <h3><BarChart3 size={18} /> Task Completion Rate</h3>
            </div>
            <div className="chart-content">
              <div className="completion-rate">
                <div className="rate-circle">
                  <span className="rate-number">{usage?.taskCompletionRate || 0}%</span>
                </div>
                <p className="rate-description">Overall completion rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-grid">
          {/* Recent Logins */}
          <div className="activity-card">
            <div className="activity-header">
              <h3><Clock size={18} /> Recent User Activity</h3>
              <Link to="/admin/users" className="view-all-link">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="activity-content">
              {stats?.recentLogins?.length > 0 ? (
                <div className="recent-list">
                  {stats.recentLogins.slice(0, 5).map(user => (
                    <div key={user.id} className="recent-item">
                      <div className="recent-item-avatar">{getInitials(user.name)}</div>
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                      <span className="activity-time">
                        {new Date(user.last_login).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Progress */}
          <div className="activity-card">
            <div className="activity-header">
              <h3><Folder size={18} /> Project Progress</h3>
              <Link to="/projects" className="view-all-link">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="activity-content">
              {usage?.projectProgress?.length > 0 ? (
                <div className="progress-list">
                  {usage.projectProgress.slice(0, 5).map((project, index) => (
                    <div key={index} className="progress-item">
                      <div className="project-info">
                        <span className="project-name">{project.projectName}</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="progress-text">
                        {project.completedTasks}/{project.totalTasks} ({project.progressPercentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No projects found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/users" className="action-card">
            <div className="action-card-icon">
              <Users size={24} />
            </div>
            <h3>User Management</h3>
            <p>Manage user roles and permissions</p>
          </Link>
          
          <Link to="/projects" className="action-card">
            <div className="action-card-icon">
              <Folder size={24} />
            </div>
            <h3>View Projects</h3>
            <p>Monitor all project activities</p>
          </Link>
          
          <Link to="/tasks-manager" className="action-card">
            <div className="action-card-icon">
              <ClipboardList size={24} />
            </div>
            <h3>Task Management</h3>
            <p>Oversee task assignments and progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
