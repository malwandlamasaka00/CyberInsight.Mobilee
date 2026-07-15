// src/pages/dashboard/components/DashboardStatCard.jsx
import React from 'react';
import './DashboardStatCard.css';

const colorMap = {
  blue: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3b82f6' },
  green: { bg: 'rgba(34, 197, 94, 0.08)', text: '#22c55e' },
  red: { bg: 'rgba(239, 68, 68, 0.08)', text: '#ef4444' },
  yellow: { bg: 'rgba(234, 179, 8, 0.08)', text: '#eab308' },
  purple: { bg: 'rgba(168, 85, 247, 0.08)', text: '#a855f7' },
  indigo: { bg: 'rgba(99, 102, 241, 0.08)', text: '#6366f1' }
};

const DashboardStatCard = ({
  title,
  value,
  suffix = '',
  color,
  description
}) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-left">
          <p className="stat-card-title">{title}</p>
          <div className="stat-card-value-wrapper">
            <p className="stat-card-value">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {suffix && <span className="stat-card-suffix">{suffix}</span>}
            </p>
          </div>
          {description && <p className="stat-card-description">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;