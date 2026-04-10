// Create project page component that handles new project creation with form validation and submission
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Archive, Sparkles, Share2, Shield } from 'lucide-react';
import { projectAPI, showErrorToast, showSuccessToast } from '../../services/api';
import './Projects.css';

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Planned',
  });

  const [loading, setLoading] = useState(false);

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
      showErrorToast('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      await projectAPI.createProject(formData);
      showSuccessToast('Project created successfully');
      navigate('/projects');
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-container">

      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <span onClick={() => navigate('/projects')}>Projects</span>
        <span className="crumb-sep">›</span>
        <span className="crumb-active">Initiate Project</span>
      </div>

      {/* Header */}
      <div className="projects-header">
        <div>
          <h1>Initiate Project</h1>
          <p className="project-subtitle">
            Establish the foundational parameters for your new endeavor.<br />
            All fields can be adjusted later in settings.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Q4 Strategic Infrastructure Overlay"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Outline the primary objectives and key results expected from this project..."
              rows={5}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Current Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="form-control"
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Timeline Portfolio</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ marginBottom: 0 }}
                />
                <ArrowRight size={14} style={{ color: 'var(--arch-subtle)', flexShrink: 0 }} />
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ marginBottom: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="form-feature-badges">
            <span className="feature-badge">
              <Lock size={12} />
              Private Workspace
            </span>
            <span className="feature-badge">
              <Archive size={12} />
              Auto-Archive
            </span>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/projects')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Feature Cards */}
      <div className="form-meta-cards">
        <div className="form-meta-card">
          <div className="form-meta-card-icon">✦</div>
          <div className="form-meta-card-content">
            <h4>Automated Workflows</h4>
            <p>TaskPro will automatically suggest templates based on your title.</p>
          </div>
        </div>
        <div className="form-meta-card">
          <div className="form-meta-card-icon">
            <Share2 size={16} style={{ color: 'var(--arch-accent)' }} />
          </div>
          <div className="form-meta-card-content">
            <h4>Immediate Sync</h4>
            <p>Stakeholders will be notified as soon as you hit create.</p>
          </div>
        </div>
        <div className="form-meta-card">
          <div className="form-meta-card-icon">
            <Shield size={16} style={{ color: 'var(--arch-accent)' }} />
          </div>
          <div className="form-meta-card-content">
            <h4>Draft Recovery</h4>
            <p>Your progress is automatically saved to local storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
