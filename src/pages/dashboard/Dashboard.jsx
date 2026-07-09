// src/pages/dashboard/Dashboard.jsx
import React, { useState } from 'react';
import Scan from '../scan/Scan';
import History from '../history/History';
import Profile from '../profile/Profile';
import Results from '../results/Results';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [scanResults, setScanResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([
    { id: 1, url: 'example.com', date: 'Today 14:32', score: 92, status: 'pass' },
    { id: 2, url: 'myapp.dev', date: 'Yesterday 09:15', score: 76, status: 'warn' },
    { id: 3, url: 'api.secure.co', date: 'Jul 7, 2026', score: 88, status: 'pass' },
  ]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [reports, setReports] = useState([
    { id: 1, name: 'example.com_report.pdf', date: 'Today 14:32', size: '2.4 MB' },
    { id: 2, name: 'myapp.dev_report.pdf', date: 'Yesterday 09:15', size: '1.8 MB' },
  ]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Feature Cards Data with full explanations
  const featureCards = [
    {
      id: 'website-intelligence',
      title: 'Website Intelligence',
      icon: 'fa-globe',
      color: '#2d7aff',
      description: 'Collect publicly available domain information to understand who owns the domain and its registration status.',
      details: [
        { label: 'WHOIS Lookup', description: 'Retrieves domain registration information including owner details, registrar, and registration dates.' },
        { label: 'Domain Registration', description: 'Shows when the domain was registered and by which registrar.' },
        { label: 'Registrar Details', description: 'Identifies the company that registered the domain.' },
        { label: 'Domain Age', description: 'Calculates how long the domain has been registered.' },
        { label: 'Domain Expiration', description: 'Shows when the domain registration expires.' },
        { label: 'Name Servers', description: 'Lists the DNS servers responsible for resolving the domain.' }
      ],
      whyItMatters: 'Understanding domain registration information helps verify domain ownership, identify potential expiration risks, and ensure proper DNS configuration.',
      checks: ['WHOIS Lookup', 'Domain Registration', 'Registrar Details', 'Domain Age', 'Domain Expiration', 'Name Servers']
    },
    {
      id: 'ssl-tls',
      title: 'SSL/TLS Analysis',
      icon: 'fa-lock',
      color: '#6c5ce7',
      description: 'Analyze website encryption to ensure data transmitted between your website and visitors is secure and private.',
      details: [
        { label: 'HTTPS Availability', description: 'Checks if the website supports secure HTTPS connections.' },
        { label: 'SSL Certificate Validity', description: 'Verifies that the SSL certificate is valid and trusted by browsers.' },
        { label: 'Certificate Issuer', description: 'Identifies the Certificate Authority (CA) that issued the SSL certificate.' },
        { label: 'Certificate Expiration', description: 'Shows when the SSL certificate expires and needs renewal.' },
        { label: 'Days Remaining', description: 'Counts the number of days until certificate expiration.' }
      ],
      whyItMatters: 'SSL/TLS encryption protects sensitive data like passwords, credit card numbers, and personal information from being intercepted by attackers during transmission.',
      checks: ['HTTPS Availability', 'SSL Certificate Validity', 'Certificate Issuer', 'Certificate Expiration', 'Days Remaining']
    },
    {
      id: 'http-headers',
      title: 'HTTP Security Headers',
      icon: 'fa-code',
      color: '#00b894',
      description: 'Inspect website security headers that instruct browsers how to handle your website content and protect against attacks.',
      details: [
        { label: 'Content-Security-Policy', description: 'Controls which resources the browser can load, preventing XSS attacks.' },
        { label: 'Strict-Transport-Security', description: 'Forces browsers to use HTTPS, preventing downgrade attacks.' },
        { label: 'X-Frame-Options', description: 'Prevents clickjacking by controlling whether your site can be embedded in frames.' },
        { label: 'X-Content-Type-Options', description: 'Prevents MIME type sniffing, reducing the risk of drive-by downloads.' },
        { label: 'Referrer-Policy', description: 'Controls how much referrer information is sent with requests.' },
        { label: 'Permissions-Policy', description: 'Allows/denies browser features like geolocation, camera, and microphone.' }
      ],
      whyItMatters: 'Missing or misconfigured security headers leave your website vulnerable to XSS attacks, clickjacking, and other common web exploits.',
      checks: ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']
    },
    {
      id: 'dns-intelligence',
      title: 'DNS Intelligence',
      icon: 'fa-network-wired',
      color: '#fdcb6e',
      description: 'Analyze DNS configuration to ensure proper domain resolution and email security.',
      details: [
        { label: 'A Records', description: 'Maps domain names to IP addresses, directing visitors to your server.' },
        { label: 'MX Records', description: 'Specifies mail servers that handle email for your domain.' },
        { label: 'TXT Records', description: 'Stores text information, often used for SPF and DKIM email verification.' },
        { label: 'Name Servers', description: 'DNS servers that respond to queries about your domain.' },
        { label: 'SPF (Future)', description: 'Prevents email spoofing by listing authorized mail servers.' },
        { label: 'DKIM (Future)', description: 'Verifies email authenticity using digital signatures.' },
        { label: 'DMARC (Future)', description: 'Policies for handling unauthenticated emails.' }
      ],
      whyItMatters: 'Poor DNS configuration can lead to service outages, email spoofing, and phishing attacks that damage your brand reputation.',
      checks: ['A Records', 'MX Records', 'TXT Records', 'Name Servers', 'SPF', 'DKIM', 'DMARC']
    },
    {
      id: 'network-intelligence',
      title: 'Network Intelligence',
      icon: 'fa-server',
      color: '#fd79a8',
      description: 'Perform basic reconnaissance against websites to understand their network footprint and exposed services.',
      details: [
        { label: 'Host Availability', description: 'Checks if the website\'s server is reachable and responding.' },
        { label: 'Response Time', description: 'Measures how quickly the server responds to requests.' },
        { label: 'Common Open Ports', description: 'Identifies which network ports are open and listening.' },
        { label: 'Service Identification', description: 'Detects what services are running on open ports.' }
      ],
      whyItMatters: 'Open ports and exposed services are the most common entry points for attackers. Identifying them helps reduce your attack surface.',
      checks: ['Host Availability', 'Response Time', 'Common Open Ports', 'Service Identification']
    },
    {
      id: 'technology-detection',
      title: 'Technology Detection',
      icon: 'fa-microchip',
      color: '#e17055',
      description: 'Identify technologies used by the target website to understand its security posture and potential vulnerabilities.',
      details: [
        { label: 'Web Server', description: 'Identifies the server software (e.g., Apache, Nginx) handling requests.' },
        { label: 'Programming Language', description: 'Detects the backend language (e.g., Python, PHP, Node.js).' },
        { label: 'JavaScript Framework', description: 'Identifies frontend frameworks (e.g., React, Angular, Vue).' },
        { label: 'CMS', description: 'Detects content management systems (e.g., WordPress, Drupal).' },
        { label: 'CDN', description: 'Identifies Content Delivery Networks protecting the website.' },
        { label: 'Reverse Proxy', description: 'Detects proxy servers that forward requests to the backend.' }
      ],
      whyItMatters: 'Outdated technologies can contain known vulnerabilities. Knowing your tech stack helps you keep everything patched and secure.',
      checks: ['Web Server', 'Programming Language', 'JavaScript Framework', 'CMS', 'CDN', 'Reverse Proxy']
    },
    {
      id: 'security-score',
      title: 'Security Score',
      icon: 'fa-shield-halved',
      color: '#00cec9',
      description: 'After completing all checks, calculate an overall security score based on predefined security rules.',
      details: [
        { label: 'SSL Status', description: 'Evaluates SSL/TLS configuration strength.' },
        { label: 'Security Headers', description: 'Assesses HTTP security header implementation.' },
        { label: 'Domain Configuration', description: 'Reviews domain registration and WHOIS data.' },
        { label: 'DNS Configuration', description: 'Checks DNS records for proper configuration.' },
        { label: 'Open Services', description: 'Evaluates network services and open ports.' }
      ],
      whyItMatters: 'A single score provides a quick overview of your website\'s security posture, making it easy to track improvements over time.',
      checks: ['SSL Status', 'Security Headers', 'Domain Configuration', 'DNS Configuration', 'Open Services']
    }
  ];

  const handleScan = (url) => {
    const score = Math.floor(Math.random() * 30) + 70;
    setSelectedUrl(url);
    
    const results = {
      url,
      score,
      ssl: { valid: true, daysLeft: 126, issuer: "Let's Encrypt", expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString() },
      headers: { 
        'content-security-policy': "default-src 'self'",
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff'
      },
      dns: {
        aRecords: ['192.168.1.1', '192.168.1.2'],
        mxRecords: ['mail.example.com'],
        txtRecords: ['v=spf1 include:_spf.example.com ~all'],
        nameServers: ['ns1.example.com', 'ns2.example.com']
      },
      network: {
        hostAvailable: true,
        responseTime: '45ms',
        openPorts: [
          { port: 80, service: 'HTTP', status: 'open' },
          { port: 443, service: 'HTTPS', status: 'open' }
        ]
      },
      tech: {
        webServer: 'nginx/1.18.0',
        framework: 'React 18.2.0',
        cdn: 'Cloudflare',
        programmingLanguage: 'Python 3.9'
      },
      findings: [
        { label: 'SSL Certificate', status: 'pass', detail: 'Valid · 126 days left', category: 'SSL/TLS', severity: 'low' },
        { label: 'Content-Security-Policy', status: 'pass', detail: 'Configured properly', category: 'HTTP Headers', severity: 'low' },
        { label: 'HSTS', status: 'pass', detail: 'Enabled with valid config', category: 'HTTP Headers', severity: 'low' },
        { label: 'SPF Record', status: 'pass', detail: 'Configured with proper records', category: 'DNS', severity: 'low' },
        { label: 'DKIM', status: 'pass', detail: 'Configured properly', category: 'DNS', severity: 'low' },
        { label: 'Open Ports', status: 'pass', detail: 'No unnecessary ports exposed', category: 'Network', severity: 'low' },
        { label: 'Technology Stack', status: 'pass', detail: 'Modern framework detected', category: 'Technology', severity: 'low' }
      ]
    };
    
    setScanResults(results);
    setCurrentView('results');
    
    const newEntry = {
      id: scanHistory.length + 1,
      url,
      date: new Date().toLocaleString(),
      score: results.score,
      status: results.score >= 80 ? 'pass' : results.score >= 60 ? 'warn' : 'fail',
    };
    setScanHistory([newEntry, ...scanHistory]);
  };

  // ===== Handle selecting a scan from Profile =====
  const handleProfileSelectScan = (scanItem) => {
    const selectedScan = scanHistory.find(item => item.id === scanItem.id);
    if (!selectedScan) return;
    
    const score = selectedScan.score;
    const url = selectedScan.url;
    
    const results = {
      url,
      score,
      ssl: { 
        valid: true, 
        daysLeft: Math.floor(Math.random() * 100) + 30, 
        issuer: "Let's Encrypt Authority X3", 
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString() 
      },
      headers: { 
        'content-security-policy': Math.random() > 0.2 ? "default-src 'self'" : 'Missing',
        'strict-transport-security': Math.random() > 0.2 ? 'max-age=31536000; includeSubDomains' : 'Missing',
        'x-frame-options': Math.random() > 0.2 ? 'DENY' : 'SAMEORIGIN',
        'x-content-type-options': Math.random() > 0.2 ? 'nosniff' : 'Missing'
      },
      dns: {
        aRecords: ['192.168.1.1', '192.168.1.2'],
        mxRecords: ['mail.example.com'],
        txtRecords: ['v=spf1 include:_spf.example.com ~all'],
        nameServers: ['ns1.example.com', 'ns2.example.com']
      },
      network: {
        hostAvailable: true,
        responseTime: `${Math.floor(Math.random() * 50) + 20}ms`,
        openPorts: [
          { port: 80, service: 'HTTP', status: 'open' },
          { port: 443, service: 'HTTPS', status: 'open' }
        ]
      },
      tech: {
        webServer: 'nginx/1.18.0',
        framework: 'React 18.2.0',
        cdn: 'Cloudflare',
        programmingLanguage: 'Python 3.9'
      },
      findings: [
        { label: 'SSL Certificate', status: 'pass', detail: `Valid · ${Math.floor(Math.random() * 100) + 30} days left`, category: 'SSL/TLS', severity: 'low' },
        { label: 'Content-Security-Policy', status: Math.random() > 0.2 ? 'pass' : 'warn', detail: Math.random() > 0.2 ? 'Configured properly' : 'Missing', category: 'HTTP Headers', severity: Math.random() > 0.2 ? 'low' : 'medium' },
        { label: 'HSTS', status: Math.random() > 0.2 ? 'pass' : 'warn', detail: Math.random() > 0.2 ? 'Enabled with valid config' : 'Missing', category: 'HTTP Headers', severity: Math.random() > 0.2 ? 'low' : 'medium' },
        { label: 'SPF Record', status: Math.random() > 0.2 ? 'pass' : 'warn', detail: Math.random() > 0.2 ? 'Configured with proper records' : 'Missing', category: 'DNS', severity: Math.random() > 0.2 ? 'low' : 'medium' },
        { label: 'DKIM', status: Math.random() > 0.3 ? 'pass' : 'warn', detail: Math.random() > 0.3 ? 'Configured properly' : 'Not configured', category: 'DNS', severity: Math.random() > 0.3 ? 'low' : 'medium' },
        { label: 'Open Ports', status: 'pass', detail: 'No unnecessary ports exposed', category: 'Network', severity: 'low' },
        { label: 'Technology Stack', status: 'pass', detail: 'Modern framework detected', category: 'Technology', severity: 'low' }
      ]
    };
    
    setScanResults(results);
    setSelectedUrl(url);
    setCurrentView('results');
  };

  const handleViewHistory = () => setCurrentView('history');
  const handleViewProfile = () => setCurrentView('profile');
  const handleBackToDashboard = () => setCurrentView('dashboard');
  
  const openPopup = (cardId) => {
    setSelectedCard(cardId);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setSelectedCard(null);
    document.body.style.overflow = 'auto';
  };

  const handleGenerateReport = (url) => {
    const targetUrl = url || selectedUrl || 'website';
    alert(`📄 Generating PDF Report for ${targetUrl}...\n\nReport includes:\n• Website Summary\n• Security Score\n• Scan Results\n• Detailed Findings\n• Security Recommendations`);
  };

  const stats = {
    score: scanResults?.score || 84,
    scans: scanHistory.length,
    critical: scanResults?.findings?.filter(f => f.status === 'fail' || f.status === 'warn').length || 2,
    reports: reports.length,
  };

  // ============================================================
  // RESULTS VIEW
  // ============================================================
  if (currentView === 'results' && scanResults) {
    return (
      <div className="dashboard-page">
        <div className="dash-header">
          <div className="dash-header-left">
            <button className="back-btn" onClick={handleBackToDashboard}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <div className="dash-user">
              <i className="fas fa-user-circle"></i>
              <span>{user?.name || 'User'}</span>
            </div>
          </div>
          <button className="dash-logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        <div className="results-full-view">
          <div className="results-header-full">
            <h2><i className="fas fa-chart-simple"></i> Security Analysis: {scanResults.url}</h2>
            <div className="results-actions">
              <button className="btn-pdf" onClick={() => handleGenerateReport(scanResults.url)}>
                <i className="fas fa-file-pdf"></i> Generate Report
              </button>
              <button className="btn-secondary" onClick={handleBackToDashboard}>
                <i className="fas fa-arrow-left"></i> Back
              </button>
            </div>
          </div>

          <div className="results-score-banner">
            <div className="score-circle" style={{ 
              borderColor: scanResults.score >= 80 ? '#1e7b4c' : scanResults.score >= 60 ? '#b9692b' : '#b34033',
              color: scanResults.score >= 80 ? '#1e7b4c' : scanResults.score >= 60 ? '#b9692b' : '#b34033'
            }}>
              {scanResults.score}
            </div>
            <div className="score-details">
              <h3>Security Score: {scanResults.score >= 80 ? 'Good' : scanResults.score >= 60 ? 'Fair' : 'Poor'}</h3>
              <p>Based on {scanResults.findings.length} security checks</p>
            </div>
          </div>

          <div className="result-detail-card full-width">
            <h4><i className="fas fa-lock"></i> SSL/TLS Analysis</h4>
            <div className="detail-grid">
              <div className="detail-item"><span>Status:</span> <span className="status pass">✓ Valid</span></div>
              <div className="detail-item"><span>Issuer:</span> <span>{scanResults.ssl.issuer}</span></div>
              <div className="detail-item"><span>Expires:</span> <span>{scanResults.ssl.expiryDate}</span></div>
              <div className="detail-item"><span>Days Left:</span> <span>{scanResults.ssl.daysLeft} days</span></div>
            </div>
          </div>

          <div className="result-detail-card full-width">
            <h4><i className="fas fa-code"></i> HTTP Security Headers</h4>
            <div className="detail-grid">
              <div className="detail-item"><span>CSP:</span> <span className="status pass">✓ Configured</span></div>
              <div className="detail-item"><span>HSTS:</span> <span className="status pass">✓ Enabled</span></div>
              <div className="detail-item"><span>X-Frame-Options:</span> <span className="status pass">DENY</span></div>
              <div className="detail-item"><span>X-Content-Type:</span> <span className="status pass">nosniff</span></div>
            </div>
          </div>

          <div className="result-detail-card full-width">
            <h4><i className="fas fa-network-wired"></i> DNS Configuration</h4>
            <div className="detail-grid">
              <div className="detail-item"><span>A Records:</span> <span>{scanResults.dns.aRecords.join(', ')}</span></div>
              <div className="detail-item"><span>MX Records:</span> <span>{scanResults.dns.mxRecords.join(', ')}</span></div>
              <div className="detail-item"><span>Name Servers:</span> <span>{scanResults.dns.nameServers.join(', ')}</span></div>
            </div>
          </div>

          <div className="result-detail-card full-width">
            <h4><i className="fas fa-microchip"></i> Technology Stack</h4>
            <div className="detail-grid">
              <div className="detail-item"><span>Web Server:</span> <span>{scanResults.tech.webServer}</span></div>
              <div className="detail-item"><span>Framework:</span> <span>{scanResults.tech.framework}</span></div>
              <div className="detail-item"><span>CDN:</span> <span>{scanResults.tech.cdn}</span></div>
            </div>
          </div>

          <div className="findings-full-list">
            <h4><i className="fas fa-list"></i> Detailed Findings</h4>
            {scanResults.findings.map((finding, index) => (
              <div key={index} className="finding-item-full">
                <div className="finding-icon">
                  {finding.status === 'pass' && <i className="fas fa-check-circle" style={{ color: '#1e7b4c' }}></i>}
                  {finding.status === 'warn' && <i className="fas fa-exclamation-triangle" style={{ color: '#b9692b' }}></i>}
                  {finding.status === 'fail' && <i className="fas fa-times-circle" style={{ color: '#b34033' }}></i>}
                </div>
                <div className="finding-content">
                  <div className="finding-label">{finding.label}</div>
                  <div className="finding-detail">{finding.detail}</div>
                </div>
                <div className={`finding-severity ${finding.severity}`}>{finding.severity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // HISTORY FULL PAGE VIEW - BEAUTIFUL DESIGN
  // ============================================================
  if (currentView === 'history') {
    return (
      <div className="dashboard-page">
        <div className="dash-header">
          <div className="dash-header-left">
            <button className="back-btn" onClick={handleBackToDashboard}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <div className="dash-user">
              <i className="fas fa-user-circle"></i>
              <span>{user?.name || 'User'}</span>
            </div>
          </div>
          <button className="dash-logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        {/* Full History Component with beautiful design */}
        <History history={scanHistory} isFullPage={true} />
      </div>
    );
  }

  // ============================================================
  // PROFILE VIEW
  // ============================================================
  if (currentView === 'profile') {
    return (
      <div className="dashboard-page">
        <div className="dash-header">
          <div className="dash-header-left">
            <button className="back-btn" onClick={handleBackToDashboard}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <div className="dash-user">
              <i className="fas fa-user-circle"></i>
              <span>{user?.name || 'User'}</span>
            </div>
          </div>
          <button className="dash-logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        <Profile 
          user={user} 
          onLogout={onLogout} 
          scanHistory={scanHistory}
          onSelectScan={handleProfileSelectScan}
        />
      </div>
    );
  }

  // ============================================================
  // MAIN DASHBOARD VIEW - Simple History Preview
  // ============================================================
  const selectedCardData = selectedCard ? featureCards.find(c => c.id === selectedCard) : null;

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dash-header">
        <div className="dash-user">
          <i className="fas fa-user-circle"></i>
          <span>{user?.name || 'User'}</span>
        </div>
        <div className="dash-header-actions">
          <button className="dash-nav-btn" onClick={handleViewProfile}>
            <i className="fas fa-user"></i> Profile
          </button>
          <button className="dash-nav-btn" onClick={handleViewHistory}>
            <i className="fas fa-clock-rotate-left"></i> History
          </button>
          <button className="dash-logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* Dashboard Overview Title */}
      <h1 className="dashboard-overview-title">
        <i className="fas fa-th-large"></i> Dashboard Overview
        <span>Monitor your website's security posture at a glance</span>
      </h1>

      {/* Stats Cards */}
      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-shield"></i></div>
          <div className="stat-content">
            <h4>Security Score</h4>
            <div className="value">{stats.score}</div>
            <div className="sub">{stats.score >= 80 ? 'Good' : 'Needs attention'}</div>
          </div>
        </div>
        <div className="stat-card" onClick={handleViewHistory}>
          <div className="stat-icon"><i className="fas fa-globe"></i></div>
          <div className="stat-content">
            <h4>Scans</h4>
            <div className="value">{stats.scans}</div>
            <div className="sub">total scans</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-triangle-exclamation"></i></div>
          <div className="stat-content">
            <h4>Issues Found</h4>
            <div className="value">{stats.critical}</div>
            <div className="sub">need attention</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-file-pdf"></i></div>
          <div className="stat-content">
            <h4>Reports</h4>
            <div className="value">{stats.reports}</div>
            <div className="sub">ready to download</div>
          </div>
        </div>
      </div>

      {/* Scan Component */}
      <Scan onScan={handleScan} scanResults={scanResults} />

      {/* ===== FEATURE EXPLANATION CARDS ===== */}
      <div className="features-section">
        <div className="features-header">
          <h3 className="features-title">
            <i className="fas fa-graduation-cap"></i> 
            Understanding Your Security Scan
          </h3>
          <p className="features-subtitle">
            Click on any card to learn more about what each security check does and why it matters.
          </p>
        </div>
        
        <div className="features-grid">
          {featureCards.map((card) => (
            <div 
              key={card.id} 
              className="feature-card"
              onClick={() => openPopup(card.id)}
            >
              <div className="feature-card-header">
                <div className="feature-icon" style={{ background: card.color }}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <div className="feature-title">
                  <h4>{card.title}</h4>
                </div>
                <div className="feature-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
              
              <div className="feature-description">
                <p>{card.description}</p>
              </div>
              
              <div className="feature-checks-preview">
                {card.checks.slice(0, 3).map((check, index) => (
                  <span key={index} className="check-tag">{check}</span>
                ))}
                {card.checks.length > 3 && (
                  <span className="check-tag more">+{card.checks.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== POPUP MODAL ===== */}
      {selectedCardData && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="popup-header">
              <div className="popup-icon" style={{ background: selectedCardData.color }}>
                <i className={`fas ${selectedCardData.icon}`}></i>
              </div>
              <h2>{selectedCardData.title}</h2>
            </div>
            
            <div className="popup-body">
              <div className="popup-description">
                <p>{selectedCardData.description}</p>
              </div>
              
              <div className="popup-why-matters">
                <h4><i className="fas fa-exclamation-circle"></i> Why It Matters</h4>
                <p>{selectedCardData.whyItMatters}</p>
              </div>
              
              <div className="popup-checks">
                <h4><i className="fas fa-list-check"></i> What We Check</h4>
                <ul>
                  {selectedCardData.details.map((detail, index) => (
                    <li key={index}>
                      <span className="check-label">{detail.label}</span>
                      <span className="check-description">{detail.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
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

      {/* Results Preview */}
      {scanResults && (
        <Results findings={scanResults.findings || []} />
      )}
      
      {/* History Preview - SIMPLE VERSION for dashboard */}
      <div className="history-list">
        <div className="history-header">
          <span><i className="fas fa-clock-rotate-left"></i> Recent Scans</span>
          <span className="history-count">{scanHistory?.length || 0} scans</span>
        </div>
        {scanHistory && scanHistory.length > 0 ? (
          scanHistory.slice(0, 3).map((item) => (
            <div className="history-item" key={item.id}>
              <div className="history-item-left">
                <span className="history-status-icon">
                  {item.status === 'pass' && <i className="fas fa-check-circle" style={{ color: '#1e7b4c' }}></i>}
                  {item.status === 'warn' && <i className="fas fa-exclamation-triangle" style={{ color: '#b9692b' }}></i>}
                  {item.status === 'fail' && <i className="fas fa-times-circle" style={{ color: '#b34033' }}></i>}
                </span>
                <span className="site">{item.url}</span>
              </div>
              <div className="history-item-right">
                <span className="date">{item.date}</span>
                <span className={`score ${item.score >= 80 ? 'score-high' : item.score >= 60 ? 'score-medium' : 'score-low'}`}>
                  {item.score}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="history-empty">
            <p>No scans yet. Run your first scan above!</p>
          </div>
        )}
        {scanHistory && scanHistory.length > 3 && (
          <div className="history-view-all" onClick={handleViewHistory}>
            <span>View all {scanHistory.length} scans <i className="fas fa-arrow-right"></i></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;