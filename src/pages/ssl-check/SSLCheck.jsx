// src/pages/ssl-check/SSLCheck.jsx
import React, { useState } from 'react';
import { Lock, Shield, CheckCircle, AlertCircle, Calendar, Globe, ArrowRight } from 'lucide-react';
import './SSLCheck.css';

const SSLCheck = () => {
  const [url, setUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setChecking(true);
    setTimeout(() => {
      setResult({
        valid: true,
        issuer: 'DigiCert Inc',
        expiry: '2027-01-15',
        daysLeft: 189,
        protocol: 'TLS 1.3',
        cipher: 'ECDHE-RSA-AES256-GCM-SHA384'
      });
      setChecking(false);
    }, 2000);
  };

  return (
    <div className="ssl-container">
      <div className="ssl-header">
        <h1 className="ssl-title">SSL/TLS Analysis</h1>
        <p className="ssl-subtitle">Check the SSL certificate status and encryption strength</p>
      </div>

      <div className="ssl-form-wrapper">
        <form onSubmit={handleCheck} className="ssl-form">
          <div className="ssl-input-group">
            <Globe size={18} className="ssl-input-icon" />
            <input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="ssl-input cursor-target"
              disabled={checking}
            />
          </div>
          <button 
            type="submit" 
            className={`ssl-btn cursor-target ${checking ? 'checking' : ''}`}
            disabled={checking || !url}
          >
            {checking ? 'Checking...' : 'Check SSL Certificate'}
          </button>
        </form>
      </div>

      {result && (
        <div className="ssl-results">
          <div className="ssl-result-card">
            <div className="ssl-result-header">
              <Shield size={24} className="ssl-result-icon" />
              <h3>Certificate Status</h3>
            </div>
            <div className="ssl-result-grid">
              <div className="ssl-result-item">
                <span className="ssl-result-label">Status</span>
                <span className="ssl-result-value valid">
                  <CheckCircle size={16} />
                  Valid
                </span>
              </div>
              <div className="ssl-result-item">
                <span className="ssl-result-label">Issuer</span>
                <span className="ssl-result-value">{result.issuer}</span>
              </div>
              <div className="ssl-result-item">
                <span className="ssl-result-label">Expiry Date</span>
                <span className="ssl-result-value">{result.expiry}</span>
              </div>
              <div className="ssl-result-item">
                <span className="ssl-result-label">Days Left</span>
                <span className="ssl-result-value highlight">{result.daysLeft} days</span>
              </div>
              <div className="ssl-result-item">
                <span className="ssl-result-label">Protocol</span>
                <span className="ssl-result-value">{result.protocol}</span>
              </div>
              <div className="ssl-result-item">
                <span className="ssl-result-label">Cipher Suite</span>
                <span className="ssl-result-value cipher">{result.cipher}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSLCheck;