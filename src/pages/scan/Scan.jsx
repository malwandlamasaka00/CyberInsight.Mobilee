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
  PieChart
} from 'lucide-react';
import ElectricBorder from '../../components/ElectricBorder/ElectricBorder';
import './Scan.css';

const Scan = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
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

    addLog(
      "Scan completed successfully!",
      "success"
    );


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


  } catch(error){

    console.error(
      "Scan error:",
      error
    );


    addLog(
      "Scan failed",
      "error"
    );


    alert(
      "Unable to scan website"
    );


  } finally {

    setIsScanning(false);

  }

};

 const getStatusIcon = (status)=>{

 const value =
 String(status).toLowerCase();


 if(value==="passed")
    return CheckCircle;


 if(value==="warning")
    return AlertTriangle;


 if(value==="failed")
    return AlertCircle;


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
          <div className="scan-type-item cursor-target" style={{ borderTopColor: '#22c55e' }}>
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <Shield size={24} style={{ color: '#22c55e' }} />
            </div>
            <span className="scan-type-text">SSL/TLS</span>
            <span className="scan-type-desc">Certificate validation</span>
          </div>

          <div className="scan-type-item cursor-target" style={{ borderTopColor: '#3b82f6' }}>
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Radio size={24} style={{ color: '#3b82f6' }} />
            </div>
            <span className="scan-type-text">Headers</span>
            <span className="scan-type-desc">Security headers</span>
          </div>

          <div className="scan-type-item cursor-target" style={{ borderTopColor: '#8b5cf6' }}>
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <Server size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <span className="scan-type-text">DNS</span>
            <span className="scan-type-desc">DNS configuration</span>
          </div>

          <div className="scan-type-item cursor-target" style={{ borderTopColor: '#eab308' }}>
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
              <Wifi size={24} style={{ color: '#eab308' }} />
            </div>
            <span className="scan-type-text">Network</span>
            <span className="scan-type-desc">Port & service analysis</span>
          </div>

          <div className="scan-type-item cursor-target" style={{ borderTopColor: '#ec4899' }}>
            <div className="scan-type-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>
              <Globe size={24} style={{ color: '#ec4899' }} />
            </div>
            <span className="scan-type-text">WHOIS</span>
            <span className="scan-type-desc">Domain information</span>
          </div>

          <div className="scan-type-item cursor-target" style={{ borderTopColor: '#ef4444' }}>
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
                  <div key={index} className="scan-check-item cursor-target" style={{ borderLeftColor: check.color }}>
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
    </div>
  );
};

export default Scan;