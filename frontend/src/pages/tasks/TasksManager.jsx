// Tasks manager component that provides centralized task management with filtering and status tracking
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI, showErrorToast, showSuccessToast } from '../../services/api';
import './Tasks.css';

const TasksManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasks = await taskAPI.getTasks();
      setTasks(tasks);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showSuccessToast('Task deleted');
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed')   return '#27ae60';
    if (s === 'in progress') return '#f39c12';
    if (s === 'pending')     return '#95a5a6';
    return '#3498db';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="tasks-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-container">

      <div className="tasks-header">
        <div>
          <h1>Task Management</h1>
          <p className="task-subtitle">
            Curation and management of all enterprise project tasks across departments.
          </p>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks {tasks.length}
          </button>
          <button
            className={`filter-btn ${filter === 'in progress' ? 'active' : ''}`}
            onClick={() => setFilter('in progress')}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <Link to={`/task/${task.id}`} className="task-link">
                      {task.title}
                    </Link>
                    {task.project_name && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--ts-text-3)', marginTop: '0.2rem' }}>
                        Project: {task.project_name}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className="status-badge small"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td style={{ color: getPriorityColor(task.priority), fontWeight: 700 }}>
                    {task.priority}
                  </td>
                  <td>{task.assigned_user_name || 'Unassigned'}</td>
                  <td style={{ fontFamily: 'var(--ts-mono)', fontSize: '0.82rem', color: 'var(--ts-text-3)' }}>
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/task/${task.id}`} className="btn-small btn-view">
                        View
                      </Link>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

const getPriorityColor = (priority) => {
  const p = priority?.toLowerCase();
  if (p === 'high')   return '#dc2626';
  if (p === 'medium') return '#d97706';
  if (p === 'low')    return '#16a34a';
  return '#3498db';
};

export default TasksManager;
