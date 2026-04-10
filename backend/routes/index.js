// Main routes index file for API endpoint organization
const express = require('express');

// Import all route modules
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const taskRoutes = require('./taskRoutes');
const commentRoutes = require('./commentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const performanceRoutes = require('./performanceRoutes');

// Initialize Express router
const router = express.Router();

// Mount all route modules with their respective prefixes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/performance', performanceRoutes);

// Export the configured router
module.exports = router;

