// Task list component that displays all tasks with filtering, search, and task management actions
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Edit, Trash2 } from "lucide-react";
import { taskAPI, showErrorToast, showSuccessToast } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Tasks.css";

const TaskList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const canEditTask = (task) =>
    user?.role?.toLowerCase() === 'admin' ||
    user?.role?.toLowerCase() === 'manager' ||
    task.assigned_user_id === user?.id;

  const canDeleteTask = (task) =>
    user?.role?.toLowerCase() === 'admin' ||
    user?.role?.toLowerCase() === 'manager';

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await taskAPI.deleteTask(taskId);
        showSuccessToast('Task deleted successfully');
        await fetchTasks();
      } catch (error) {
        showErrorToast(error.message);
      }
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

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

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="tasks-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const isUser    = user?.role?.toLowerCase() === 'user';
  const isManager = user?.role?.toLowerCase() === 'manager' || user?.role?.toLowerCase() === 'admin';

  return (
    <div className="tasks-container">

      <div className="tasks-header">
        <div>
          <h1>{isUser ? 'My Tasks' : isManager ? 'Project Tasks' : 'All Tasks'}</h1>
          <p className="task-subtitle">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>

        <div className="filter-buttons">
          {["all", "pending", "in progress", "completed"].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? `All Tasks ${tasks.length}` : f.replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">No tasks found</div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <Link key={task.id} to={`/task/${task.id}`} className="task-card">

              <div className="task-header">
                <h3>{task.title}</h3>
                <ArrowRight size={16} className="card-arrow" />
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-status-row">
                <span className={`status-pill status-${formatStatus(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="task-footer">
                <span className={`priority priority-${task.priority?.toLowerCase()}`}>
                  {task.priority} Priority
                </span>
                <span className="due-date">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              </div>

              {task.project_name && (
                <div className="task-project-info">
                  <span className="project-label">Project:</span>
                  <span className="project-name">{task.project_name}</span>
                </div>
              )}

              <div className="task-assignment-info">
                <span className="assignment-label">
                  {isUser
                    ? 'Assigned to you'
                    : `Assigned to: ${task.assigned_user_name || 'Unassigned'}`}
                </span>
              </div>

              {(canEditTask(task) || canDeleteTask(task)) && (
                <div className="task-actions">
                  {canEditTask(task) && (
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleEditTask(task.id); }}
                      className="edit-btn"
                      title="Edit task"
                    >
                      <Edit size={13} />
                      Edit
                    </button>
                  )}
                  {canDeleteTask(task) && (
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleDeleteTask(task.id); }}
                      className="delete-btn"
                      title="Delete task"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
              )}

            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const formatStatus = (status) => status?.toLowerCase().replace(" ", "-");

export default TaskList;
