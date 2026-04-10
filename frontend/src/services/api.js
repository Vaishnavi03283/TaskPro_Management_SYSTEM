// API service layer that handles HTTP requests, authentication, and toast notifications for all backend communications
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const reqUrl = String(error.config?.url || '');
      const isAuthRequest =
        reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');

      if (isAuthRequest) {
        return Promise.reject(error);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 1500,
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 2000,
  });
};

// ================= ADMIN API =================
export const adminAPI = {
  // Admin user management
  getUsers: async ({ search, role }) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      
      const response = await api.get(`/admin/users?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put('/admin/user-role', { userId, role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Admin dashboard APIs
  getSystemUsage: async () => {
    try {
      const response = await api.get('/admin/system/usage');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system usage');
    }
  }
};

// ================= MEMBER MANAGEMENT API =================
export const memberAPI = {
  // Add member to project
  addMemberToProject: async (projectId, userId) => {
    try {
      const response = await api.post(`/projects/${projectId}/members`, { userId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add member to project');
    }
  },

  // Remove member from project
  removeMemberFromProject: async (projectId, userId) => {
    try {
      const response = await api.delete(`/projects/${projectId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove member from project');
    }
  },

  // Get project members
  getProjectMembers: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project members');
    }
  },

  // Get projects with members
  getProjectsWithMembers: async () => {
    try {
      const response = await api.get('/projects/with-members');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects with members');
    }
  },

  // Get all users (for adding members)
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }
};

// ================= AUTH API =================
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (name, email, password, role = 'User') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
};

// ================= TASKS API =================
export const taskAPI = {
  // Get tasks (User → own tasks, Manager/Admin → all)
  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Create task (Manager/Admin)
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  // Get single task
  getTask: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  // Update task status (ONLY User role)
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task status');
    }
  },

  // Delete task (Manager/Admin)
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  }
};

// ================= COMMENTS API =================
export const commentAPI = {
  // Create comment
  createComment: async (taskId, commentText) => {
    try {
      const response = await api.post('/comments', { task_id: taskId, comment_text: commentText });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create comment');
    }
  },

  // Get comments by task
  getCommentsByTask: async (taskId) => {
    try {
      const response = await api.get(`/comments/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
};

// ================= PROJECTS API =================
export const projectAPI = {
  // Get all projects
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  // Create project (Manager/Admin)
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  },

  // Get single project
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  },

  // Update project (Manager/Admin)
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  },

  // Delete project (Manager/Admin)
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }
};

// ================= DASHBOARD API =================
export const dashboardAPI = {
  // User dashboard (User/Manager/Admin)
  getUserDashboard: async () => {
    try {
      const response = await api.get('/dashboard/user');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user dashboard');
    }
  },

  // Manager/Admin dashboard
  getManagerDashboard: async () => {
    try {
      const response = await api.get('/dashboard/manager');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch manager dashboard');
    }
  },

  // Admin dashboard
  getAdminDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin dashboard');
    }
  }
};

// ================= PERFORMANCE API =================
export const performanceAPI = {
  // Get task performance (Task Creator/Project Creator/Admin)
  getTaskPerformance: async (taskId) => {
    try {
      const response = await api.get(`/performance/task/${taskId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: Only creators can view task performance');
      } else if (error.response?.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch task performance');
    }
  },

  // Get project team performance (Project Creator/Admin)
  getProjectPerformance: async (projectId) => {
    try {
      const response = await api.get(`/performance/project/${projectId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: Only project creators can view team performance');
      } else if (error.response?.status === 404) {
        throw new Error('Project not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch project performance');
    }
  },

  // Get user performance (Self/Project Creator/Admin)
  getUserPerformance: async (userId, projectId = null) => {
    try {
      const params = projectId ? `?projectId=${projectId}` : '';
      const response = await api.get(`/performance/user/${userId}${params}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: Only self or project creators can view user performance');
      } else if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user performance');
    }
  },

  // Get team comparison metrics (Project Creator/Admin)
  getTeamPerformance: async (projectId) => {
    try {
      const response = await api.get(`/performance/team/${projectId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: Only project creators can view team comparison');
      } else if (error.response?.status === 404) {
        throw new Error('Project not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch team performance');
    }
  },

  // Get performance trends (Project Creator/Admin)
  getPerformanceTrends: async (projectId, days = 30) => {
    try {
      const response = await api.get(`/performance/trends/${projectId}?days=${days}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: Only project creators can view performance trends');
      } else if (error.response?.status === 404) {
        throw new Error('Project not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch performance trends');
    }
  },

  // Get collaboration metrics (Project Creator/Admin)
  getCollaborationMetrics: async (projectId) => {
    try {
      const response = await api.get(`/performance/collaboration/${projectId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied: Only project creators can view collaboration metrics');
      } else if (error.response?.status === 404) {
        throw new Error('Project not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch collaboration metrics');
    }
  }
};

export default api;
