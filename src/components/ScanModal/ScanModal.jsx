// src/components/ScanModal/ScanModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Shield, 
  Zap, 
  Lock, 
  Server,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader,
  Activity
} from 'lucide-react';
import ElectricBorder from '../ElectricBorder/ElectricBorder';
import './ScanModal.css';

const ScanModal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  if (!isOpen) return null;

  const handleScan = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setScanResults(null);
    setScanProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setScanResults({
          domain: url,
          score: Math.floor(Math.random() * 30) + 60,
          sslValid: Math.random() > 0.3,
          headersSecure: Math.random() > 0.3,
          openPorts: Math.floor(Math.random() * 5),
          technologies: ['React', 'Nginx', 'Cloudflare'],
          issues: [
            { type: 'warning', message: 'Missing Content-Security-Policy header' },
            { type: 'info', message: 'SSL certificate expires in 45 days' }
          ]
        });
        setIsScanning(false);
        setScanProgress(100);
      }
      setScanProgress(progress);
    }, 300);
  };

  const handleClose = () => {
    setUrl('');
    setScanResults(null);
    setIsScanning(false);
    setScanProgress(0);
    onClose();
  };

  return (
    <div className="scan-modal-overlay" onClick={handleClose}>
      <div className="scan-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="scan-modal-close cursor-target" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="scan-modal-header">
          <h2 className="scan-modal-title">New Security Scan</h2>
          <p className="scan-modal-subtitle">Enter a URL to analyze its security posture</p>
        </div>

        {/* Scan Form with Electric Border */}
        <ElectricBorder
          color="#2563eb"
          speed={0.8}
          chaos={0.1}
          borderRadius={16}
          className="scan-modal-form-wrapper"
        >
          <div className="scan-modal-form">
            <div className="scan-modal-form-header">
              <Shield size={20} className="scan-modal-form-icon" />
              <h3>Security Analysis</h3>
            </div>
            
            <form onSubmit={handleScan}>
              <div className="scan-modal-input-group">
                <Globe size={18} className="scan-modal-input-icon" />
                <input
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="scan-modal-input cursor-target"
                  disabled={isScanning}
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className={`scan-modal-btn cursor-target ${isScanning ? 'scanning' : ''}`}
                disabled={isScanning || !url}
              >
                {isScanning ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Start Scan
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            
            <div className="scan-modal-features">
              <div className="scan-modal-feature cursor-target">
                <Lock size={14} />
                <span>SSL/TLS Analysis</span>
              </div>
              <div className="scan-modal-feature cursor-target">
                <Server size={14} />
                <span>DNS Intelligence</span>
              </div>
              <div className="scan-modal-feature cursor-target">
                <Shield size={14} />
                <span>Security Headers</span>
              </div>
              <div className="scan-modal-feature cursor-target">
                <Globe size={14} />
                <span>Technology Detection</span>
              </div>
            </div>
          </div>
        </ElectricBorder>

        {/* Scanning Status */}
        {isScanning && (
          <div className="scan-modal-status-wrapper">
            <div className="scan-modal-status-card">
              <div className="scan-modal-status-icon">
                <Activity size={32} className="pulse" />
              </div>
              <div className="scan-modal-status-content">
                <h4>Scanning in progress...</h4>
                <p>Analyzing {url}</p>
                <div className="scan-modal-progress-bar">
                  <div 
                    className="scan-modal-progress-fill" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="scan-modal-progress-text">{scanProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Scan Results */}
        {scanResults && !isScanning && (
          <div className="scan-modal-results">
            <h3 className="scan-modal-results-title">Scan Results</h3>
            <div className="scan-modal-results-grid">
              <div className="scan-modal-result-card cursor-target">
                <div className="scan-modal-result-score">
                  <span className="scan-modal-result-score-value">{scanResults.score}%</span>
                  <span className="scan-modal-result-score-label">Security Score</span>
                </div>
              </div>
              
              <div className="scan-modal-result-card cursor-target">
                <div className="scan-modal-result-item">
                  <CheckCircle size={16} className={`scan-modal-result-icon ${scanResults.sslValid ? 'success' : 'critical'}`} />
                  <div>
                    <p className="scan-modal-result-label">SSL Certificate</p>
                    <p className="scan-modal-result-value">{scanResults.sslValid ? 'Valid' : 'Invalid'}</p>
                  </div>
                </div>
              </div>
              
              <div className="scan-modal-result-card cursor-target">
                <div className="scan-modal-result-item">
                  <CheckCircle size={16} className={`scan-modal-result-icon ${scanResults.headersSecure ? 'success' : 'warning'}`} />
                  <div>
                    <p className="scan-modal-result-label">Security Headers</p>
                    <p className="scan-modal-result-value">{scanResults.headersSecure ? 'Configured' : 'Missing'}</p>
                  </div>
                </div>
              </div>
              
              <div className="scan-modal-result-card cursor-target">
                <div className="scan-modal-result-item">
                  <AlertCircle size={16} className="scan-modal-result-icon warning" />
                  <div>
                    <p className="scan-modal-result-label">Open Ports</p>
                    <p className="scan-modal-result-value">{scanResults.openPorts} detected</p>
                  </div>
                </div>
              </div>
            </div>
            
            {scanResults.issues.length > 0 && (
              <div className="scan-modal-issues-section">
                <h4 className="scan-modal-issues-title">Findings</h4>
                {scanResults.issues.map((issue, index) => (
                  <div key={index} className={`scan-modal-issue-item issue-${issue.type} cursor-target`}>
                    <AlertCircle size={14} />
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanModal;