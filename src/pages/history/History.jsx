// src/pages/dashboard/history/History.jsx
import React, { useState } from 'react';
import './History.css';

const History = ({ history }) => {
  const [selectedScan, setSelectedScan] = useState(null);
  const [filter, setFilter] = useState('all');

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pass': return <i className="fas fa-check-circle" style={{ color: '#43e97b' }}></i>;
      case 'warn': return <i className="fas fa-exclamation-triangle" style={{ color: '#fdcb6e' }}></i>;
      case 'fail': return <i className="fas fa-times-circle" style={{ color: '#f5576c' }}></i>;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pass': return 'Secure';
      case 'warn': return 'Warning';
      case 'fail': return 'Critical';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pass': return '#43e97b';
      case 'warn': return '#fdcb6e';
      case 'fail': return '#f5576c';
      default: return '#94a3b8';
    }
  };

  // Filter history items
  const filteredHistory = filter === 'all' ? history : history?.filter(item => item.status === filter);

  // Handle scan click - opens popup
  const handleScanClick = (scan) => {
    setSelectedScan(scan);
    document.body.style.overflow = 'hidden';
  };

  // Close popup
  const closePopup = () => {
    setSelectedScan(null);
    document.body.style.overflow = 'auto';
  };

  // Generate detailed findings for a scan
  const getScanDetails = (scan) => {
    const findings = [
      { 
        label: 'SSL Certificate', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Valid · 126 days left' : scan.score >= 60 ? 'Expiring soon · 15 days left' : 'Expired certificate',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Protects data in transit between browser and server.',
        recommendation: scan.score >= 80 ? 'Certificate is valid and secure' : scan.score >= 60 ? 'Renew certificate within 30 days' : 'Renew SSL certificate immediately'
      },
      { 
        label: 'Content-Security-Policy (CSP)', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Configured properly' : scan.score >= 60 ? 'Partially configured' : 'Missing',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Prevents XSS attacks by controlling resources.',
        recommendation: scan.score >= 80 ? 'CSP is properly configured' : scan.score >= 60 ? 'Add missing CSP directives' : 'Implement a Content Security Policy'
      },
      { 
        label: 'HSTS (Strict-Transport-Security)', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Enabled with valid config' : scan.score >= 60 ? 'Configured but weak' : 'Missing',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Forces HTTPS connections to prevent downgrade attacks.',
        recommendation: scan.score >= 80 ? 'HSTS is properly configured' : scan.score >= 60 ? 'Increase HSTS max-age' : 'Enable HSTS on your server'
      },
      { 
        label: 'SPF Record', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Configured with proper records' : scan.score >= 60 ? 'Partially configured' : 'Missing',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Prevents email spoofing and protects domain reputation.',
        recommendation: scan.score >= 80 ? 'SPF is properly configured' : scan.score >= 60 ? 'Update SPF records' : 'Configure SPF records'
      },
      { 
        label: 'Open Ports', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'No unnecessary ports exposed' : scan.score >= 60 ? 'Some unnecessary ports open' : 'Critical ports exposed',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Reduces attack surface and minimizes entry points.',
        recommendation: scan.score >= 80 ? 'All ports are properly secured' : scan.score >= 60 ? 'Close unnecessary open ports' : 'Immediately close exposed critical ports'
      },
    ];
    return findings;
  };

  // Calculate stats
  const totalScans = history?.length || 0;
  const passedScans = history?.filter(h => h.status === 'pass').length || 0;
  const warnScans = history?.filter(h => h.status === 'warn').length || 0;
  const failScans = history?.filter(h => h.status === 'fail').length || 0;
  const avgScore = totalScans > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalScans) : 0;

  return (
    <>
      {/* Stats Overview */}
      <div className="history-stats-overview">
        <div className="stat-card-mini">
          <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{avgScore}</span>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Secure</span>
            <span className="stat-value" style={{ color: '#43e97b' }}>{passedScans}</span>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Warnings</span>
            <span className="stat-value" style={{ color: '#fdcb6e' }}>{warnScans}</span>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Critical</span>
            <span className="stat-value" style={{ color: '#f5576c' }}>{failScans}</span>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <i className="fas fa-globe"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Scans</span>
            <span className="stat-value">{totalScans}</span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="history-list">
        <div className="history-header">
          <div className="history-header-left">
            <span className="history-title">
              <i className="fas fa-clock-rotate-left"></i> Scan History
            </span>
          </div>
          <div className="history-header-right">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn pass ${filter === 'pass' ? 'active' : ''}`}
                onClick={() => setFilter('pass')}
              >
                <i className="fas fa-check-circle"></i> Secure
              </button>
              <button 
                className={`filter-btn warn ${filter === 'warn' ? 'active' : ''}`}
                onClick={() => setFilter('warn')}
              >
                <i className="fas fa-exclamation-triangle"></i> Warning
              </button>
              <button 
                className={`filter-btn fail ${filter === 'fail' ? 'active' : ''}`}
                onClick={() => setFilter('fail')}
              >
                <i className="fas fa-times-circle"></i> Critical
              </button>
            </div>
          </div>
        </div>
        
        {filteredHistory && filteredHistory.length > 0 ? (
          <div className="history-items">
            {filteredHistory.map((item) => (
              <div 
                className="history-item clickable" 
                key={item.id}
                onClick={() => handleScanClick(item)}
              >
                <div className="history-item-left">
                  <div className="history-status-indicator">
                    <span className={`status-dot ${item.status}`}></span>
                    <span className="history-status-icon">
                      {getStatusIcon(item.status)}
                    </span>
                  </div>
                  <div className="history-item-info">
                    <span className="site">
                      <i className="fas fa-globe"></i> {item.url}
                    </span>
                    <div className="site-meta">
                      <span className="site-status" style={{ 
                        background: item.status === 'pass' ? '#d9f0d9' : item.status === 'warn' ? '#fff3e0' : '#fde8e8',
                        color: item.status === 'pass' ? '#1e7b4c' : item.status === 'warn' ? '#b9692b' : '#b34033'
                      }}>
                        {getStatusLabel(item.status)}
                      </span>
                      <span className="site-date">
                        <i className="far fa-calendar-alt"></i> {item.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="history-item-right">
                  <div className="score-wrapper">
                    <div className="score-ring">
                      <svg viewBox="0 0 36 36" className="score-svg">
                        <circle cx="18" cy="18" r="16" fill="none" className="score-bg" />
                        <circle cx="18" cy="18" r="16" fill="none" 
                          className="score-progress"
                          style={{
                            strokeDasharray: `${item.score} 100`,
                            stroke: item.score >= 80 ? '#43e97b' : item.score >= 60 ? '#fdcb6e' : '#f5576c'
                          }}
                        />
                      </svg>
                      <span className="score-number">{item.score}</span>
                    </div>
                  </div>
                  <span className="history-view-icon">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <div className="history-empty-icon">
              <i className="fas fa-inbox"></i>
            </div>
            <h4>No scans found</h4>
            <p>Try adjusting your filters or run a new scan</p>
          </div>
        )}
      </div>

      {/* ===== SCAN RESULTS POPUP ===== */}
      {selectedScan && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container scan-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="popup-header">
              <div className="popup-icon" style={{ 
                background: selectedScan.score >= 80 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 
                           selectedScan.score >= 60 ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' : 
                           'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <i className="fas fa-shield-halved"></i>
              </div>
              <div className="popup-title">
                <h2>{selectedScan.url}</h2>
                <span className="popup-date"><i className="fas fa-calendar"></i> {selectedScan.date}</span>
              </div>
            </div>

            <div className="popup-score-section">
              <div className="popup-score-circle" style={{ 
                borderColor: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c',
                color: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c'
              }}>
                {selectedScan.score}
              </div>
              <div className="popup-score-info">
                <h3>Security Score: {selectedScan.score >= 80 ? 'Good' : selectedScan.score >= 60 ? 'Fair' : 'Poor'}</h3>
                <p>Status: <span className={`status-badge ${selectedScan.status}`}>
                  {selectedScan.status === 'pass' && '✅ Secure'}
                  {selectedScan.status === 'warn' && '⚠️ Warning'}
                  {selectedScan.status === 'fail' && '❌ Critical'}
                </span></p>
              </div>
            </div>

            <div className="popup-findings">
              <h4><i className="fas fa-list"></i> Detailed Findings</h4>
              {getScanDetails(selectedScan).map((finding, index) => (
                <div key={index} className={`popup-finding-item ${finding.status}`}>
                  <div className="finding-icon">
                    {finding.status === 'pass' && <i className="fas fa-check-circle" style={{ color: '#43e97b' }}></i>}
                    {finding.status === 'warn' && <i className="fas fa-exclamation-triangle" style={{ color: '#fdcb6e' }}></i>}
                    {finding.status === 'fail' && <i className="fas fa-times-circle" style={{ color: '#f5576c' }}></i>}
                  </div>
                  <div className="finding-content">
                    <div className="finding-label">{finding.label}</div>
                    <div className="finding-detail">{finding.detail}</div>
                    <div className="finding-impact"><strong>Impact:</strong> {finding.impact}</div>
                    <div className="finding-recommendation">
                      <i className="fas fa-lightbulb"></i> <strong>Recommendation:</strong> {finding.recommendation}
                    </div>
                  </div>
                  <div className={`finding-severity ${finding.severity}`}>{finding.severity}</div>
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <button className="btn-primary" onClick={closePopup}>
                <i className="fas fa-check"></i> Got It
              </button>
              <button className="btn-secondary" onClick={closePopup}>
                <i className="fas fa-times"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default History;