// src/pages/scan/Scan.jsx
import React, { useState } from 'react';
import { scanService } from '../../services/scanService';
import QRScanner from '../../components/QRScanner/QRScanner';
import { QrCode } from 'lucide-react';
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
  X,
  ExternalLink
} from 'lucide-react';
import ElectricBorder from '../../components/ElectricBorder/ElectricBorder';
import './Scan.css';

// Security check definitions based on the PDF
const SECURITY_CHECKS_DEFINITIONS = {
  'SSL/TLS': {
    title: 'SSL/TLS Analysis',
    description: 'Analyzes website encryption and certificate validity to ensure secure communication.',
    checks: [
      'HTTPS availability',
      'SSL certificate validity',
      'Certificate issuer',
      'Certificate expiration',
      'Days remaining before expiry'
    ],
    importance: 'SSL/TLS encryption is critical for protecting data in transit between users and your website. Without proper SSL/TLS configuration, sensitive information like passwords, credit card details, and personal data can be intercepted by attackers.',
    recommendations: [
      'Ensure SSL certificate is valid and not expired',
      'Use strong encryption protocols (TLS 1.2 or higher)',
      'Enable HSTS (HTTP Strict Transport Security)',
      'Renew certificates before expiration'
    ],
    riskLevel: 'Critical'
  },
  'Security Headers': {
    title: 'HTTP Security Header Analysis',
    description: 'Inspects website security headers that protect against common web vulnerabilities.',
    checks: [
      'Content-Security-Policy (CSP)',
      'Strict-Transport-Security (HSTS)',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy'
    ],
    importance: 'HTTP security headers provide an additional layer of protection against XSS attacks, clickjacking, MIME type sniffing, and other web-based threats. Missing headers leave your website vulnerable to common attacks.',
    recommendations: [
      'Implement Content-Security-Policy to prevent XSS attacks',
      'Enable HSTS to enforce HTTPS connections',
      'Set X-Frame-Options to prevent clickjacking',
      'Configure X-Content-Type-Options to prevent MIME sniffing'
    ],
    riskLevel: 'High'
  },
  'DNS Configuration': {
    title: 'DNS Intelligence',
    description: 'Analyzes DNS configuration to identify potential security issues and misconfigurations.',
    checks: [
      'A Records',
      'MX Records',
      'TXT Records',
      'Name Servers',
      'SPF (Future)',
      'DKIM (Future)',
      'DMARC (Future)'
    ],
    importance: 'Proper DNS configuration is essential for email security, domain verification, and preventing domain spoofing. Misconfigured DNS records can lead to email delivery issues, phishing attacks, and domain takeover vulnerabilities.',
    recommendations: [
      'Configure SPF records to prevent email spoofing',
      'Implement DKIM for email authentication',
      'Set up DMARC policies for email protection',
      'Regularly review DNS record configurations'
    ],
    riskLevel: 'High'
  },
  'Network Security': {
    title: 'Network Intelligence',
    description: 'Performs basic reconnaissance to identify potential network security risks.',
    checks: [
      'Host availability',
      'Response time',
      'Common open ports',
      'Service identification'
    ],
    importance: 'Open ports and exposed services can provide entry points for attackers. Identifying these allows you to reduce your attack surface and protect critical infrastructure from unauthorized access.',
    recommendations: [
      'Close unnecessary open ports',
      'Restrict access to essential services',
      'Implement firewalls to filter traffic',
      'Regularly audit network configurations'
    ],
    riskLevel: 'High'
  },
  'WHOIS Information': {
    title: 'WHOIS Lookup',
    description: 'Collects publicly available domain registration information.',
    checks: [
      'Domain registration information',
      'Registrar details',
      'Domain age',
      'Domain expiration',
      'Name servers'
    ],
    importance: 'WHOIS information helps verify domain ownership and identify potential red flags like expired domains or suspicious registration details. It also provides insight into domain history and trustworthiness.',
    recommendations: [
      'Keep WHOIS information up to date',
      'Use WHOIS privacy protection',
      'Monitor domain expiration dates',
      'Verify domain registration details'
    ],
    riskLevel: 'Medium'
  },
  'Technologies': {
    title: 'Technology Detection',
    description: 'Identifies technologies used by the target website to detect potential vulnerabilities.',
    checks: [
      'Web Server',
      'Programming Language',
      'JavaScript Framework',
      'Content Management System (CMS)',
      'Reverse Proxy/CDN'
    ],
    importance: 'Knowing the technologies powering your website helps identify known vulnerabilities, outdated versions, and potential security risks. Outdated or vulnerable technologies are common entry points for attackers.',
    recommendations: [
      'Keep all technologies updated to latest versions',
      'Replace outdated or vulnerable components',
      'Use secure configurations for all components',
      'Regularly audit technology stack for vulnerabilities'
    ],
    riskLevel: 'Medium'
  }
};

