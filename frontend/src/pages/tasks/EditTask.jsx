import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api, { showErrorToast, showSuccessToast } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Tasks.css';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    assigned_user: '',
    project_id: '',
    status: 'Pending',
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await api.get(`/tasks/${id}`);
        setTask(taskRes.data);
        setFormData({
          title: taskRes.data.title || '',
          description: taskRes.data.description || '',
          priority: taskRes.data.priority || 'Medium',
          due_date: taskRes.data.due_date || '',
          assigned_user: taskRes.data.assigned_user || '',
          project_id: taskRes.data.project_id || '',
          status: taskRes.data.status || 'Pending',
        });

        const [usersRes, projectsRes] = await Promise.all([
          api.get('/users'),
          api.get('/projects'),
        ]);

        setUsers(usersRes.data || []);
        setProjects(projectsRes.data || []);
      } catch (error) {
        showErrorToast(error.response?.data?.message || 'Failed to load task');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.due_date || !formData.project_id) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await api.put(`/tasks/${id}`, formData);
      showSuccessToast('Task updated successfully');
      navigate(`/task/${id}`);
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="tasks-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-container">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(`/task/${id}`)}>
        <ArrowLeft size={15} />
        Back to Task
      </button>

      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1>Edit Task</h1>
          <p className="task-subtitle">Modify the details of your existing project task below.</p>
        </div>
      </div>

      {/* Form */}
      <form className="form-card" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={5}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
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
              required
            />
          </div>

          <div className="form-group">
            <label>Project *</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Assigned User</label>
          <select
            name="assigned_user"
            value={formData.assigned_user}
            onChange={handleChange}
          >
            <option value="">Select a user</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Task'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/task/${id}`)}
          >
            Discard Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditTask;
