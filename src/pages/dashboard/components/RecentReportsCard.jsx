// src/pages/dashboard/components/RecentReportsCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowRight, Calendar, Shield, Eye } from 'lucide-react';
import './RecentReportsCard.css';

const RecentReportsCard = ({ reports }) => {
  const navigate = useNavigate();

  return (
    <div className="recent-reports">
      <div className="recent-reports-header">
        <h3 className="recent-reports-title">
          <FileText size={18} />
          Recent Reports
        </h3>
        <button className="view-all-btn cursor-target" onClick={() => navigate('/reports')}>
          View All
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="recent-reports-list">
        {reports && reports.slice(0, 3).map((report) => (
          <div key={report.id} className="report-item cursor-target">
            <div className="report-item-content">
              <div className="report-icon-wrapper">
                <Shield size={16} />
              </div>
              <div className="report-info">
                <div className="report-domain-wrapper">
                  <span className="report-domain">{report.domain}</span>
                  <span className="report-type">{report.type || 'PDF'}</span>
                </div>
                <div className="report-meta">
                  <span className="report-date">
                    <Calendar size={12} />
                    {new Date(report.generated).toLocaleDateString()}
                  </span>
                  <span className="report-size">{report.size}</span>
                </div>
              </div>
            </div>
            
            <div className="report-actions">
              <button className="report-view-btn cursor-target">
                <Eye size={14} />
              </button>
              <button className="report-download-btn cursor-target">
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReportsCard;