// Manager dashboard component that displays project overview, team statistics, and task management insights
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, projectAPI, taskAPI, showErrorToast } from '../../services/api';
import { Folder, ClipboardList, CheckCircle, Clock, ArrowRight, Plus } from "lucide-react";
import './Dashboard.css';

const ManagerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashboardData, projects, tasks] = await Promise.all([
        dashboardAPI.getManagerDashboard(),
        projectAPI.getProjects(),
        taskAPI.getTasks()
      ]);

      const actualTaskStats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status?.toLowerCase() === 'completed').length,
        pendingTasks: tasks.filter(task => task.status?.toLowerCase() === 'pending').length,
        inProgressTasks: tasks.filter(task => task.status?.toLowerCase() === 'in progress').length
      };

      const mergedData = {
        ...dashboardData,
        ...actualTaskStats
      };


      setDashboard(mergedData);
      setProjects(projects || []);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onFocus = () => fetchDashboard();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Manager Dashboard</h1>
      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.75rem' }}>
        Operational overview of your projects and team performance.
      </p>

      <div className="cards-grid">
        <div className="dashboard-card">
          <div className="card-icon"><Folder size={20} /></div>
          <div className="card-content">
            <h3>Total Projects</h3>
            <p className="card-number">{dashboard?.totalProjects || projects.length || 0}</p>
            <small className="card-subtitle">Active projects</small>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><ClipboardList size={20} /></div>
          <div className="card-content">
            <h3>Total Tasks</h3>
            <p className="card-number">{dashboard?.totalTasks || 0}</p>
            <small className="card-subtitle">All assigned tasks</small>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><CheckCircle size={20} /></div>
          <div className="card-content">
            <h3>Completed</h3>
            <p className="card-number">{dashboard?.completedTasks || 0}</p>
            <small className="card-subtitle">Tasks finished</small>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><Clock size={20} /></div>
          <div className="card-content">
            <h3>In Progress</h3>
            <p className="card-number">{dashboard?.inProgressTasks || 0}</p>
            <small className="card-subtitle">Currently active</small>
          </div>
        </div>
      </div>

      {/* Manager's Assigned Projects Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Assigned Projects</h2>
          <div className="section-actions">
            <Link to="/create-project" className="btn-primary">
              <Plus size={16} />
              New Project
            </Link>
            <Link to="/projects" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p style={{ marginBottom: '1rem' }}>🗂 You haven't been assigned to any projects yet.</p>
            <Link to="/create-project" className="btn-primary">
              <Plus size={16} />
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="projects-grid-dashboard">
            {projects.slice(0, 3).map(project => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="project-card-dashboard"
              >
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  <ArrowRight size={16} className="card-arrow" />
                </div>
                <p className="project-description">
                  {project.description}
                </p>
                <div className="project-meta-dashboard">
                  <span className={`project-role-badge ${project.is_owner ? 'owner' : 'member'}`}>
                    {project.is_owner ? 'Owner' : 'Member'}
                  </span>
                  <span className="project-date">
                    {project.start_date && new Date(project.start_date).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
            {projects.length > 3 && (
              <div className="more-projects">
                <Link to="/projects" className="more-projects-link">
                  +{projects.length - 3} more projects
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="empty-state" style={{ marginTop: '2rem' }}>
        <p>👋 Welcome, Manager! Manage your projects and tasks from the sidebar.</p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
