// src/pages/dashboard/scan/Scan.jsx
import React, { useState } from 'react';

const Scan = ({ onScan, scanResults }) => {
  const [url, setUrl] = useState('example.com');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!url.trim()) {
      alert('Please enter a valid URL');
      return;
    }
    setIsScanning(true);
    setTimeout(() => {
      onScan(url.trim());
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="scan-section">
      <h3><i className="fas fa-magnifying-glass-chart"></i> Quick Website Scan</h3>
      <div className="scan-input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., example.com)"
          className="scan-input"
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button className="btn-scan" onClick={handleScan} disabled={isScanning}>
          {isScanning ? (
            <><i className="fas fa-spinner fa-spin"></i> Scanning...</>
          ) : (
            <><i className="fas fa-arrow-right"></i> Scan</>
          )}
        </button>
      </div>
      
      {scanResults && (
        <div className="findings-preview">
          <span className="finding-item">
            <i className="fas fa-lock" style={{ color: '#1e7b4c' }}></i>
            SSL {scanResults.ssl?.valid ? '✓' : '✗'} · {scanResults.ssl?.daysLeft || 0}d
          </span>
          <span className="finding-item">
            <i className="fas fa-code"></i>
            {scanResults.headers?.['content-security-policy'] !== 'Missing' ? 'CSP ✓' : 'CSP ✗'}
            <span className={`badge-risk ${scanResults.headers?.['content-security-policy'] !== 'Missing' ? 'ok' : 'medium'}`}>
              {scanResults.headers?.['content-security-policy'] !== 'Missing' ? 'OK' : 'Medium'}
            </span>
          </span>
          <span className="finding-item">
            <i className={`fas ${scanResults.headers?.['strict-transport-security'] !== 'Missing' ? 'fa-check-circle' : 'fa-times-circle'}`} 
               style={{ color: scanResults.headers?.['strict-transport-security'] !== 'Missing' ? '#1e7b4c' : '#b34033' }}>
            </i>
            {scanResults.headers?.['strict-transport-security'] !== 'Missing' ? 'HSTS enabled' : 'HSTS missing'}
          </span>
          <span className="finding-item">
            <i className="fas fa-shield"></i>
            Score: <strong>{scanResults.score}</strong>
          </span>
        </div>
      )}

      <div className="report-actions">
        <button className="btn-pdf" onClick={() => scanResults && alert('Generating report...')}>
          <i className="fas fa-file-pdf"></i> Generate Report
        </button>
        <button className="btn-pdf secondary">
          <i className="fas fa-clock-rotate-left"></i> History
        </button>
      </div>
    </div>
  );
};

export default Scan;