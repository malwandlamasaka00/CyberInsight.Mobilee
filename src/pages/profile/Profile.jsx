// src/pages/dashboard/profile/Profile.jsx
import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, scanHistory = [], onSelectScan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@cyberinsight.com',
    phone: '+1 (555) 123-4567',
  });

  const userData = user || {
    name: 'Demo User',
    email: 'demo@cyberinsight.com',
    memberSince: 'Jan 2026',
  };

  // Use the scanHistory from props or default data
  const scans = scanHistory && scanHistory.length > 0 ? scanHistory : [
    { id: 1, url: 'example.com', date: 'Today 14:32', score: 92, status: 'pass' },
    { id: 2, url: 'myapp.dev', date: 'Yesterday 09:15', score: 76, status: 'warn' },
    { id: 3, url: 'api.secure.co', date: 'Jul 7, 2026', score: 88, status: 'pass' },
    { id: 4, url: 'testsite.io', date: 'Jul 5, 2026', score: 65, status: 'warn' },
    { id: 5, url: 'securebank.com', date: 'Jul 3, 2026', score: 95, status: 'pass' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('✅ Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || 'Demo User',
      email: user?.email || 'demo@cyberinsight.com',
      phone: '+1 (555) 123-4567',
    });
  };

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

  // Calculate stats
  const totalScans = scans.length;
  const avgScore = totalScans > 0 ? Math.round(scans.reduce((acc, curr) => acc + curr.score, 0) / totalScans) : 0;
  const passedScans = scans.filter(s => s.status === 'pass').length;
  const failedScans = scans.filter(s => s.status === 'fail').length;
  const warnScans = scans.filter(s => s.status === 'warn').length;

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pass': return <i className="fas fa-check-circle" style={{ color: '#1e7b4c' }}></i>;
      case 'warn': return <i className="fas fa-exclamation-triangle" style={{ color: '#b9692b' }}></i>;
      case 'fail': return <i className="fas fa-times-circle" style={{ color: '#b34033' }}></i>;
      default: return null;
    }
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

  return (
    <div className="profile-container">
      {/* Profile Header with Cover Image */}
      <div className="profile-cover">
        <div className="profile-cover-overlay"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
              <div className="profile-status-dot"></div>
            </div>
            <div className="profile-name-wrapper">
              <h1>{formData.name}</h1>
              <span className="profile-email"><i className="fas fa-envelope"></i> {formData.email}</span>
            </div>
          </div>
          <div className="profile-header-actions">
            {!isEditing ? (
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                <i className="fas fa-pen"></i> Edit Profile
              </button>
            ) : (
              <div className="profile-edit-actions">
                <button className="btn-save-profile" onClick={handleSave}>
                  <i className="fas fa-check"></i> Save Changes
                </button>
                <button className="btn-cancel-profile" onClick={handleCancel}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="profile-stat-content">
            <h4>Avg Security Score</h4>
            <div className="profile-stat-value">{avgScore}</div>
            <span className="profile-stat-label">{avgScore >= 80 ? 'Good' : avgScore >= 60 ? 'Fair' : 'Poor'}</span>
          </div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <i className="fas fa-globe"></i>
          </div>
          <div className="profile-stat-content">
            <h4>Total Scans</h4>
            <div className="profile-stat-value">{totalScans}</div>
            <span className="profile-stat-label">Websites scanned</span>
          </div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="profile-stat-content">
            <h4>Passed Checks</h4>
            <div className="profile-stat-value">{passedScans}</div>
            <span className="profile-stat-label">Secure websites</span>
          </div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-icon" style={{ background: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="profile-stat-content">
            <h4>Needs Attention</h4>
            <div className="profile-stat-value">{warnScans + failedScans}</div>
            <span className="profile-stat-label">Issues found</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main-grid">
        {/* Left Column - Profile Info */}
        <div className="profile-info-card">
          <div className="profile-card-header">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            
          </div>
          
          {!isEditing ? (
            <div className="profile-info-display">
              <div className="profile-info-item">
                <label><i className="fas fa-user"></i> Full Name</label>
                <span>{formData.name}</span>
              </div>
              <div className="profile-info-item">
                <label><i className="fas fa-envelope"></i> Email Address</label>
                <span>{formData.email}</span>
              </div>
              <div className="profile-info-item">
                <label><i className="fas fa-phone"></i> Phone</label>
                <span>{formData.phone}</span>
              </div>
              <div className="profile-info-item">
                <label><i className="fas fa-calendar"></i> Member Since</label>
                <span>{userData.memberSince}</span>
              </div>
            </div>
          ) : (
            <div className="profile-info-edit">
              <div className="profile-edit-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  className="profile-edit-input"
                />
              </div>
              <div className="profile-edit-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  className="profile-edit-input"
                />
              </div>
              <div className="profile-edit-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  className="profile-edit-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - My Scans */}
        <div className="profile-sidebar">
          {/* My Scans Section - Clickable */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3><i className="fas fa-globe"></i> My Scans</h3>
              <span className="scan-count-badge">{totalScans} scans</span>
            </div>
            <div className="profile-scans-list">
              {scans.length > 0 ? (
                scans.map((scan) => (
                  <div 
                    key={scan.id} 
                    className="profile-scan-item clickable"
                    onClick={() => handleScanClick(scan)}
                  >
                    <div className="scan-item-left">
                      <span className="scan-status-icon">
                        {getStatusIcon(scan.status)}
                      </span>
                      <div className="scan-item-info">
                        <span className="scan-url">{scan.url}</span>
                        <span className="scan-date">{scan.date}</span>
                      </div>
                    </div>
                    <div className="scan-item-right">
                      <span className={`scan-score ${getScoreClass(scan.score)}`}>
                        {scan.score}
                      </span>
                      <span className="scan-status-badge">
                        {scan.status === 'pass' && <span className="badge-pass">Secure</span>}
                        {scan.status === 'warn' && <span className="badge-warn">Warning</span>}
                        {scan.status === 'fail' && <span className="badge-fail">Critical</span>}
                      </span>
                      <span className="scan-view-icon">
                        <i className="fas fa-chevron-right"></i>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="profile-scans-empty">
                  <i className="fas fa-inbox"></i>
                  <p>No scans performed yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
                background: selectedScan.score >= 80 ? '#1e7b4c' : selectedScan.score >= 60 ? '#b9692b' : '#b34033' 
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
                borderColor: selectedScan.score >= 80 ? '#1e7b4c' : selectedScan.score >= 60 ? '#b9692b' : '#b34033',
                color: selectedScan.score >= 80 ? '#1e7b4c' : selectedScan.score >= 60 ? '#b9692b' : '#b34033'
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
                    {finding.status === 'pass' && <i className="fas fa-check-circle" style={{ color: '#1e7b4c' }}></i>}
                    {finding.status === 'warn' && <i className="fas fa-exclamation-triangle" style={{ color: '#b9692b' }}></i>}
                    {finding.status === 'fail' && <i className="fas fa-times-circle" style={{ color: '#b34033' }}></i>}
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
    </div>
  );
};

export default Profile;