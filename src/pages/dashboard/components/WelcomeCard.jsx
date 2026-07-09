// src/pages/dashboard/components/WelcomeCard.jsx
import React from 'react';
import { Shield, TrendingUp } from 'lucide-react';
import './WelcomeCard.css';

const WelcomeCard = ({ userName, scanCount }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <div className="welcome-left">
          <h2 className="welcome-title">{getGreeting()}, {userName}</h2>
          <div className="welcome-metrics">
          </div>
        </div>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <span className="welcome-stat-value">{scanCount}</span>
            <span className="welcome-stat-label">Scans This Month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;