// Project list component that displays all projects with search, member management, and project actions
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Users, UserPlus, X, Edit, Trash2, Search, SlidersHorizontal } from 'lucide-react';
import { projectAPI, memberAPI, showErrorToast, showSuccessToast } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Projects.css';

const ProjectList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projects = await projectAPI.getProjects();

      const projectsWithMembers = await Promise.all(
        projects.map(async (project) => {
          try {
            const members = await memberAPI.getProjectMembers(project.id);
            return { ...project, members: members || [] };
          } catch (error) {
            return { ...project, members: [] };
          }
        })
      );

      setProjects(projectsWithMembers);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const addMemberToProject = async (projectId, userId) => {
    try {
      await memberAPI.addMemberToProject(projectId, userId);
      showSuccessToast('Member added successfully');

      setProjects(prevProjects =>
        prevProjects.map(project => {
          if (project.id === projectId) {
            memberAPI.getProjectMembers(projectId).then(members => {
              setProjects(currentProjects =>
                currentProjects.map(p =>
                  p.id === projectId
                    ? { ...p, members: members || [] }
                    : p
                )
              );
            });
          }
          return project;
        })
      );

    } catch (error) {
      showErrorToast(error.message);
      throw error;
    }
  };

  const removeMemberFromProject = async (projectId, userId) => {
    try {
      await memberAPI.removeMemberFromProject(projectId, userId);
      showSuccessToast('Member removed successfully');

      if (userId === user?.id) {
        showSuccessToast('You have been removed from this project');
        const isUser = user?.role?.toLowerCase() === 'user';
        if (isUser) {
          navigate('/dashboard');
        } else {
          await fetchProjects();
        }
      } else {
        memberAPI.getProjectMembers(projectId).then(members => {
          setProjects(currentProjects =>
            currentProjects.map(p =>
              p.id === projectId
                ? { ...p, members: members || [] }
                : p
            )
          );
        });
      }
    } catch (error) {
      showErrorToast(error.message);
      throw error;
    }
  };

  const handleAddMember = (projectId) => {
    setSelectedProjectId(projectId);
    setShowAddMemberModal(true);
    setSelectedUserId('');
    fetchAvailableUsers();
  };

  const handleConfirmAddMember = async () => {
    if (!selectedUserId || !selectedProjectId) return;
    try {
      await addMemberToProject(selectedProjectId, selectedUserId);
      setShowAddMemberModal(false);
      setSelectedProjectId(null);
      setSelectedUserId('');
    } catch (error) {
      // Error already handled in addMemberToProject
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    const isSelfRemoval = userId === user?.id;
    const confirmMessage = isSelfRemoval
      ? 'Are you sure you want to remove yourself from this project? You will no longer have access to this project.'
      : 'Are you sure you want to remove this member?';

    if (window.confirm(confirmMessage)) {
      try {
        await removeMemberFromProject(projectId, userId);
      } catch (error) {
        // Error already handled
      }
    }
  };

  const canEditProject = (project) => {
    return user?.role?.toLowerCase() === 'admin' || project.created_by === user?.id;
  };

  const canDeleteProject = (project) => {
    return user?.role?.toLowerCase() === 'admin' || project.created_by === user?.id;
  };

  const canManageMembers = (project) => {
    return user?.role?.toLowerCase() === 'admin' || project.created_by === user?.id;
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectAPI.deleteProject(projectId);
        showSuccessToast('Project deleted successfully');
        await fetchProjects();
      } catch (error) {
        showErrorToast(error.message);
      }
    }
  };

  const handleEditProject = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  const isManager = user?.role?.toLowerCase() === 'manager' || user?.role?.toLowerCase() === 'admin';

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (project.status?.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="projects-container">

      {/* Header */}
      <div className="projects-header">
        <div>
          <h1>Project Portfolio</h1>
          <p className="project-subtitle">
            Curating {filteredProjects.length} active high-impact initiatives across the organization.
          </p>
        </div>
        <Link to="/create-project" className="btn-primary">
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Filter by name, creator or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <button className="filter-icon-btn" title="Advanced filters">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>
            {projects.length === 0
              ? 'No projects yet. Create one to get started!'
              : 'No projects found matching your search criteria.'}
          </p>
        </div>
      ) : (
        <>
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                {/* Status badge + name */}
                <div className="project-status-container">
                  <span className={`project-status ${project.status?.toLowerCase() || 'planned'}`}>
                    {project.status || 'Planned'}
                  </span>
                  <div className="project-card-header">
                    <h3>{project.name}</h3>
                    <Link to={`/project/${project.id}`} className="view-project-link">
                      <ArrowRight size={16} className="card-arrow" />
                    </Link>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                {/* Creator row */}
                <div className="project-creator-row">
                  <div className="project-creator-avatar">
                    {getInitials(project.created_by_name)}
                  </div>
                  <div className="project-creator-info">
                    <span className="project-creator-name">{project.created_by_name || '—'}</span>
                    <span className="project-creator-title">
                      <span className={`project-role-badge ${project.is_owner ? 'owner' : 'member'}`}>
                        {project.is_owner ? 'Owner' : 'Member'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="project-dates">
                  <div className="project-dates-col">
                    <span className="project-dates-col-label">Duration</span>
                    <span className="project-dates-col-value">
                      {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })} –{' '}
                      {new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </span>
                  </div>
                  {project.members?.length > 0 && (
                    <div className="project-team-row">
                      <div className="team-avatars">
                        {project.members.slice(0, 3).map((m, i) => (
                          <div key={m.id} className={`team-avatar project-avatar-${i}`}>
                            {getInitials(m.name)}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="team-avatar team-avatar-more">+{project.members.length - 3}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {(canEditProject(project) || canDeleteProject(project)) && (
                  <div className="project-actions">
                    {canEditProject(project) && (
                      <button
                        onClick={() => handleEditProject(project.id)}
                        className="edit-btn"
                        title="Edit project"
                      >
                        <Edit size={13} />
                        Edit
                      </button>
                    )}
                    {canDeleteProject(project) && (
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="delete-btn"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    )}
                  </div>
                )}

                {/* Members Section */}
                {project.members && (
                  <div className="members-section">
                    <div className="members-header">
                      <Users size={13} />
                      <span>Core Team ({project.members?.length || 0})</span>
                    </div>

                    {project.members && project.members.length > 0 ? (
                      <div className="members-list">
                        {project.members.slice(0, 3).map(member => (
                          <div key={member.id} className="member-item">
                            <span className="member-name">{member.name}</span>
                            <span className="member-role">{member.role}</span>
                            {canManageMembers(project) && (
                              <button
                                onClick={() => handleRemoveMember(project.id, member.id)}
                                className="remove-member-btn"
                                title="Remove member"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="more-members">
                            +{project.members.length - 3} more members
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-members">No members yet</div>
                    )}

                    {canManageMembers(project) && (
                      <button
                        onClick={() => handleAddMember(project.id)}
                        className="add-member-btn"
                      >
                        <UserPlus size={13} />
                        Add Member
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Initialize card */}
            {isManager && (
              <Link to="/create-project" className="initialize-link">
                <div className="project-card initialize-card">
                  <div className="initialize-icon">+</div>
                  <h3 className="initialize-title">Initialize Project</h3>
                  <p className="initialize-description">
                    Ready to start something new?<br />Deploy a project from a template or scratch.
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* Footer */}
          <div className="portfolio-footer">
            <div className="portfolio-footer-stats">
              <div className="portfolio-stat">
                <span className="portfolio-stat-label">Total Budget</span>
                <span className="portfolio-stat-value">—</span>
              </div>
              <div className="portfolio-stat">
                <span className="portfolio-stat-label">Avg. Velocity</span>
                <span className="portfolio-stat-value">—</span>
              </div>
            </div>
            <div className="portfolio-pagination">
              <button className="page-btn">‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Member to Project</h3>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedProjectId(null);
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
                  setSelectedProjectId(null);
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

export default ProjectList;
