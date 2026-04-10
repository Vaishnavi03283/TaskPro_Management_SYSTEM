// User management page component that allows administrators to view, edit, and manage user accounts and roles
import React, { useState, useEffect } from 'react';
import { adminAPI, showErrorToast, showSuccessToast } from '../../services/api';
import './Admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState('');
  const [updating, setUpdating] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      const users = await adminAPI.getUsers({ search, role: roleFilter });
      setUsers(users);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setEditingId(user.id);
    setEditingRole(user.role);
  };

  const handleSaveRole = async (userId) => {
    setUpdating(true);
    try {
      await adminAPI.updateUserRole(userId, editingRole);

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: editingRole } : u
        )
      );

      showSuccessToast('User role updated');
      setEditingId(null);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingRole('');
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      showSuccessToast('User deleted');
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Users</h1>
      <span className="admin-page-subtitle">Manage organization access and define administrative permissions.</span>

      {/* Controls */}
      <div className="admin-controls">
        <div className="admin-controls-left">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="role-filter"
            >
              <option value="">All Roles</option>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {users.length > 0 && (
            <span className="users-count-label">Showing {users.length} total users</span>
          )}
        </div>
              </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            {/* SCROLL WRAPPER */}
            <div className="table-scroll">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(user => {
                    const isCurrentUser = currentUser?.id === user.id;

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="user-name-cell">
                            <span className="user-name-primary">
                              {user.name || 'N/A'}
                              {isCurrentUser && (
                                <span className="you-badge">You</span>
                              )}
                            </span>
                            <span className="user-name-meta">Last active {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </td>

                        <td>{user.email}</td>

                        <td>
                          {editingId === user.id ? (
                            <select
                              value={editingRole}
                              onChange={(e) => setEditingRole(e.target.value)}
                              disabled={updating}
                            >
                              <option>User</option>
                              <option>Manager</option>
                              <option>Admin</option>
                            </select>
                          ) : (
                            <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                              {user.role}
                            </span>
                          )}
                        </td>

                        <td>
                          <span className={`status-badge ${user.is_active !== false ? 'status-active' : 'status-inactive'}`}>
                            <span className="status-badge-dot"></span>
                            {user.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td>
                          {editingId === user.id ? (
                            <div className="action-buttons-inline">
                              <button
                                className="btn-save"
                                onClick={() => {
                                  if (isCurrentUser) {
                                    showErrorToast("You cannot change your own role");
                                    return;
                                  }
                                  handleSaveRole(user.id);
                                }}
                                disabled={updating}
                              >
                                {updating ? 'Saving...' : 'Save'}
                              </button>

                              <button
                                className="btn-cancel"
                                onClick={handleCancel}
                                disabled={updating}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="action-buttons-inline">
                              <button
                                className={`btn-edit ${isCurrentUser ? 'disabled-look' : ''}`}
                                onClick={() => {
                                  if (isCurrentUser) {
                                    showErrorToast("You cannot change your own role");
                                    return;
                                  }
                                  handleEditRole(user);
                                }}
                              >
                                Edit
                              </button>

                              <button
                                className={`btn-delete ${isCurrentUser ? 'disabled-look' : ''}`}
                                onClick={() => {
                                  if (isCurrentUser) {
                                    showErrorToast("You cannot delete your own account");
                                    return;
                                  }
                                  handleDeleteUser(user.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="table-pagination">
              <span className="pagination-info">Showing 1 to {Math.min(users.length, 10)} of {users.length} entries</span>
              <div className="pagination-controls">
                <button className="pagination-btn">‹</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn">›</button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="admin-info-cards">
            <div className="admin-info-card">
              <div className="admin-info-card-icon" style={{ background: 'rgba(37,99,235,0.08)', color: '#1e3a8a', fontSize: '1.4rem' }}>🛡</div>
              <span className="admin-info-card-badge">+2 this month</span>
              <h3>Administrators</h3>
              <p>{users.filter(u => u.role === 'Admin').length} users have full system access including financial management.</p>
            </div>
            <div className="admin-info-card">
              <div className="admin-info-card-icon" style={{ background: 'rgba(245,158,11,0.08)', color: '#d97706', fontSize: '1.4rem' }}>🔒</div>
              <span className="admin-info-card-badge admin-info-card-badge-neutral">Standard stability</span>
              <h3>Security Audit</h3>
              <p>Last system-wide permission sweep completed recently. Ensure all roles are accurate.</p>
            </div>
            <div className="admin-info-card">
              <div className="admin-info-card-icon" style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', fontSize: '1.4rem' }}>✅</div>
              <h3>Active Seats</h3>
              <p>{users.filter(u => u.is_active !== false).length} of {users.length} seats currently active.</p>
              <div className="admin-info-card-progress">
                <div className="admin-info-card-progress-fill" style={{ width: `${users.length > 0 ? Math.round((users.filter(u => u.is_active !== false).length / users.length) * 100) : 0}%` }}></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
