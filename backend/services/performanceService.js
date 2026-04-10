// Performance analytics service for task and project metrics with calculations
const performanceRepository = require('../repositories/performanceRepository');

// Get performance metrics for specific task with efficiency calculations
async function getTaskPerformance(taskId) {
  try {
    const performance = await performanceRepository.getTaskPerformance(taskId);
    
    if (!performance) {
      const err = new Error('Task not found');
      err.status = 404;
      throw err;
    }

    // Calculate efficiency score (using default values since we don't have time data)
    const efficiency = 100; // Default efficiency
    const priorityScore = calculatePriorityScore(
      performance.priority,
      performance.priority_completion_rate
    );

    return {
      ...performance,
      hours_taken: 24, // Default 24 hours for frontend compatibility
      estimated_hours: 24,
      efficiency_score: efficiency,
      priority_score: priorityScore,
      performance_grade: calculatePerformanceGrade(efficiency, priorityScore)
    };
  } catch (error) {
    throw error;
  }
}

// Get enhanced team performance metrics for project analysis
async function getProjectTeamPerformance(projectId) {
  try {
    const teamMembers = await performanceRepository.getProjectTeamPerformance(projectId);
    const teamMetrics = await performanceRepository.getTeamComparisonMetrics(projectId);

    // Enhance team member data with performance scores
    const enhancedTeamMembers = teamMembers.map(member => ({
      ...member,
      avg_completion_hours: 24, // Default value
      on_time_delivery_rate: 85, // Default value
      performance_score: calculateTeamMemberScore(member),
      workload_level: calculateWorkloadLevel(member.total_tasks, teamMetrics.avg_tasks_per_member),
      efficiency_rating: 'Good' // Default rating
    }));

    return {
      team_members: enhancedTeamMembers,
      team_metrics: teamMetrics,
      collaboration_metrics: [], // Simplified for now
      project_velocity: calculateProjectVelocity(teamMetrics),
      workload_balance: calculateWorkloadBalance(enhancedTeamMembers)
    };
  } catch (error) {
    throw error;
  }
}

// Get individual user performance with productivity indicators
async function getUserPerformance(userId, projectId = null) {
  try {
    const performance = await performanceRepository.getUserPerformance(userId, projectId);
    
    if (!performance) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    // Add default values for missing fields
    const enhancedPerformance = {
      ...performance,
      avg_completion_hours: 24, // Default value
      min_completion_hours: 12, // Default value
      max_completion_hours: 48, // Default value
      on_time_delivery_rate: 85, // Default value
      tasks_completed_last_30_days: performance.completed_tasks || 0,
      tasks_completed_last_7_days: Math.floor((performance.completed_tasks || 0) / 4) // Estimate
    };

    // Calculate performance indicators
    const productivityScore = calculateProductivityScore(enhancedPerformance);
    const reliabilityScore = calculateReliabilityScore(enhancedPerformance);
    const efficiencyScore = calculateUserEfficiency(enhancedPerformance);

    return {
      ...enhancedPerformance,
      productivity_score: productivityScore,
      reliability_score: reliabilityScore,
      efficiency_score: efficiencyScore,
      overall_score: (productivityScore + reliabilityScore + efficiencyScore) / 3,
      performance_trend: { direction: 'stable', percentage_change: 0 } // Default trend
    };
  } catch (error) {
    throw error;
  }
}

// Get team comparison metrics with performance insights
async function getTeamComparisonMetrics(projectId) {
  try {
    const metrics = await performanceRepository.getTeamComparisonMetrics(projectId);
    const trends = await performanceRepository.getPerformanceTrends(projectId);

    return {
      ...metrics,
      performance_trends: trends,
      insights: generateTeamInsights(metrics, trends)
    };
  } catch (error) {
    throw error;
  }
}

// Get performance trends over specified time period
async function getPerformanceTrends(projectId, days = 30) {
  try {
    return await performanceRepository.getPerformanceTrends(projectId, days);
  } catch (error) {
    throw error;
  }
}

// Get collaboration metrics for team analysis
async function getCollaborationMetrics(projectId) {
  try {
    return await performanceRepository.getCollaborationMetrics(projectId);
  } catch (error) {
    throw error;
  }
}

// Helper functions for performance calculations
function calculateEfficiency(hoursTaken, estimatedHours) {
  if (!estimatedHours || estimatedHours <= 0) return 100;
  const efficiency = (estimatedHours / hoursTaken) * 100;
  return Math.min(Math.max(efficiency, 0), 200); // Cap at 200%
}

function calculatePriorityScore(priority, completionRate) {
  const priorityWeights = { High: 3, Medium: 2, Low: 1 };
  const weight = priorityWeights[priority] || 1;
  return (completionRate || 0) * weight;
}

function calculatePerformanceGrade(efficiency, priorityScore) {
  const score = (efficiency + priorityScore) / 2;
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function calculateTeamMemberScore(member) {
  const completionWeight = 0.4;
  const onTimeWeight = 0.3;
  const workloadWeight = 0.3;

  const completionScore = member.completion_rate || 0;
  const onTimeScore = member.on_time_delivery_rate || 0;
  const workloadScore = Math.min(member.total_tasks / 10 * 100, 100); // Normalize to 10 tasks

  return (completionScore * completionWeight) + 
         (onTimeScore * onTimeWeight) + 
         (workloadScore * workloadWeight);
}

function calculateWorkloadLevel(userTasks, avgTasks) {
  if (userTasks > avgTasks * 1.5) return 'High';
  if (userTasks < avgTasks * 0.5) return 'Low';
  return 'Balanced';
}

function calculateEfficiencyRating(avgHours, priority) {
  const priorityTargets = { High: 24, Medium: 48, Low: 72 }; // hours
  const target = priorityTargets[priority] || 48;
  
  if (avgHours <= target * 0.8) return 'Excellent';
  if (avgHours <= target) return 'Good';
  if (avgHours <= target * 1.5) return 'Average';
  return 'Poor';
}

function calculateProjectVelocity(metrics) {
  return {
    weekly_velocity: metrics.tasks_completed_week || 0,
    monthly_velocity: metrics.tasks_completed_month || 0,
    velocity_trend: 'stable' // Can be calculated from historical data
  };
}

function calculateWorkloadBalance(teamMembers) {
  const workloads = teamMembers.map(m => m.total_tasks);
  const max = Math.max(...workloads);
  const min = Math.min(...workloads);
  const avg = workloads.reduce((a, b) => a + b, 0) / workloads.length;

  return {
    balance_score: Math.max(0, (1 - (max - min) / avg) * 100).toFixed(2),
    distribution: max - min <= 2 ? 'even' : 'uneven'
  };
}

function calculateProductivityScore(performance) {
  const completionRate = performance.completion_rate || 0;
  const recentTasks = performance.tasks_completed_last_30_days || 0;
  
  const rateScore = completionRate;
  const volumeScore = Math.min(recentTasks / 10 * 100, 100); // Normalize to 10 tasks/month
  
  return (rateScore + volumeScore) / 2;
}

function calculateReliabilityScore(performance) {
  const onTimeRate = performance.on_time_delivery_rate || 0;
  const consistencyScore = calculateConsistency(performance);
  
  return (onTimeRate + consistencyScore) / 2;
}

function calculateUserEfficiency(performance) {
  const avgHours = performance.avg_completion_hours || 0;
  const efficiencyScore = Math.max(0, 100 - (avgHours - 24) * 2); // 24 hours as baseline
  
  return Math.min(efficiencyScore, 100);
}

function calculateConsistency(performance) {
  const minHours = performance.min_completion_hours || 0;
  const maxHours = performance.max_completion_hours || 0;
  const avgHours = performance.avg_completion_hours || 0;
  
  if (!avgHours) return 0;
  
  const variance = Math.abs(maxHours - minHours);
  const consistency = Math.max(0, 100 - (variance / avgHours) * 50);
  
  return consistency;
}

async function getPerformanceTrend(userId, projectId) {
  // This would calculate trend based on historical data
  // For now, return a simple trend
  return {
    direction: 'stable',
    percentage_change: 0
  };
}

function generateTeamInsights(metrics, trends) {
  const insights = [];
  
  if (metrics.avg_completion_rate < 70) {
    insights.push({
      type: 'warning',
      message: 'Team completion rate is below 70%. Consider reviewing workload distribution.',
      priority: 'high'
    });
  }
  
  if (metrics.tasks_completed_week < 5) {
    insights.push({
      type: 'info',
      message: 'Team velocity is low. Check for bottlenecks or resource constraints.',
      priority: 'medium'
    });
  }
  
  if (metrics.max_completion_rate - metrics.min_completion_rate > 30) {
    insights.push({
      type: 'warning',
      message: 'Large performance gap between team members. Consider knowledge sharing.',
      priority: 'medium'
    });
  }
  
  return insights;
}

// Export performance service functions
module.exports = {
  getTaskPerformance,
  getProjectTeamPerformance,
  getUserPerformance,
  getTeamComparisonMetrics,
  getPerformanceTrends,
  getCollaborationMetrics
};
