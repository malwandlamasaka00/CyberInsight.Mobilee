// src/pages/dashboard/components/RecentReportsCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './RecentReportsCard.css';

const RecentReportsCard = ({ reports }) => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Secure';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  return (
    <>
      <div className="recent-reports">
        <div className="recent-reports-header">
          <h3 className="recent-reports-title">Recent Reports</h3>
          <button className="view-all-btn cursor-target" onClick={() => navigate('/reports')}>
            View All
            <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="recent-reports-list">
          {reports && reports.slice(0, 3).map((report) => (
            <div 
              key={report.id} 
              className="report-item cursor-target" 
              onClick={() => openModal(report)}
            >
              <div className="report-item-content">
                <div className="report-info">
                  <div className="report-domain-wrapper">
                    <span className="report-domain">{report.domain}</span>
                    <span className="report-type">{report.type || 'PDF'}</span>
                  </div>
                  <div className="report-meta">
                    <span className="report-date">
                      {new Date(report.generated).toLocaleDateString()}
                    </span>
                    <span className="report-size">{report.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="report-actions" onClick={(e) => e.stopPropagation()}>
                <button className="report-view-btn cursor-target">View</button>
                <button className="report-download-btn cursor-target">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="report-modal-overlay" onClick={closeModal}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="report-modal-close cursor-target" onClick={closeModal}>
              ✕
            </button>

            <div className="report-modal-header">
              <div>
                <h2 className="report-modal-title">Report Details</h2>
                <p className="report-modal-domain">{selectedReport.domain}</p>
              </div>
              <div className="report-modal-status-badge">
                <span className="report-status ready">Ready</span>
              </div>
            </div>

            <div className="report-modal-body">
              <div className="report-modal-info-grid">
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">Report Type</span>
                  <span className="report-modal-info-value">{selectedReport.type || 'Full Security Report'}</span>
                </div>
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">Generated</span>
                  <span className="report-modal-info-value">
                    {new Date(selectedReport.generated).toLocaleString()}
                  </span>
                </div>
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">File Size</span>
                  <span className="report-modal-info-value">{selectedReport.size}</span>
                </div>
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">Report ID</span>
                  <span className="report-modal-info-value">#RPT-{selectedReport.id.toString().padStart(4, '0')}</span>
                </div>
              </div>

              <div className="report-modal-score-section">
                <h4 className="report-modal-score-title">Security Score</h4>
                <div className="report-modal-score-display">
                  <div className="report-modal-score-circle">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <circle 
                        cx="60" cy="60" r="50" 
                        fill="none" 
                        stroke={getScoreColor(selectedReport.score || 78)} 
                        strokeWidth="6" 
                        strokeLinecap="round"
                        strokeDasharray={314.16}
                        strokeDashoffset={314.16 - ((selectedReport.score || 78) / 100) * 314.16}
                      />
                    </svg>
                    <div className="report-modal-score-center">
                      <span className="report-modal-score-number">{selectedReport.score || 78}%</span>
                      <span className="report-modal-score-label-text" style={{ color: getScoreColor(selectedReport.score || 78) }}>
                        {getScoreLabel(selectedReport.score || 78)}
                      </span>
                    </div>
                  </div>
                  <div className="report-modal-score-stats">
                    <div className="report-modal-score-stat">
                      <span className="stat-number">12</span>
                      <span className="stat-label">Passed</span>
                    </div>
                    <div className="report-modal-score-stat">
                      <span className="stat-number">3</span>
                      <span className="stat-label">Warnings</span>
                    </div>
                    <div className="report-modal-score-stat">
                      <span className="stat-number">1</span>
                      <span className="stat-label">Critical</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-modal-actions">
                <button className="report-modal-action-btn primary cursor-target">
                  Download Report
                </button>
                <button className="report-modal-action-btn secondary cursor-target">
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentReportsCard;