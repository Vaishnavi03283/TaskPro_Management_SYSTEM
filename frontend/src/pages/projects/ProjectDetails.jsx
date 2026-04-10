// Project details page component that displays comprehensive project information, tasks, and team management
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, UserPlus, X, Calendar, MoreHorizontal, BarChart3 } from 'lucide-react';
import { projectAPI, taskAPI, memberAPI, showErrorToast, showSuccessToast } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PerformanceSection from '../../components/Performance';
import './Projects.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [taskView, setTaskView] = useState('Board');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [project, tasks, members] = await Promise.all([
          projectAPI.getProject(id),
          taskAPI.getTasks(),
          memberAPI.getProjectMembers(id),
        ]);

        setProject(project);
        setTasks((tasks || []).filter((t) => String(t.project_id) === String(id)));
        setMembers(members || []);
      } catch (error) {
        showErrorToast(error.message);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, navigate]);

  const summary = useMemo(() => {
    const normalize = (s) => String(s || '').trim().toLowerCase();
    const total = tasks.length;
    const completed = tasks.filter((t) => normalize(t.status) === 'completed').length;
    const pending = tasks.filter((t) => normalize(t.status) === 'pending').length;
    const inProgress = tasks.filter((t) => normalize(t.status) === 'in progress').length;
    return { total, completed, pending, inProgress };
  }, [tasks]);

  const progressPct = useMemo(() => {
    if (!summary.total) return 0;
    return Math.round((summary.completed / summary.total) * 100);
  }, [summary]);

  const fetchAvailableUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await memberAPI.getUsers();
      setAvailableUsers(users);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const addMemberToProject = async (userId) => {
    try {
      await memberAPI.addMemberToProject(id, userId);
      showSuccessToast('Member added successfully');
      const members = await memberAPI.getProjectMembers(id);
      setMembers(members || []);
      return members;
    } catch (error) {
      showErrorToast(error.message);
      throw error;
    }
  };

  const removeMemberFromProject = async (userId) => {
    try {
      await memberAPI.removeMemberFromProject(id, userId);
      showSuccessToast('Member removed successfully');

      if (userId === user?.id) {
        showSuccessToast('You have been removed from this project');
        if (isUser) {
          navigate('/dashboard');
        } else {
          navigate('/projects');
        }
      } else {
        const members = await memberAPI.getProjectMembers(id);
        setMembers(members || []);
      }
    } catch (error) {
      showErrorToast(error.message);
      throw error;
    }
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
    setSelectedUserId('');
    fetchAvailableUsers();
  };

  const handleConfirmAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await addMemberToProject(selectedUserId);
      setShowAddMemberModal(false);
      setSelectedUserId('');
    } catch (error) {
      // Error already handled in addMemberToProject
    }
  };

  const handleRemoveMember = async (userId) => {
    const isSelfRemoval = userId === user?.id;
    const confirmMessage = isSelfRemoval
      ? 'Are you sure you want to remove yourself from this project? You will no longer have access to this project.'
      : 'Are you sure you want to remove this member?';

    if (window.confirm(confirmMessage)) {
      try {
        await removeMemberFromProject(userId);
      } catch (error) {
        // Error already handled
      }
    }
  };

  const isManager = user?.role?.toLowerCase() === 'manager' || user?.role?.toLowerCase() === 'admin';
  const isUser = user?.role?.toLowerCase() === 'user';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTaskTagColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return { bg: 'rgba(5,150,105,0.08)', color: '#059669', border: 'rgba(5,150,105,0.2)' };
    if (s === 'in progress') return { bg: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'rgba(37,99,235,0.2)' };
    return { bg: 'rgba(245,158,11,0.08)', color: '#d97706', border: 'rgba(245,158,11,0.2)' };
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="projects-container">
        <div className="empty-state">Project not found</div>
      </div>
    );
  }

  const handleBackToProjects = () => {
    if (isUser) {
      navigate('/dashboard');
    } else {
      navigate('/projects');
    }
  };

  return (
    <div className="projects-container">

      <button className="btn-secondary back-to-projects" onClick={handleBackToProjects}>
        <ArrowLeft size={16} />
        {isUser ? 'Back to Dashboard' : 'Back to Projects'}
      </button>

      {/* Hero Banner */}
      <div className="project-detail-hero">
        <div className="project-detail-hero-badges">
          <span className="hero-phase-badge">
            {project.status || 'Planned'} Phase
          </span>
          {project.end_date && (
            <span className="hero-due-badge">
              <Calendar size={13} />
              Due {new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        <h1>{project.name}</h1>

        <p className="project-description">{project.description}</p>

        <div className="hero-team-row">
          <div className="team-avatars">
            {members.slice(0, 3).map((m, i) => (
              <div key={m.id} className={`team-avatar team-avatar-${i}`}>
                {getInitials(m.name)}
              </div>
            ))}
            {members.length > 3 && (
              <div className="team-avatar team-avatar-more">
                +{members.length - 3}
              </div>
            )}
          </div>
          {isManager && (
            <button onClick={handleAddMember} className="btn-invite">
              <UserPlus size={14} />
              Invite Stakeholder
            </button>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="project-kpi-strip">
        <div className="project-kpi-cell">
          <span className="project-kpi-label">Total Tasks</span>
          <span className="project-kpi-value">{summary.total}</span>
          <span className="project-kpi-badge kpi-badge-blue">+12%</span>
        </div>
        <div className="project-kpi-cell">
          <span className="project-kpi-label">Completed</span>
          <span className="project-kpi-value">{summary.completed}</span>
          <span className="project-kpi-badge kpi-badge-green">{progressPct}%</span>
        </div>
        <div className="project-kpi-cell">
          <span className="project-kpi-label">Pending</span>
          <span className="project-kpi-value">{summary.pending}</span>
          <span className="project-kpi-badge kpi-badge-amber">High priority</span>
        </div>
        <div className="project-kpi-cell">
          <span className="project-kpi-label">In Progress</span>
          <span className="project-kpi-value">{summary.inProgress}</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="project-detail-layout">

        {/* Left: Tasks */}
        <div className="project-detail-main">

          {/* Progress */}
          <div className="project-progress">
            <div className="project-progress-row">
              <div>
                <div className="project-progress-title">Project Completion Velocity</div>
                <div className="project-progress-subtitle">
                  {summary.completed}/{summary.total} tasks completed
                </div>
              </div>
              <div className="project-progress-pct">{progressPct}%</div>
            </div>

            <div className="project-progress-bar">
              <div
                className="project-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="project-progress-legend">
              <span className="legend-item">
                <span className="legend-dot completed" />
                Completed ({summary.completed})
              </span>
              <span className="legend-item">
                <span className="legend-dot inprogress" />
                In Progress ({summary.inProgress})
              </span>
              <span className="legend-item">
                <span className="legend-dot pending" />
                Pending ({summary.pending})
              </span>
            </div>
          </div>

          {/* User Access Information */}
          <div className="user-access-info">
            <div className="user-access-row">
              <strong className="access-label">Your Access:</strong>
              <span className={`access-badge ${project?.is_owner ? 'owner' : 'member'}`}>
                {project?.is_owner ? 'Owner' : 'Member'}
              </span>
            </div>
            <p className="access-description">
              {isUser
                ? 'You can view project details and tasks assigned to you.'
                : isManager
                  ? 'You can manage this project, add/remove members, and create tasks.'
                  : 'You have full administrative access to this project.'
              }
            </p>
          </div>

          {/* Tasks Section */}
          <div>
            <div className="tasks-header">
              <h3 className="tasks-title">
                Project Tasks
              </h3>
              <div className="view-toggle">
                {['List View', 'Board View'].map(v => (
                  <button
                    key={v}
                    onClick={() => setTaskView(v.split(' ')[0])}
                    className={`view-toggle-btn ${taskView === v.split(' ')[0] ? 'active' : ''}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state">
                {isUser
                  ? 'No tasks assigned to you in this project yet.'
                  : 'No tasks in this project yet.'
                }
              </div>
            ) : (
              <div className="task-board-grid">
                {tasks.map((t) => {
                  const tagStyle = getTaskTagColor(t.status);
                  return (
                    <div
                      key={t.id}
                      className="project-card task-card"
                      onClick={() => navigate(`/task/${t.id}`)}
                    >
                      <div className="task-card-header">
                        <span
                          className={`task-tag task-status-${t.status?.toLowerCase() || 'pending'}`}
                        >
                          {t.status || 'Pending'}
                        </span>
                        <button className="task-card-menu" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal size={14} />
                        </button>
                      </div>

                      <div className="project-card-header">
                        <h3>{t.title}</h3>
                        <ArrowRight size={14} className="card-arrow" />
                      </div>

                      <p className="project-description">{t.description}</p>

                      <div className="task-assignee-row">
                        <span className="task-status-text">
                          {t.status?.toLowerCase() === 'in progress' ? 'IN PROGRESS' : t.status?.toUpperCase()}
                        </span>
                        <div className="task-assignee-info">
                          <div className="task-assignee-avatar">{getInitials(t.assigned_user_name || 'U')}</div>
                          <span className="task-assignee-name">
                            {isUser ? 'You' : (t.assigned_user_name || 'Unassigned')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Performance Section */}
          <div id="team-performance-section">
            <PerformanceSection type="project" id={project.id} />
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="project-detail-sidebar">

          {/* Performance Metric */}
          <div className="sidebar-card" style={{ background: 'var(--arch-navy)', borderColor: 'transparent' }}>
            <div className="sidebar-card-title" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <span>Performance Metric</span>
            </div>
            <div className="perf-velocity-display">
              <span className="perf-velocity-pct" style={{ color: '#fff' }}>{progressPct}%</span>
              <span className="perf-velocity-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Project Completion Velocity
              </span>
              <div className="perf-velocity-bar" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div className="perf-velocity-fill" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #60a5fa, #a78bfa)' }} />
              </div>
            </div>
            <button 
              className="btn-view-audit" 
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', marginTop: '1rem' }}
              onClick={() => {
                const element = document.getElementById('team-performance-section');
                if (element) {
                  element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
            >
              <BarChart3 size={14} />
              View Performance Audit
            </button>
          </div>

          {/* Core Team */}
          {isManager && (
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <span>Core Team</span>
                <a className="sidebar-card-link" onClick={handleAddMember} style={{ cursor: 'pointer' }}>View All</a>
              </div>
              {members.length === 0 ? (
                <div className="empty-state" style={{ padding: '1rem', fontSize: '0.8rem' }}>No members yet.</div>
              ) : (
                <div className="members-list">
                  {members.map(member => (
                    <div key={member.id} className="member-item">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', flex: 1 }}>
                        <div className="task-assignee-avatar" style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--arch-blue), var(--arch-accent-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {getInitials(member.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="member-name">{member.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--arch-subtle)', marginBottom: '0.3rem' }}>{member.email}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'space-between' }}>
                            <span className="member-role">{member.role}</span>
                            {isManager && (
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="remove-member-btn"
                                title="Remove member"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleAddMember} className="add-member-btn" style={{ marginTop: '0.5rem' }}>
                <UserPlus size={13} />
                Add Member
              </button>
            </div>
          )}

          {/* Project Info */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">Project Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--arch-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem' }}>Status</span>
                <span className={`project-status ${project.status?.toLowerCase() || 'planned'}`}>{project.status || 'Planned'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--arch-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem' }}>Start</span>
                <span style={{ fontWeight: 700, color: 'var(--arch-navy)' }}>{project.start_date ? new Date(project.start_date).toLocaleDateString() : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--arch-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem' }}>End</span>
                <span style={{ fontWeight: 700, color: 'var(--arch-navy)' }}>{project.end_date ? new Date(project.end_date).toLocaleDateString() : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--arch-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.65rem' }}>Owner</span>
                <span style={{ fontWeight: 700, color: 'var(--arch-navy)' }}>{project.created_by_name || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Member to Project</h3>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedUserId('');
                }}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {loadingUsers ? (
                <div className="loading">Loading users...</div>
              ) : (
                <div className="form-group">
                  <label htmlFor="user-select">Select User</label>
                  <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Choose a user...</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedUserId('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddMember}
                disabled={!selectedUserId || loadingUsers}
                className="btn-primary"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
