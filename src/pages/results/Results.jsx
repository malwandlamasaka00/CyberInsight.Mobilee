// src/pages/dashboard/results/Results.jsx
import React from 'react';
import './Results.css';

const Results = ({ findings }) => {
  const defaultFindings = [
    { label: 'SSL Certificate', status: 'pass', detail: 'Valid · 89 days left', category: 'SSL/TLS' },
    { label: 'HTTP Security Headers', status: 'warn', detail: 'CSP missing', category: 'Headers' },
    { label: 'DNS Configuration', status: 'pass', detail: 'Properly configured', category: 'DNS' },
    { label: 'Open Ports', status: 'pass', detail: 'No critical ports exposed', category: 'Network' },
  ];

  const data = findings && findings.length > 0 ? findings : defaultFindings;

  const stats = {
    pass: data.filter(f => f.status === 'pass').length,
    warn: data.filter(f => f.status === 'warn').length,
    fail: data.filter(f => f.status === 'fail').length,
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pass': return <i className="fas fa-check-circle" style={{ color: '#1e7b4c' }}></i>;
      case 'warn': return <i className="fas fa-exclamation-triangle" style={{ color: '#b9692b' }}></i>;
      case 'fail': return <i className="fas fa-times-circle" style={{ color: '#b34033' }}></i>;
      default: return null;
    }
  };

  return (
    <div className="results-section">
      <div className="results-header">
        <h3><i className="fas fa-chart-simple"></i> Latest Findings</h3>
        <div className="results-stats">
          <span className="stat-pass"><i className="fas fa-check-circle"></i> {stats.pass}</span>
          <span className="stat-warn"><i className="fas fa-exclamation-triangle"></i> {stats.warn}</span>
          <span className="stat-fail"><i className="fas fa-times-circle"></i> {stats.fail}</span>
        </div>
      </div>
      {data.slice(0, 4).map((item, index) => (
        <div className="result-item" key={index}>
          <span className="label">
            {item.category && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted, #64748b)', marginRight: '0.5rem' }}>[{item.category}]</span>}
            {item.label}
          </span>
          <span className={`status ${item.status}`}>
            {getStatusIcon(item.status)} {item.detail}
          </span>
        </div>
      ))}
      {data.length > 4 && (
        <div style={{ textAlign: 'center', padding: '0.5rem 0', borderTop: '1px solid #edf2f7', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
            + {data.length - 4} more findings
          </span>
        </div>
      )}
    </div>
  );
};

export default Results;