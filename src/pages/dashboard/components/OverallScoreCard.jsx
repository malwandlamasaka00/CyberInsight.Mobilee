// src/pages/dashboard/components/OverallScoreCard.jsx
import React from 'react';
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
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#dc2626';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Secure';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="score-card">
      <div className="score-card-header">
        <h3 className="score-card-title">Security Score</h3>
      </div>
      
      <div className="score-circle-container">
        <svg className="score-circle" viewBox="0 0 100 100">
          <circle className="score-circle-bg" cx="50" cy="50" r={radius} />
          <circle
            className="score-circle-progress"
            cx="50"
            cy="50"
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
          <span className="score-stat-number">{criticalIssues}</span>
          <span className="score-stat-label">Critical</span>
        </div>
        <div className="score-stat warning">
          <span className="score-stat-number">{warnings}</span>
          <span className="score-stat-label">Warnings</span>
        </div>
        <div className="score-stat passed">
          <span className="score-stat-number">{passedChecks}</span>
          <span className="score-stat-label">Passed</span>
        </div>
      </div>

      <div className="score-footer">
        <div className="score-footer-item">
          <span>{totalScans} total scans</span>
        </div>
        <div className="score-footer-item">
          <span>Avg: {averageScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default OverallScoreCard;