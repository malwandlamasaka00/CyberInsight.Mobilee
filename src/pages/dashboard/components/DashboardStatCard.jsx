// src/pages/dashboard/components/DashboardStatCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './DashboardStatCard.css';

const colorMap = {
  blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
  green: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
  red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
  yellow: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: 'rgba(234, 179, 8, 0.2)' },
  purple: { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
  indigo: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1', border: 'rgba(99, 102, 241, 0.2)' }
};

const DashboardStatCard = ({
  title,
  value,
  suffix = '',
  icon: Icon,
  color,
  description,
  trend,
  trendValue
}) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card" style={{ borderColor: colors.border }}>
      <div className="stat-card-content">
        <div>
          <p className="stat-card-title">{title}</p>
          <div className="stat-card-value-wrapper">
            <p className="stat-card-value">
              {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            {trend && (
              <span className={`stat-card-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {trendValue}
              </span>
            )}
          </div>
          {description && <p className="stat-card-description">{description}</p>}
        </div>
        <div className="stat-card-icon" style={{ background: colors.bg, color: colors.text }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;