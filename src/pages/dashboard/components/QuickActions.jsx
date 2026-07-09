// src/pages/dashboard/components/QuickActions.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, User, History, FileText, 
  Zap, ChevronRight, ArrowRight, Shield
} from 'lucide-react';
import './QuickActions.css';

const QuickActions = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const actions = [
    { 
      title: 'New Security Scan', 
      description: 'Run complete security analysis', 
      icon: Search, 
      color: 'blue', 
      featured: true, 
      action: () => navigate('/scan') 
    },
    { 
      title: 'View Profile', 
      description: 'Manage your account settings', 
      icon: User, 
      color: 'purple',
      action: () => navigate('/profile')
    },
    { 
      title: 'Scan History', 
      description: 'View past security scans', 
      icon: History, 
      color: 'green',
      action: () => navigate('/history')
    },
    { 
      title: 'Security Reports', 
      description: 'Generate and view reports', 
      icon: FileText, 
      color: 'orange',
      action: () => navigate('/reports')
    }
  ];

  const colorMap = {
    blue: 'action-blue',
    green: 'action-green',
    purple: 'action-purple',
    orange: 'action-orange'
  };

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">
          <Zap size={18} />
          Quick Actions
        </h3>
        <span className="quick-actions-subtitle">Quick access</span>
      </div>
      
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <div 
            key={action.title} 
            className={`quick-action-card cursor-target ${action.featured ? 'featured' : ''} ${hoveredIndex === index ? 'expanded' : ''}`}
            onClick={action.action}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="quick-action-content">
              <div className={`quick-action-icon ${colorMap[action.color]}`}>
                <action.icon size={16} />
              </div>
              <div className="quick-action-text">
                <p className="quick-action-title">{action.title}</p>
                <p className={`quick-action-description ${hoveredIndex === index ? 'visible' : ''}`}>
                  {action.description}
                </p>
              </div>
            </div>
            <div className="quick-action-arrow-wrapper">
              {hoveredIndex === index ? (
                <ArrowRight size={16} className="quick-action-arrow animate" />
              ) : (
                <ChevronRight size={16} className="quick-action-arrow" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;