const Scan = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [quickUrls] = useState([
    { label: 'example.com', url: 'https://example.com' },
    { label: 'test-site.org', url: 'https://test-site.org' },
    { label: 'secure-app.io', url: 'https://secure-app.io' }
  ]);

  const addLog = (message, type = 'info') => {
    setScanLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
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

  const performScan = async (targetUrl) => {
    if (!targetUrl || !targetUrl.trim()) {
      alert("Please enter a website URL");
      return;
    }

    try {
      setIsScanning(true);
      setScanProgress(10);
      setScanResults(null);
      setScanLogs([]);

      addLog(`Starting security scan for ${targetUrl}`, "info");

      const progressTimer = setInterval(() => {
        setScanProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 800);

      const results = await scanService.scan(targetUrl);

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
        domain: targetUrl.replace(/^https?:\/\//, ""),
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

    } catch(error){
      console.error("Scan error:", error);
      addLog("Scan failed", "error");
      alert("Unable to scan website");
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const targetUrl = typeof e === 'string' ? e : url;
    await performScan(targetUrl);
  };

  // QR Scan Complete Handler
  const handleQRScanComplete = (decodedUrl) => {
    setUrl(decodedUrl);
    setShowQRScanner(false);
    // Auto-trigger the scan after QR code is decoded
    setTimeout(() => {
      performScan(decodedUrl);
    }, 300);
  };

  const getStatusIcon = (status) => {
    const value = String(status).toLowerCase();
    if(value === "passed") return CheckCircle;
    if(value === "warning") return AlertTriangle;
    if(value === "failed") return AlertCircle;
    return Info;
  };

  const getStatusColor = (status) => {
    const value = String(status).toLowerCase();
    if (
      value === "excellent" ||
      value === "secure"
    ) {
      return "#22c55e";
    }
    if (
      value === "fair"
    ) {
      return "#eab308";
    }
    if (
      value === "needs improvement"
    ) {
      return "#f97316";
    }
    if (
      value === "critical"
    ) {
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

  const getRiskLevelBadge = (riskLevel) => {
    const colors = {
      'Critical': { bg: '#ef444420', color: '#ef4444' },
      'High': { bg: '#f9731620', color: '#f97316' },
      'Medium': { bg: '#eab30820', color: '#eab308' },
      'Low': { bg: '#22c55e20', color: '#22c55e' }
    };
    return colors[riskLevel] || colors['Medium'];
  };

  const handleCheckClick = (checkName) => {
    const definition = SECURITY_CHECKS_DEFINITIONS[checkName];
    if (definition) {
      setSelectedCheck({
        ...definition,
        name: checkName,
        status: scanResults?.checks.find(c => c.name === checkName)?.status || 'Unknown',
        color: scanResults?.checks.find(c => c.name === checkName)?.color || '#64748b',
        details: scanResults?.checks.find(c => c.name === checkName)?.details || 'No details available'
      });
      setShowCheckModal(true);
    }
  };

  const closeModal = () => {
    setShowCheckModal(false);
    setSelectedCheck(null);
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
                <button
                  type="button"
                  className="scan-qr-btn cursor-target"
                  onClick={() => setShowQRScanner(true)}
                  disabled={isScanning}
                  title="Scan QR Code"
                >
                  <QrCode size={18} />
                </button>
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
          <div 
            className="scan-type-item cursor-target" 
            style={{ borderTopColor: '#22c55e' }}
            onClick={() => handleCheckClick('SSL/TLS')}
          >
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <Shield size={24} style={{ color: '#22c55e' }} />
            </div>
            <span className="scan-type-text">SSL/TLS</span>
            <span className="scan-type-desc">Certificate validation</span>
          </div>

          <div 
            className="scan-type-item cursor-target" 
            style={{ borderTopColor: '#3b82f6' }}
            onClick={() => handleCheckClick('Security Headers')}
          >
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Radio size={24} style={{ color: '#3b82f6' }} />
            </div>
            <span className="scan-type-text">Headers</span>
            <span className="scan-type-desc">Security headers</span>
          </div>

          <div 
            className="scan-type-item cursor-target" 
            style={{ borderTopColor: '#8b5cf6' }}
            onClick={() => handleCheckClick('DNS Configuration')}
          >
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <Server size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <span className="scan-type-text">DNS</span>
            <span className="scan-type-desc">DNS configuration</span>
          </div>

          <div 
            className="scan-type-item cursor-target" 
            style={{ borderTopColor: '#eab308' }}
            onClick={() => handleCheckClick('Network Security')}
          >
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
              <Wifi size={24} style={{ color: '#eab308' }} />
            </div>
            <span className="scan-type-text">Network</span>
            <span className="scan-type-desc">Port & service analysis</span>
          </div>

          <div 
            className="scan-type-item cursor-target" 
            style={{ borderTopColor: '#ec4899' }}
            onClick={() => handleCheckClick('WHOIS Information')}
          >
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>
              <Globe size={24} style={{ color: '#ec4899' }} />
            </div>
            <span className="scan-type-text">WHOIS</span>
            <span className="scan-type-desc">Domain information</span>
          </div>

          <div 
            className="scan-type-item cursor-target" 
            style={{ borderTopColor: '#ef4444' }}
            onClick={() => handleCheckClick('Technologies')}
          >
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <Code size={24} style={{ color: '#ef4444' }} />
            </div>
            <span className="scan-type-text">Technologies</span>
            <span className="scan-type-desc">Tech stack detection</span>
          </div>
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
                return (
                  <div 
                    key={index} 
                    className="scan-check-item cursor-target clickable" 
                    style={{ borderLeftColor: check.color }}
                    onClick={() => handleCheckClick(check.name)}
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
                    <div className="scan-check-click-hint">
                      <span>Click for details</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Actions - Removed Generate QR button */}
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

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onScanComplete={handleQRScanComplete}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Check Details Modal */}
      {showCheckModal && selectedCheck && (
        <div className="scan-modal-overlay" onClick={closeModal}>
          <div className="scan-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="scan-modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="scan-modal-header" style={{ borderBottomColor: selectedCheck.color || '#2563eb' }}>
              <div className="scan-modal-icon" style={{ backgroundColor: `${selectedCheck.color || '#2563eb'}15` }}>
                <Shield size={28} style={{ color: selectedCheck.color || '#2563eb' }} />
              </div>
              <div>
                <h2>{selectedCheck.title || selectedCheck.name}</h2>
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

              {/* What We Check Section */}
              {selectedCheck.checks && selectedCheck.checks.length > 0 && (
                <div className="scan-modal-section">
                  <h3>
                    <CheckCircle size={16} />
                    What We Check
                  </h3>
                  <ul className="scan-modal-checklist">
                    {selectedCheck.checks.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

              {/* Recommendations */}
              {selectedCheck.recommendations && selectedCheck.recommendations.length > 0 && (
                <div className="scan-modal-section recommendations">
                  <h3>
                    <CheckCircle size={16} />
                    Recommended Actions
                  </h3>
                  <ul className="scan-modal-recommendations">
                    {selectedCheck.recommendations.map((rec, idx) => (
                      <li key={idx}>
                        <span className="recommendation-dot" style={{ backgroundColor: '#22c55e' }}></span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Check Result if available */}
              {selectedCheck.details && (
                <div className="scan-modal-section result">
                  <h3>
                    <Activity size={16} />
                    Result Details
                  </h3>
                  <div className="scan-modal-result">
                    <p>{selectedCheck.details}</p>
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