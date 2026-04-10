// Edit project page component that allows updating existing project details and member assignments
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Info } from 'lucide-react';
import { projectAPI, showErrorToast, showSuccessToast } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Projects.css';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [priority, setPriority] = useState('High');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectAPI.getProject(id);
        setProject(project);
        setFormData({
          name: project.name || '',
          description: project.description || '',
          start_date: project.start_date || '',
          end_date: project.end_date || '',
          status: project.status || 'Planned',
        });
      } catch (error) {
        showErrorToast(error.message);
        navigate('/projects');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.start_date || !formData.end_date) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await projectAPI.updateProject(id, formData);
      showSuccessToast('Project updated successfully');
      navigate(`/project/${id}`);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user can edit this project
  const canEdit = project && (user?.role?.toLowerCase() === 'admin' || project.created_by === user?.id);

  if (fetchLoading) {
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

  if (!canEdit) {
    return (
      <div className="projects-container">
        <div className="empty-state">You don't have permission to edit this project</div>
      </div>
    );
  }

  return (
    <div className="projects-container">

      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <span onClick={() => navigate('/projects')}>Projects</span>
        <span className="crumb-sep">›</span>
        <span className="crumb-active">Edit Project</span>
      </div>

      {/* Page header */}
      <div className="projects-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Edit Project Details</h1>
          <p className="project-subtitle">
            Modify the foundational parameters of the architectural studio workspace.<br />
            Ensure all timelines and statuses reflect the current sprint velocity.
          </p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(`/project/${id}`)}>
          <ArrowLeft size={16} />
          Back to Project
        </button>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-watermark">TASK</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={5}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <div className="priority-selector">
                {['Low', 'High', 'Critical'].map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-btn ${priority === p ? 'active' : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Estimated Completion</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/project/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom meta cards */}
      <div className="form-meta-cards">
        <div className="form-meta-card">
          <div className="form-meta-card-icon">
            <Clock size={16} style={{ color: 'var(--arch-accent)' }} />
          </div>
          <div className="form-meta-card-content">
            <h4>Last Activity</h4>
            <p>Updated recently by {project.created_by_name || 'a team member'}.</p>
          </div>
        </div>
        <div className="form-meta-card">
          <div className="form-meta-card-icon">
            <Users size={16} style={{ color: 'var(--arch-accent)' }} />
          </div>
          <div className="form-meta-card-content">
            <h4>Collaborators</h4>
            <p>Team members assigned to this project will be notified of changes.</p>
          </div>
        </div>
        <div className="form-meta-card">
          <div className="form-meta-card-icon">
            <Info size={16} style={{ color: 'var(--arch-accent)' }} />
          </div>
          <div className="form-meta-card-content">
            <h4>Resource Load</h4>
            <p>Review team capacity before adjusting project timelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
