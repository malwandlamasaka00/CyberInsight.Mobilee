// src/pages/scan/Scan.jsx
import React, { useState } from 'react';
import { scanService } from '../../services/scanService';
import { historyService } from "../../services/historyService";
import { 
  Globe, 
  Shield, 
  Zap, 
  Lock, 
  Server,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader,
  Activity,
  Clock,
  Award,
  ShieldCheck,
  Radio,
  Network,
  FileText,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Fingerprint,
  Cpu,
  Database,
  Cloud,
  Link,
  Code,
  Wifi,
  Sparkles,
  BarChart3,
  PieChart,
  X
} from 'lucide-react';
import ElectricBorder from '../../components/ElectricBorder/ElectricBorder';
import './Scan.css';

const Scan = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [quickUrls] = useState([
    { label: 'example.com', url: 'https://example.com' },
    { label: 'test-site.org', url: 'https://test-site.org' },
    { label: 'secure-app.io', url: 'https://secure-app.io' }
  ]);

  // Security check descriptions with examples and importance
  const securityCheckInfo = {
    'SSL/TLS': {
      description: 'Analyzes the website\'s SSL/TLS certificate to ensure secure encrypted communication between the browser and server.',
      example: 'Valid certificate from Let\'s Encrypt, Cloudflare, or DigiCert with proper expiration date and strong encryption (TLS 1.2+).',
      importance: 'Without proper SSL/TLS, all data transmitted between users and your website (passwords, credit cards, personal info) is sent in plain text and can be intercepted by attackers.',
      icon: Shield,
      color: '#22c55e',
      riskLevel: 'Critical',
      commonIssues: ['Expired certificate', 'Self-signed certificate', 'Weak encryption protocol', 'Certificate chain incomplete']
    },
    'Security Headers': {
      description: 'Checks for essential HTTP security headers that protect against common web vulnerabilities like XSS, clickjacking, and content injection.',
      example: 'Content-Security-Policy: default-src \'self\'; Strict-Transport-Security: max-age=31536000; X-Frame-Options: DENY; X-Content-Type-Options: nosniff.',
      importance: 'Missing security headers leave your website vulnerable to cross-site scripting (XSS), clickjacking attacks, and MIME-type confusion attacks that can compromise user data.',
      icon: Radio,
      color: '#3b82f6',
      riskLevel: 'High',
      commonIssues: ['Missing CSP header', 'Missing HSTS header', 'Missing X-Frame-Options', 'Missing X-Content-Type-Options']
    },
    'DNS Configuration': {
      description: 'Examines DNS records to verify proper configuration and identify potential misconfigurations that could lead to security issues.',
      example: 'Proper A records pointing to correct IP, MX records for email, TXT records for domain verification, and properly configured Name Servers.',
      importance: 'DNS misconfigurations can lead to domain hijacking, email spoofing, and allow attackers to redirect your users to malicious websites.',
      icon: Server,
      color: '#8b5cf6',
      riskLevel: 'High',
      commonIssues: ['Missing SPF records', 'Missing DKIM records', 'Incorrect MX records', 'DNSSEC not enabled']
    },
    'Network Security': {
      description: 'Scans for open ports and exposed services that could provide attack vectors for unauthorized access.',
      example: 'Port 443 (HTTPS) open, Port 22 (SSH) properly secured, unnecessary ports closed, services properly configured and up-to-date.',
      importance: 'Exposed services and open ports give attackers entry points to exploit vulnerabilities, potentially leading to data breaches and system compromise.',
      icon: Wifi,
      color: '#eab308',
      riskLevel: 'Critical',
      commonIssues: ['Unnecessary open ports', 'Exposed administrative interfaces', 'Outdated services', 'Missing firewall rules']
    },
    'WHOIS Information': {
      description: 'Retrieves domain registration details to verify ownership and identify potential privacy or security concerns.',
      example: 'Registrar: GoDaddy, Registered: 2020-01-01, Expires: 2025-01-01, Name Servers: ns1.example.com, ns2.example.com.',
      importance: 'Incomplete or hidden WHOIS information can indicate suspicious domains, while expired or improperly registered domains risk being taken over by attackers.',
      icon: Globe,
      color: '#ec4899',
      riskLevel: 'Medium',
      commonIssues: ['Domain expiring soon', 'Privacy protection enabled', 'Registrar information hidden', 'Name servers misconfigured']
    },
    'Technologies': {
      description: 'Identifies the technologies, frameworks, and libraries used by the website to detect outdated or vulnerable components.',
      example: 'React 18.2.0, Node.js 16.14.0, WordPress 6.2, Apache 2.4.54, Nginx 1.22.0, jQuery 3.6.0.',
      importance: 'Outdated technologies and libraries contain known vulnerabilities that attackers actively exploit. Regular detection helps maintain a secure tech stack.',
      icon: Code,
      color: '#ef4444',
      riskLevel: 'High',
      commonIssues: ['Outdated versions detected', 'Vulnerable libraries', 'End-of-life technologies', 'Missing security patches']
    }
  };

  const addLog = (message, type = 'info') => {
    setScanLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleCardClick = (check) => {
    setSelectedCheck(check);
    setShowCheckModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowCheckModal(false);
    setSelectedCheck(null);
    document.body.style.overflow = 'auto';
  };

  const generateScanResults = (domain) => {
    const isSecure = domain.includes('secure') || domain.includes('example');
    const randomScore = isSecure ? 85 + Math.floor(Math.random() * 15) : 40 + Math.floor(Math.random() * 40);

    return {
      overallScore: randomScore,
      overallStatus: randomScore >= 80 ? 'Secure' : randomScore >= 60 ? 'Needs Improvement' : 'Vulnerable',
      checks: [
        {
          name: 'SSL/TLS',
          status: randomScore >= 75 ? 'Passed' : randomScore >= 50 ? 'Warning' : 'Failed',
          details: randomScore >= 75 ? 'Valid certificate, strong encryption' :
            randomScore >= 50 ? 'Certificate expires soon' : 'Invalid or missing certificate',
          icon: 'security',
          color: randomScore >= 75 ? '#22c55e' : randomScore >= 50 ? '#eab308' : '#ef4444',
        },
        {
          name: 'Security Headers',
          status: randomScore >= 70 ? 'Passed' : randomScore >= 45 ? 'Warning' : 'Failed',
          details: randomScore >= 70 ? 'All security headers present' :
            randomScore >= 45 ? 'Missing some security headers' : 'Critical headers missing',
          icon: 'http',
          color: randomScore >= 70 ? '#22c55e' : randomScore >= 45 ? '#eab308' : '#ef4444',
        },
        {
          name: 'DNS Configuration',
          status: randomScore >= 65 ? 'Passed' : randomScore >= 40 ? 'Warning' : 'Failed',
          details: randomScore >= 65 ? 'DNS properly configured' :
            randomScore >= 40 ? 'DNS configuration issues' : 'DNS misconfigured',
          icon: 'dns',
          color: randomScore >= 65 ? '#22c55e' : randomScore >= 40 ? '#eab308' : '#ef4444',
        },
        {
          name: 'Network Security',
          status: randomScore >= 60 ? 'Passed' : randomScore >= 35 ? 'Warning' : 'Failed',
          details: randomScore >= 60 ? 'No open ports detected' :
            randomScore >= 35 ? 'Some services exposed' : 'Critical services exposed',
          icon: 'wifi',
          color: randomScore >= 60 ? '#22c55e' : randomScore >= 35 ? '#eab308' : '#ef4444',
        },
        {
          name: 'WHOIS Information',
          status: randomScore >= 55 ? 'Passed' : randomScore >= 30 ? 'Warning' : 'Failed',
          details: randomScore >= 55 ? 'Domain information verified' :
            randomScore >= 30 ? 'Domain registration issues' : 'Domain information missing',
          icon: 'public',
          color: randomScore >= 55 ? '#22c55e' : randomScore >= 30 ? '#eab308' : '#ef4444',
        },
        {
          name: 'Technologies',
          status: randomScore >= 50 ? 'Passed' : randomScore >= 30 ? 'Warning' : 'Failed',
          details: randomScore >= 50 ? 'No vulnerable technologies detected' :
            randomScore >= 30 ? 'Outdated technologies found' : 'Vulnerable technologies detected',
          icon: 'code',
          color: randomScore >= 50 ? '#22c55e' : randomScore >= 30 ? '#eab308' : '#ef4444',
        },
      ]
    };
  };

  const handleScan = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert("Please enter a website URL");
      return;
    }

    try {
      setIsScanning(true);
      setScanProgress(10);
      setScanResults(null);
      setScanLogs([]);

      addLog(`Starting security scan for ${url}`, "info");

      const progressTimer = setInterval(() => {
        setScanProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 800);

      const results = await scanService.scan(url);

      clearInterval(progressTimer);

      setScanProgress(100);

      addLog("Scan completed successfully!", "success");

      const score = Number(
        results.overallScore ??
        results.score ??
        0
      );

      let calculatedStatus = "Critical";

      if (score >= 80) {
        calculatedStatus = "Secure";
      } else if (score >= 50) {
        calculatedStatus = "Needs Improvement";
      } else {
        calculatedStatus = "Critical";
      }

      const formattedResults = {
        ...results,
        overallScore: score,
        overallStatus: results.overallStatus || results.status || calculatedStatus,
        checks: (results.checks || []).map(check => {
          let status = String(check.status).toLowerCase();

          if (
            status === "pass" ||
            status === "passed" ||
            status === "success"
          ) {
            return {
              ...check,
              status: "Passed",
              color: "#22c55e"
            };
          }

          if (
            status === "warning" ||
            status === "warn"
          ) {
            return {
              ...check,
              status: "Warning",
              color: "#eab308"
            };
          }

          if (
            status === "failed" ||
            status === "fail" ||
            status === "error"
          ) {
            return {
              ...check,
              status: "Failed",
              color: "#ef4444"
            };
          }

          return {
            ...check,
            status: "Warning",
            color: "#eab308"
          };
        })
      };

      setScanResults(formattedResults);
      
      historyService.saveScan({
        id: Date.now(),
        domain: url.replace(/^https?:\/\//, ""),
        date: new Date().toISOString(),
        score: formattedResults.overallScore,
        status:
          formattedResults.overallScore >= 80
            ? "Secure"
            : formattedResults.overallScore >= 50
            ? "Needs Improvement"
            : "Critical",
        checks: formattedResults.checks,
        critical: formattedResults.checks.filter(c => c.status === "Failed").length,
        sslStatus:
          formattedResults.checks.find(c => c.name === "SSL/TLS")?.status === "Passed"
            ? "valid"
            : formattedResults.checks.find(c => c.name === "SSL/TLS")?.status === "Warning"
            ? "expiring"
            : "expired",
        cspStatus:
          formattedResults.checks.find(c => c.name === "Security Headers")?.status === "Passed"
            ? "configured"
            : formattedResults.checks.find(c => c.name === "Security Headers")?.status === "Warning"
            ? "partial"
            : "missing",
        hstsStatus:
          formattedResults.checks.find(c => c.name === "Security Headers")?.status === "Passed"
            ? "enabled"
            : formattedResults.checks.find(c => c.name === "Security Headers")?.status === "Warning"
            ? "weak"
            : "missing",
        spfStatus:
          formattedResults.checks.find(c => c.name === "DNS Configuration")?.status === "Passed"
            ? "configured"
            : formattedResults.checks.find(c => c.name === "DNS Configuration")?.status === "Warning"
            ? "partial"
            : "missing",
        portsStatus:
          formattedResults.checks.find(c => c.name === "Network Security")?.status === "Passed"
            ? "secured"
            : formattedResults.checks.find(c => c.name === "Network Security")?.status === "Warning"
            ? "warning"
            : "exposed"
      });

    } catch (error) {
      console.error("Scan error:", error);
      addLog("Scan failed", "error");
      alert("Unable to scan website");
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusIcon = (status) => {
    const value = String(status).toLowerCase();

    if (value === "passed") return CheckCircle;
    if (value === "warning") return AlertTriangle;
    if (value === "failed") return AlertCircle;
    return Info;
  };

  const getStatusColor = (status) => {
    const value = String(status).toLowerCase();

    if (value === "excellent" || value === "secure") {
      return "#22c55e";
    }
    if (value === "fair") {
      return "#eab308";
    }
    if (value === "needs improvement") {
      return "#f97316";
    }
    if (value === "critical") {
      return "#ef4444";
    }
    return "#64748b";
  };

  const getProgressColor = () => {
    if (scanProgress < 30) return '#eab308';
    if (scanProgress < 70) return '#3b82f6';
    return '#22c55e';
  };

  const getStatusText = () => {
    if (scanProgress < 30) return 'Initializing scan...';
    if (scanProgress < 50) return 'Analyzing security headers...';
    if (scanProgress < 70) return 'Checking SSL/TLS certificates...';
    if (scanProgress < 90) return 'Scanning network configuration...';
    return 'Finalizing results...';
  };

  const getIconComponent = (iconName) => {
    const icons = {
      security: Shield,
      http: Radio,
      dns: Server,
      wifi: Wifi,
      public: Globe,
      code: Code
    };
    return icons[iconName] || Shield;
  };

  return (
    <div className="scan-page-container">
      {/* Header */}
      <div className="scan-page-header">
        <div>
          <div className="scan-header-title-wrapper">
            <Shield size={28} className="scan-header-icon" />
            <div>
              <h1 className="scan-page-title">Security Scan</h1>
              <p className="scan-page-subtitle">Analyze any website's security posture</p>
            </div>
          </div>
        </div>
        <div className="scan-header-stats">
          <div className="scan-header-stat cursor-target">
            <ShieldCheck size={16} className="stat-icon-blue" />
            <span>6 Checks</span>
          </div>
          <div className="scan-header-stat cursor-target">
            <Zap size={16} className="stat-icon-yellow" />
            <span>Real-time</span>
          </div>
          <div className="scan-header-stat cursor-target">
            <FileText size={16} className="stat-icon-green" />
            <span>Reports</span>
          </div>
        </div>
      </div>

      {/* Scan Form */}
      <div className="scan-form-section">
        <ElectricBorder
          color="#2563eb"
          speed={0.8}
          chaos={0.1}
          borderRadius={16}
          className="scan-page-form-wrapper"
        >
          <div className="scan-page-form">
            <div className="scan-page-form-header">
              <div className="scan-form-icon-wrapper">
                <Shield size={20} className="scan-page-form-icon" />
              </div>
              <div>
                <h3>Security Analysis</h3>
                <p>Enter a domain to begin comprehensive security scanning</p>
              </div>
            </div>
            
            <form onSubmit={handleScan} className="scan-form">
              <div className="scan-page-input-group">
                <Globe size={18} className="scan-page-input-icon" />
                <input
                  type="url"
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="scan-page-input cursor-target"
                  disabled={isScanning}
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className={`scan-page-btn cursor-target ${isScanning ? 'scanning' : ''}`}
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
          </div>
        </ElectricBorder>
      </div>

      {/* Quick URLs */}
      <div className="scan-quick-urls">
        <div className="quick-urls-content">
          <span className="scan-quick-label">Quick URLs</span>
          <div className="scan-quick-tags">
            {quickUrls.map((item) => (
              <button
                key={item.label}
                className="scan-quick-tag cursor-target"
                onClick={() => setUrl(item.url)}
              >
                <Link size={12} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scanning Status */}
      {isScanning && (
        <div className="scan-page-status-wrapper">
          <div className="scan-page-status-card">
            <div className="scan-status-left">
              <div className="scan-page-status-icon">
                <Activity size={32} className="pulse" />
              </div>
              <div className="scan-page-status-content">
                <h4>Scanning in progress...</h4>
                <p>Analyzing <strong>{url}</strong></p>
                <div className="scan-page-progress-bar">
                  <div 
                    className="scan-page-progress-fill" 
                    style={{ width: `${scanProgress}%`, background: getProgressColor() }}
                  />
                </div>
                <span className="scan-page-progress-text">{getStatusText()} ({scanProgress}%)</span>
              </div>
            </div>
            <div className="scan-status-right">
              <div className="scan-logs">
                <div className="scan-logs-header">
                  <Activity size={14} />
                  <span>Live Logs</span>
                </div>
                <div className="scan-logs-list">
                  {scanLogs.slice(-6).reverse().map((log, index) => (
                    <div key={index} className={`scan-log-item log-${log.type}`}>
                      <span className="scan-log-time">{log.time}</span>
                      <span className="scan-log-message">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Checks */}
      <div className="scan-checks-section">
        <div className="scan-checks-header">
          <h2 className="scan-checks-title">Security Checks</h2>
          <span className="scan-checks-count">6 comprehensive checks</span>
        </div>
        <div className="scan-types">
          {Object.entries(securityCheckInfo).map(([name, info]) => {
            const IconComponent = info.icon;
            return (
              <div 
                key={name}
                className="scan-type-item clickable cursor-target" 
                style={{ borderTopColor: info.color }}
                onClick={() => handleCardClick({ name, ...info })}
              >
                <div className="scan-type-icon" style={{ backgroundColor: `${info.color}15` }}>
                  <IconComponent size={24} style={{ color: info.color }} />
                </div>
                <div className="scan-type-content">
                  <span className="scan-type-text">{name}</span>
                  <span className="scan-type-desc">{info.description.substring(0, 60)}...</span>
                  <span className="scan-type-click-hint">Click for details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan Results */}
      {scanResults && !isScanning && (
        <div className="scan-page-results">
          <div className="scan-results-header">
            <h2 className="scan-results-title">
              <Award size={20} />
              Scan Results
            </h2>
            <div className="scan-results-badge">
              <Sparkles size={14} />
              <span>Analysis Complete</span>
            </div>
          </div>

          <div className="scan-results-overview">
            <div className="scan-score-container">
              <div className="scan-score-circle">
                <svg className="scan-score-svg" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle 
                    cx="100" cy="100" r="80" 
                    fill="none" 
                    stroke={getStatusColor(scanResults.overallStatus)} 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray={502.65}
                    strokeDashoffset={502.65 - (Number(scanResults.overallScore ||0) / 100) * 502.65}
                    className="scan-score-progress"
                  />
                </svg>
                <div className="scan-score-label">
                  <span className="scan-score-value">{scanResults.overallScore}%</span>
                  <span className="scan-score-label-text" style={{ color: getStatusColor(scanResults.overallStatus) }}>
                    {scanResults.overallStatus}
                  </span>
                </div>
              </div>
              <div className="scan-score-details">
                <div className="scan-score-stat cursor-target">
                  <Award size={18} className="stat-icon" />
                  <div>
                    <span className="stat-label">Overall Status</span>
                    <span className="stat-value" style={{ color: getStatusColor(scanResults.overallStatus) }}>
                      {scanResults.overallStatus}
                    </span>
                  </div>
                </div>
                <div className="scan-score-stat cursor-target">
                  <Clock size={18} className="stat-icon" />
                  <div>
                    <span className="stat-label">Domain</span>
                    <span className="stat-value">{url}</span>
                  </div>
                </div>
                <div className="scan-score-stat cursor-target">
                  <CheckCircle size={18} className="stat-icon" style={{ color: '#22c55e' }} />
                  <div>
                    <span className="stat-label">Checks Passed</span>
                    <span className="stat-value">{scanResults.checks.filter(c => String(c.status).toLowerCase() === 'passed').length}/6</span>
                  </div>
                </div>
                <div className="scan-score-stat cursor-target">
                  <AlertTriangle size={18} className="stat-icon" style={{ color: '#eab308' }} />
                  <div>
                    <span className="stat-label">Warnings</span>
                    <span className="stat-value">{scanResults.checks.filter(c => String(c.status).toLowerCase() === 'warning').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scan-checks-list">
            <h3 className="scan-checks-list-title">Detailed Security Checks</h3>
            <div className="scan-checks-items">
              {scanResults.checks.map((check, index) => {
                const IconComponent = getIconComponent(check.icon);
                const StatusIcon = getStatusIcon(check.status);
                const checkInfo = securityCheckInfo[check.name];
                
                return (
                  <div 
                    key={index} 
                    className="scan-check-item clickable cursor-target" 
                    style={{ borderLeftColor: check.color }}
                    onClick={() => handleCardClick({ ...check, ...checkInfo })}
                  >
                    <div className="scan-check-header">
                      <div className="scan-check-header-left">
                        <IconComponent size={18} style={{ color: check.color }} />
                        <span className="scan-check-name">{check.name}</span>
                      </div>
                      <div className="scan-check-status" style={{ backgroundColor: `${check.color}20` }}>
                        <StatusIcon size={12} style={{ color: check.color }} />
                        <span className="scan-check-status-text" style={{ color: check.color }}>
                          {check.status}
                        </span>
                      </div>
                    </div>
                    <p className="scan-check-details">{check.details}</p>
                    <div className="scan-check-click-hint">Click for more details →</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="scan-results-actions">
            <button className="scan-action-btn primary cursor-target">
              <FileText size={16} />
              Generate Report
            </button>
            <button className="scan-action-btn secondary cursor-target">
              <Download size={16} />
              Export PDF
            </button>
            <button className="scan-action-btn secondary cursor-target">
              <Eye size={16} />
              View Details
            </button>
          </div>
        </div>
      )}

      {/* ===== CHECK DETAILS MODAL - SAME WIDTH AS CARDS ===== */}
      {showCheckModal && selectedCheck && (
        <div className="scan-modal-overlay" onClick={closeModal}>
          <div className="scan-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="scan-modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="scan-modal-header" style={{ borderBottomColor: selectedCheck.color || '#2563eb' }}>
              <div className="scan-modal-icon" style={{ backgroundColor: `${selectedCheck.color || '#2563eb'}15` }}>
                {selectedCheck.icon ? (
                  <selectedCheck.icon size={28} style={{ color: selectedCheck.color || '#2563eb' }} />
                ) : (
                  <Shield size={28} style={{ color: selectedCheck.color || '#2563eb' }} />
                )}
              </div>
              <div>
                <h2>{selectedCheck.name}</h2>
                {selectedCheck.status && (
                  <span className="scan-modal-status" style={{ color: selectedCheck.color }}>
                    Status: {selectedCheck.status}
                  </span>
                )}
              </div>
            </div>

            <div className="scan-modal-body">
              {/* Description Section */}
              <div className="scan-modal-section">
                <h3>
                  <Info size={16} />
                  Description
                </h3>
                <p>{selectedCheck.description || 'No description available.'}</p>
              </div>

              {/* Example Section */}
              <div className="scan-modal-section">
                <h3>
                  <CheckCircle size={16} />
                  Example
                </h3>
                <div className="scan-modal-example">
                  <p>{selectedCheck.example || 'No example available.'}</p>
                </div>
              </div>

              {/* Why It Matters Section */}
              <div className="scan-modal-section importance">
                <h3>
                  <AlertTriangle size={16} />
                  Why It Matters
                </h3>
                <p>{selectedCheck.importance || 'No importance information available.'}</p>
              </div>

              {/* Risk Level */}
              {selectedCheck.riskLevel && (
                <div className="scan-modal-section risk">
                  <h3>
                    <AlertCircle size={16} />
                    Risk Level
                  </h3>
                  <span 
                    className="scan-modal-risk" 
                    style={{ 
                      backgroundColor: 
                        selectedCheck.riskLevel === 'Critical' ? '#ef444420' :
                        selectedCheck.riskLevel === 'High' ? '#f9731620' :
                        selectedCheck.riskLevel === 'Medium' ? '#eab30820' :
                        '#22c55e20',
                      color:
                        selectedCheck.riskLevel === 'Critical' ? '#ef4444' :
                        selectedCheck.riskLevel === 'High' ? '#f97316' :
                        selectedCheck.riskLevel === 'Medium' ? '#eab308' :
                        '#22c55e'
                    }}
                  >
                    {selectedCheck.riskLevel}
                  </span>
                </div>
              )}

              {/* Common Issues */}
              {selectedCheck.commonIssues && selectedCheck.commonIssues.length > 0 && (
                <div className="scan-modal-section issues">
                  <h3>
                    <AlertCircle size={16} />
                    Common Issues Found
                  </h3>
                  <ul className="scan-modal-issues">
                    {selectedCheck.commonIssues.map((issue, idx) => (
                      <li key={idx}>
                        <AlertCircle size={14} />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Check Result if available */}
              {selectedCheck.status && (
                <div className="scan-modal-section result">
                  <h3>
                    <Activity size={16} />
                    Check Result
                  </h3>
                  <div className="scan-modal-result">
                    <span className="scan-modal-result-status" style={{ color: selectedCheck.color }}>
                      {selectedCheck.status}
                    </span>
                    <p>{selectedCheck.details || 'No details available.'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="scan-modal-footer">
              <button className="scan-modal-btn primary" onClick={closeModal}>
                <CheckCircle size={16} />
                Got It
              </button>
              <button className="scan-modal-btn secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;