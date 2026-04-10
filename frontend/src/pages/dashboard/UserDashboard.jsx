// User dashboard component that displays personal task assignments, project participation, and activity statistics
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, projectAPI, taskAPI, showErrorToast } from '../../services/api';
import { ClipboardList, CheckCircle, Clock, Activity, ArrowRight, Plus } from "lucide-react";
import './Dashboard.css';

const UserDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashboardData, projects, tasks] = await Promise.all([
        dashboardAPI.getUserDashboard(),
        projectAPI.getProjects(),
        taskAPI.getTasks()
      ]);

      const actualCounts = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status?.toLowerCase() === 'completed').length,
        pendingTasks: tasks.filter(task => task.status?.toLowerCase() === 'pending').length,
        inProgressTasks: tasks.filter(task => task.status?.toLowerCase() === 'in progress').length
      };


      const mergedData = {
        ...dashboardData,
        ...actualCounts
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
      {/* Header */}
      <h1>Welcome back.</h1>
      <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 2rem', fontFamily: 'Sora, sans-serif' }}>
        You have {dashboard?.pendingTasks || 0} tasks requiring immediate focus today.
      </p>


      {/* Stats Strip */}
      <div className="cards-grid">
        <div className="dashboard-card">
          <div className="card-icon"><ClipboardList size={20} /></div>
          <div className="card-content">
            <h3>Total Tasks</h3>
            <p className="card-number">{dashboard?.totalTasks || dashboard?.total_tasks || dashboard?.tasks?.length || 0}</p>
            <small className="card-subtitle">Total tasks</small>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><Clock size={20} /></div>
          <div className="card-content">
            <h3>Pending</h3>
            <p className="card-number">{dashboard?.pendingTasks || dashboard?.pending_tasks || dashboard?.pending || 0}</p>
            <small className="card-subtitle">Pending</small>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><Activity size={20} /></div>
          <div className="card-content">
            <h3>In Progress</h3>
            <p className="card-number">{dashboard?.inProgressTasks || dashboard?.in_progress_tasks || dashboard?.inProgress || 0}</p>
            <small className="card-subtitle">In Progress</small>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon"><CheckCircle size={20} /></div>
          <div className="card-content">
            <h3>Completed</h3>
            <p className="card-number">{dashboard?.completedTasks || dashboard?.completed_tasks || dashboard?.completed || 0}</p>
            <small className="card-subtitle">Completed</small>
          </div>
        </div>
      </div>

      {/* Active Projects Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Active Projects</h2>
          <Link to="/projects" className="view-all-link">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p>🗂 You haven't been assigned to any projects yet.</p>
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
        <p>👋 Welcome! View your tasks and assigned projects above.</p>
      </div>
    </div>
  );
};

export default UserDashboard;
