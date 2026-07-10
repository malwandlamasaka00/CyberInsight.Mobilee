// src/pages/dashboard/components/RecentScanCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, CheckCircle, AlertTriangle, Calendar, Eye, ArrowRight, 
  X, Shield, Award, Lock, Server, Radio, Network, FileText, Download 
} from 'lucide-react';
import './RecentScanCard.css';

const RecentScanCard = ({ scans }) => {
  const navigate = useNavigate();
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (scan) => {
    if (scan.score >= 80) {
      return (
        <span className="badge badge-secure">
          <CheckCircle size={12} />
          Secure
        </span>
      );
    }
    if (scan.score >= 60) {
      return (
        <span className="badge badge-moderate">
          <AlertTriangle size={12} />
          Moderate
        </span>
      );
    }
    return (
      <span className="badge badge-critical">
        <AlertTriangle size={12} />
        Critical
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-green';
    if (score >= 60) return 'score-yellow';
    if (score >= 40) return 'score-orange';
    return 'score-red';
  };

  const getStatusDot = (score) => {
    if (score >= 80) return 'dot-secure';
    if (score >= 60) return 'dot-moderate';
    return 'dot-critical';
  };

  const openModal = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'Secure';
    if (score >= 60) return 'Moderate';
    return 'Critical';
  };

  return (
    <>
      <div className="recent-scans">
        <div className="recent-scans-header">
          <h3 className="recent-scans-title">
            <Clock size={18} />
            Recent Scans
          </h3>
          <button className="view-all-btn cursor-target" onClick={() => navigate('/history')}>
            View All
            <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="recent-scans-list">
          {scans.map((scan) => (
            <div 
              key={scan.id} 
              className="scan-item cursor-target" 
              onClick={() => openModal(scan)}
            >
              <div className="scan-item-content">
                <div className={`scan-status-dot ${getStatusDot(scan.score)}`} />
                
                <div className="scan-info">
                  <div className="scan-domain-wrapper">
                    <span className="scan-domain">{scan.domain}</span>
                    {scan.criticalIssues > 0 && (
                      <span className="scan-issues">
                        <AlertTriangle size={12} />
                        {scan.criticalIssues} critical
                      </span>
                    )}
                  </div>
                  <div className="scan-meta">
                    <span className="scan-date">
                      <Calendar size={12} />
                      {new Date(scan.date).toLocaleDateString()}
                    </span>
                    <span className={`scan-score ${getScoreColor(scan.score)}`}>
                      Score: {scan.score}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="scan-actions" onClick={(e) => e.stopPropagation()}>
                {getStatusBadge(scan)}
                <button className="scan-view-btn cursor-target" title="View details">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan Details Modal */}
      {isModalOpen && selectedScan && (
        <div className="scan-modal-overlay" onClick={closeModal}>
          <div className="scan-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="scan-modal-close cursor-target" onClick={closeModal}>
              <X size={24} />
            </button>

            <div className="scan-modal-header">
              <div className="scan-modal-title-wrapper">
                <div className="scan-modal-icon-wrapper">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="scan-modal-title">Scan Details</h2>
                  <p className="scan-modal-domain">{selectedScan.domain}</p>
                </div>
              </div>
              <div className="scan-modal-score-badge cursor-target">
                <span className="scan-modal-score-value">{selectedScan.score}%</span>
                <span className="scan-modal-score-label">{getScoreLabel(selectedScan.score)}</span>
              </div>
            </div>

            <div className="scan-modal-body">
              <div className="scan-modal-info-grid">
                <div className="scan-modal-info-item">
                  <span className="scan-modal-info-label">Date</span>
                  <span className="scan-modal-info-value">
                    {new Date(selectedScan.date).toLocaleString()}
                  </span>
                </div>
                <div className="scan-modal-info-item">
                  <span className="scan-modal-info-label">Status</span>
                  <span className="scan-modal-info-value">
                    {getStatusText(selectedScan.score)}
                  </span>
                </div>
                <div className="scan-modal-info-item">
                  <span className="scan-modal-info-label">Critical Issues</span>
                  <span className="scan-modal-info-value">{selectedScan.criticalIssues}</span>
                </div>
                <div className="scan-modal-info-item">
                  <span className="scan-modal-info-label">Scan ID</span>
                  <span className="scan-modal-info-value">#SCN-{selectedScan.id.toString().padStart(4, '0')}</span>
                </div>
              </div>

              <div className="scan-modal-checks">
                <h4 className="scan-modal-checks-title">Security Checks</h4>
                <div className="scan-modal-checks-grid">
                  <div className="scan-modal-check-item">
                    <Lock size={16} className="check-icon passed" />
                    <span>SSL/TLS</span>
                    <span className="check-status passed">Passed</span>
                  </div>
                  <div className="scan-modal-check-item">
                    <Radio size={16} className="check-icon passed" />
                    <span>Security Headers</span>
                    <span className="check-status passed">Passed</span>
                  </div>
                  <div className="scan-modal-check-item">
                    <Server size={16} className="check-icon warning" />
                    <span>DNS Configuration</span>
                    <span className="check-status warning">Warning</span>
                  </div>
                  <div className="scan-modal-check-item">
                    <Network size={16} className="check-icon passed" />
                    <span>Network Security</span>
                    <span className="check-status passed">Passed</span>
                  </div>
                </div>
              </div>

              <div className="scan-modal-actions">
                <button className="scan-modal-action-btn primary cursor-target">
                  <FileText size={16} />
                  View Full Report
                </button>
                <button className="scan-modal-action-btn secondary cursor-target">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentScanCard;