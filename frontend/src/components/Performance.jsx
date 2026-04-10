// Performance analytics component that displays charts and metrics for projects and tasks
import React, { useState, useEffect } from 'react';
import { performanceAPI } from '../services/api';
import { BarChart3, Users, AlertCircle, Filter, Search } from 'lucide-react';
import './Performance.css';

const PerformanceSection = ({ type, id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformance();
  }, [type, id]);

  const fetchPerformance = async () => {
    try {
      let data;
      if (type === 'task') data = await performanceAPI.getTaskPerformance(id);
      else if (type === 'project') data = await performanceAPI.getProjectPerformance(id);
      else if (type === 'user') data = await performanceAPI.getUserPerformance(id);
      else return;

      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return <div className="perf-loading">Loading performance data...</div>;
  if (error) return <div className="perf-error"><AlertCircle size={16} /> {error}</div>;
  if (!data) return null;

  if (type === 'task') {
    return (
      <div className="perf-section">
        <h3><BarChart3 size={14} /> Performance Analytics</h3>
        <div className="perf-section-heading">Task Performance</div>

        <div className="perf-grid">
          <div className="perf-card">
            <h4>Assigned User</h4>
            <p><strong>{data.assigned_user_name}</strong></p>
            <p>Completion Rate: <span className="rate" data-rate={data.user_completion_rate}>{data.user_completion_rate}%</span></p>
          </div>
          <div className="perf-card">
            <h4>Efficiency</h4>
            <p>Time Taken: <strong>{data.hours_taken?.toFixed(1)}h</strong></p>
            <p>Efficiency: <span className="efficiency">{Math.round(data.efficiency_score)}%</span></p>
          </div>
          <div className="perf-card">
            <h4>Priority & Grade</h4>
            <p>Level: <span className={`priority ${(data.priority || '').toLowerCase()}`}>{data.priority}</span></p>
            <p>Grade: <span className="grade">{data.performance_grade}</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'project') {
    const teamSize = data.team_metrics?.team_size || 0;
    const totalTasks = data.team_metrics?.total_project_tasks || 0;
    const completed = data.team_metrics?.total_completed || 0;
    const avgRate = data.team_metrics?.avg_completion_rate || 0;

    const barHeights = [30, 45, 55, 60, 70, 75, 80, 90, 95, 100];

    return (
      <div className="perf-section">
        <h3><Users size={14} /> Performance Analytics</h3>
        <div className="perf-section-heading">Team Performance</div>

        {/* KPI Strip */}
        <div className="perf-kpi-strip">
          <div className="perf-kpi-cell">
            <div className="perf-kpi-cell-label">Team Size</div>
            <div className="perf-kpi-cell-value">{teamSize}</div>
            <div className="perf-kpi-cell-meta perf-kpi-meta-green">+4 new members</div>
          </div>
          <div className="perf-kpi-cell">
            <div className="perf-kpi-cell-label">Total Tasks</div>
            <div className="perf-kpi-cell-value">{totalTasks.toLocaleString()}</div>
            <div className="perf-kpi-cell-meta perf-kpi-meta-blue">Across all projects</div>
          </div>
          <div className="perf-kpi-cell">
            <div className="perf-kpi-cell-label">Completed</div>
            <div className="perf-kpi-cell-value">{completed.toLocaleString()}</div>
            <div className="perf-kpi-cell-meta perf-kpi-meta-blue">
              {totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0}% progress rate
            </div>
          </div>
          <div className="perf-kpi-cell">
            <div className="perf-kpi-cell-label">Completion Rate</div>
            <div className="perf-kpi-cell-value">{avgRate}%</div>
            <div className="perf-kpi-cell-meta perf-kpi-meta-amber">Avg. turnaround</div>
          </div>
        </div>

        {/* Members Performance Grid */}
        {data.team_members?.length > 0 && (
          <>
            <div className="perf-sub-header">
              <h4>Members Performance Grid</h4>
              <div className="perf-sub-actions">
                <button className="perf-icon-btn" title="Filter"><Filter size={14} /></button>
                <button className="perf-icon-btn" title="Search"><Search size={14} /></button>
              </div>
            </div>

            <div className="members-grid">
              {data.team_members.map(member => (
                <div key={member.user_id} className="member-card">
                  <div className="member-card-header">
                    <div className="member-card-avatar">{getInitials(member.user_name)}</div>
                    <div className="member-card-identity">
                      <h5>{member.user_name}</h5>
                      <span className="member-card-role">{member.role || 'Team Member'}</span>
                    </div>
                    <span className="member-score-badge">
                      Score {Math.round(member.performance_score || 0)}
                    </span>
                  </div>

                  <div className="member-progress-row">
                    <span>Task Completion</span>
                    <span className="member-progress-pct">{member.completion_rate}%</span>
                  </div>
                  <div className="member-progress-bar">
                    <div
                      className="member-progress-fill"
                      style={{ width: `${member.completion_rate}%` }}
                    />
                  </div>

                  <div className="member-stats-row">
                    <div className="member-stat-item">
                      <span className="member-stat-label">Total Tasks</span>
                      <span className="member-stat-value">{member.total_tasks}</span>
                    </div>
                    <div className="member-stat-item">
                      <span className="member-stat-label">On-Time</span>
                      <span className="member-stat-value">{member.on_time_delivery_rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Task Performance Matrix */}
        <div className="perf-sub-header" style={{ marginTop: '0.5rem' }}>
          <h4>Task Performance Matrix</h4>
        </div>

        <div className="perf-matrix-grid">
          <div className="perf-matrix-main">
            <div className="perf-matrix-label">Operational Efficiency</div>
            <div className="perf-grade-display">
              <span className="perf-grade-letter">A+</span>
              <span className="perf-grade-label">Efficiency Grade</span>
            </div>
            <p className="perf-grade-note">
              Current workflow throughput exceeds quarterly benchmarks by 14.8%.
            </p>
            <div className="perf-bar-chart">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className={`perf-bar ${i >= 6 ? 'active' : i >= 3 ? 'tall' : ''}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="perf-matrix-sub-grid">
            <div className="perf-matrix-sub">
              <div className="perf-grade-cell">
                <div className="perf-grade-cell-header">
                  <span className="perf-grade-cell-label">Backlog</span>
                  <div className="perf-grade-cell-icon">📋</div>
                </div>
                <span className="perf-grade-cell-value">Grade B</span>
              </div>
              <div className="perf-grade-cell">
                <div className="perf-grade-cell-header">
                  <span className="perf-grade-cell-label">Quality</span>
                  <div className="perf-grade-cell-icon">✅</div>
                </div>
                <span className="perf-grade-cell-value">Grade A</span>
              </div>
            </div>
            <div className="perf-matrix-sub">
              <div className="perf-grade-cell">
                <div className="perf-grade-cell-header">
                  <span className="perf-grade-cell-label">Speed</span>
                  <div className="perf-grade-cell-icon">⚡</div>
                </div>
                <span className="perf-grade-cell-value">Grade A−</span>
              </div>
              <div className="perf-grade-cell">
                <div className="perf-grade-cell-header">
                  <span className="perf-grade-cell-label">Collaboration</span>
                  <div className="perf-grade-cell-icon">👥</div>
                </div>
                <span className="perf-grade-cell-value">Grade A+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PerformanceSection;
