// Create task page component that handles new task creation with project assignment and priority settings
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { taskAPI, projectAPI, memberAPI, showErrorToast, showSuccessToast } from '../../services/api';
import './Tasks.css';

const CreateTask = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    due_date: '',
    assigned_user: '',
    project_id: '',
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    try {
      await fetchUsers();
      await fetchProjects();
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await memberAPI.getUsers();
      setUsers(users.filter(user => user.role === 'User'));
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const fetchProjects = async () => {
    try {
      const projects = await projectAPI.getProjects();
      setProjects(projects);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.due_date) {
      showErrorToast('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      await taskAPI.createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date,
        assigned_user_id: formData.assigned_user,
        project_id: formData.project_id,
      });

      showSuccessToast('Task created successfully');
      navigate('/tasks-manager');
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="create-task-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="create-task-container">

      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1>Create Task</h1>
          <p className="task-subtitle">Add a new task to your workflow</p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => navigate('/tasks-manager')}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Form */}
      <form className="form-card" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Task Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Fix login bug"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task..."
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date *</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assign User</label>
            <select
              name="assigned_user"
              value={formData.assigned_user}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select user</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/tasks-manager')}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateTask;
