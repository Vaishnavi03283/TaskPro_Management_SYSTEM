// Task details page component that displays comprehensive task information with comments and status management
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskAPI, commentAPI, showSuccessToast, showErrorToast } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatCommentDate } from "../../services/dateFormatter";
import PerformanceSection from "../../components/Performance";
import "./Tasks.css";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    fetchComments();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const task = await taskAPI.getTask(id);
      setTask(task);
    } catch (error) {
      showErrorToast(error.message);
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const comments = await commentAPI.getCommentsByTask(id);
      setComments(comments);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await taskAPI.updateTaskStatus(id, newStatus);
      setTask(prev => ({ ...prev, status: newStatus }));
      showSuccessToast("Task status updated successfully");
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const comment = await commentAPI.createComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment("");
      showSuccessToast("Comment added");
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="task-details-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-container">
        <div className="empty-state">Task not found</div>
      </div>
    );
  }

  const formatStatus = (status) => status?.toLowerCase().replace(" ", "-");

  return (
    <div className="task-details-container">

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() =>
          navigate(
            hasRole("Admin") || hasRole("Manager") ? "/tasks-manager" : "/tasks"
          )
        }
      >
        <span className="back-arrow">←</span> Back to Tasks
      </button>

      <div className="task-details-layout">

        {/* ── Left: Task Details ── */}
        <div className="task-details-left">
          <div className="task-details-card">

            <div className="task-details-header">
              <div>
                <h1>{task.title}</h1>
                <div className="task-meta">
                  <span className={`status-pill large status-${formatStatus(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              {hasRole("Manager") && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    navigate(`/edit-task/${id}`);
                  }}
                >
                  Edit Task
                </button>
              )}
            </div>

            <div className="task-details-content">

              <p className="description">{task.description}</p>

              <div className="details-grid">
                <div className="detail-item">
                  <label>Priority</label>
                  <p className={`priority priority-${task.priority?.toLowerCase()}`}>
                    {task.priority}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Due Date</label>
                  <p>{new Date(task.due_date).toLocaleDateString()}</p>
                </div>
                <div className="detail-item">
                  <label>Project</label>
                  <p>{task.project_name || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Assigned User</label>
                  <p>{task.assigned_user_name || "Unassigned"}</p>
                </div>
              </div>

              {hasRole("User") && (
                <div className="status-update">
                  <label>Update Status</label>
                  <div className="status-buttons">
                    {["Pending", "In Progress", "Completed"].map(status => (
                      <button
                        key={status}
                        className={`status-btn status-${status.toLowerCase().replace(" ", "-")}${task.status === status ? " active" : ""}`}
                        onClick={() => handleStatusChange(status)}
                        disabled={updatingStatus || task.status === status}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── Right: Comments ── */}
        <div className="task-details-right">
          <div className="comments-section">
            <h2>Comments ({comments.length})</h2>

            <form className="comment-form" onSubmit={handleAddComment}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={submittingComment}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? "Adding..." : "Add Comment"}
              </button>
            </form>

            {comments.length === 0 ? (
              <div className="empty-state">No comments yet</div>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <strong>{comment.user_name || "Anonymous"}</strong>
                      <span className="comment-date">
                        {formatCommentDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="comment-text">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Performance Section */}
      <PerformanceSection type="task" id={task.id} />

    </div>
  );
};

const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "completed") return "#27ae60";
  if (s === "in progress") return "#f39c12";
  if (s === "pending") return "#95a5a6";
  return "#3498db";
};

const getPriorityColor = (priority) => {
  const p = priority?.toLowerCase();
  if (p === "high") return "#e74c3c";
  if (p === "medium") return "#f39c12";
  if (p === "low") return "#27ae60";
  return "#3498db";
};

export default TaskDetails;
