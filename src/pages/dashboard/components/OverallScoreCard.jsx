// src/pages/dashboard/components/OverallScoreCard.jsx
import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Calendar, TrendingUp, Shield } from 'lucide-react';
import './OverallScoreCard.css';

const OverallScoreCard = ({
  score,
  criticalIssues,
  warnings,
  passedChecks,
  totalScans,
  averageScore
}) => {
  const getScoreColor = () => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="score-card">
      <div className="score-card-header">
        <Shield size={20} className="score-card-icon" />
        <h3 className="score-card-title">Overall Security Score</h3>
      </div>
      
      <div className="score-circle-container">
        <svg className="score-circle" viewBox="0 0 200 200">
          <circle className="score-circle-bg" cx="100" cy="100" r={radius} />
          <circle
            className="score-circle-progress"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            stroke={getScoreColor()}
          />
        </svg>
        <div className="score-circle-label">
          <span className="score-value">{score}%</span>
          <span className="score-label" style={{ color: getScoreColor() }}>
            {getScoreLabel()}
          </span>
        </div>
      </div>

      <div className="score-stats-grid">
        <div className="score-stat critical">
          <AlertTriangle size={16} />
          <div>
            <span className="score-stat-value">{criticalIssues}</span>
            <span className="score-stat-label">Critical</span>
          </div>
        </div>
        <div className="score-stat warning">
          <AlertCircle size={16} />
          <div>
            <span className="score-stat-value">{warnings}</span>
            <span className="score-stat-label">Warnings</span>
          </div>
        </div>
        <div className="score-stat passed">
          <CheckCircle size={16} />
          <div>
            <span className="score-stat-value">{passedChecks}</span>
            <span className="score-stat-label">Passed</span>
          </div>
        </div>
      </div>

      <div className="score-footer">
        <div className="score-footer-item">
          <Calendar size={14} />
          <span>{totalScans} total scans</span>
        </div>
        <div className="score-footer-item">
          <TrendingUp size={14} />
          <span>Avg: {averageScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default OverallScoreCard;