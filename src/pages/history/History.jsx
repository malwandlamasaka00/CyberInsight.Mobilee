// src/pages/history/History.jsx
import React, { useState, useEffect } from "react";
import { historyService } from "../../services/historyService";
import { getIssuesFoundCount } from "../../utils/scanUtils";
import { 
  Search, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
  Info,
  Lightbulb,
  X,
  TrendingUp,
  History as HistoryIcon,
  FileText,
  FileDown
} from 'lucide-react';
import './History.css';

// Import PDF libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [scans, setScans] = useState([]);

  useEffect(() => {
    const history = historyService.getHistory();
    setScans(history);
  }, []); 

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-green';
    if (score >= 50) return 'score-yellow';
    return 'score-red';
  };

  const getStatusFromScore = (score) => {
    if (score >= 80) return "Secure";
    if (score >= 50) return "Needs Improvement";
    return "Critical";
  };

  const getStatusBadge = (score) => {
    if (score >= 80) {
      return (
        <span className="status-badge secure">
          <CheckCircle size={11} /> Secure
        </span>
      );
    }

    if (score >= 50) {
      return (
        <span className="status-badge moderate">
          <AlertTriangle size={11} /> Needs Improvement
        </span>
      );
    }

    return (
      <span className="status-badge critical">
        <XCircle size={11} /> Critical
      </span>
    );
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle size={14} className="icon-green" />;
    if (score >= 50) return <AlertTriangle size={14} className="icon-yellow" />;
    return <XCircle size={14} className="icon-red" />;
  };

  // Generate detailed findings for a scan with PDF-based recommendations
  const getScanDetails = (scan) => {
    // If scan has checks array and it's not empty, use it
    if (scan.checks && Array.isArray(scan.checks) && scan.checks.length > 0) {
      return scan.checks.map(check => {
        const isPassed = check.status === "Passed";
        const isWarning = check.status === "Warning";
        const isFailed = check.status === "Failed";

        // Get recommendation based on check name and status
        const getRecommendation = (checkName, status) => {
          const isPass = status === "Passed";
          const isWarn = status === "Warning";
          const isFail = status === "Failed";

          // SSL/TLS Recommendations
          if (checkName === "SSL/TLS") {
            if (isPass) return "✅ SSL certificate is valid and secure. No action required.";
            if (isWarn) return "⚠️ Certificate expires soon. Renew within 30 days.";
            return "🚨 SSL certificate is invalid or expired. Renew immediately.";
          }

          // HTTP Security Headers Recommendations
          if (checkName === "Security Headers") {
            if (isPass) return "✅ All security headers are properly configured.";
            if (isWarn) return "⚠️ Some security headers missing. Implement CSP, HSTS, X-Frame-Options.";
            return "🚨 Critical headers missing. Implement security headers immediately.";
          }

          // DNS Configuration Recommendations
          if (checkName === "DNS Configuration") {
            if (isPass) return "✅ DNS is properly configured. Consider adding SPF, DKIM, DMARC.";
            if (isWarn) return "⚠️ DNS issues detected. Review A, MX, and TXT records.";
            return "🚨 DNS is misconfigured. Correct DNS records and configure SPF, DKIM, DMARC.";
          }

          // Network Security Recommendations
          if (checkName === "Network Security") {
            if (isPass) return "✅ No open ports detected. Network is secured.";
            if (isWarn) return "⚠️ Some services exposed. Close unnecessary ports.";
            return "🚨 Critical services exposed. Close all unnecessary open ports immediately.";
          }

          // WHOIS Information Recommendations
          if (checkName === "WHOIS Information") {
            if (isPass) return "✅ Domain information verified. Keep WHOIS details updated.";
            if (isWarn) return "⚠️ Domain registration issues detected. Review registration details.";
            return "🚨 Domain information missing or invalid. Verify and update WHOIS details.";
          }

          // Technology Detection Recommendations
          if (checkName === "Technologies") {
            if (isPass) return "✅ No vulnerable technologies detected. Keep all technologies updated.";
            if (isWarn) return "⚠️ Outdated technologies found. Update to latest versions.";
            return "🚨 Vulnerable technologies detected. Update immediately to secure versions.";
          }

          // Default recommendation
          if (isPass) return "✅ Check passed. No action required.";
          if (isWarn) return "⚠️ Review and address the issue.";
          return "🚨 Critical issue. Immediate action required.";
        };

        // Get impact based on check name and status
        const getImpact = (checkName, status) => {
          const isPass = status === "Passed";
          const isWarn = status === "Warning";
          const isFail = status === "Failed";

          if (checkName === "SSL/TLS") {
            if (isPass) return "SSL/TLS encryption protects data in transit.";
            if (isWarn) return "Expiring certificates will cause security warnings.";
            return "Invalid certificates expose all transmitted data to interception.";
          }

          if (checkName === "Security Headers") {
            if (isPass) return "Headers protect against XSS, clickjacking, and MIME sniffing.";
            if (isWarn) return "Missing headers expose website to web-based attacks.";
            return "Missing critical headers leave website vulnerable to attacks.";
          }

          if (checkName === "DNS Configuration") {
            if (isPass) return "Proper DNS ensures reliable domain resolution and email security.";
            if (isWarn) return "DNS issues can lead to email delivery problems.";
            return "Misconfigured DNS allows spoofing and potential domain takeover.";
          }

          if (checkName === "Network Security") {
            if (isPass) return "Secure network configuration minimizes attack surface.";
            if (isWarn) return "Exposed services provide additional entry points for attackers.";
            return "Open ports provide direct entry points for attackers.";
          }

          if (checkName === "WHOIS Information") {
            if (isPass) return "Valid domain information helps establish trust.";
            if (isWarn) return "Registration issues could affect domain ownership verification.";
            return "Missing or invalid information could indicate fraud or ownership issues.";
          }

          if (checkName === "Technologies") {
            if (isPass) return "Up-to-date technologies reduce known vulnerabilities.";
            if (isWarn) return "Outdated technologies contain known vulnerabilities.";
            return "Vulnerable technologies are common entry points for attackers.";
          }

          return isPass ? "✅ Security check passed." : isWarn ? "⚠️ Security concern detected." : "🚨 Critical security issue detected.";
        };

        return {
          label: check.name,
          detail: check.details || "Check completed",
          status: isPassed ? "pass" : isWarning ? "warn" : "fail",
          severity: isPassed ? "low" : isWarning ? "medium" : "high",
          impact: getImpact(check.name, check.status),
          recommendation: getRecommendation(check.name, check.status)
        };
      });
    }

    // ===== FALLBACK: Generate findings from the scan's score and status =====
    const score = scan.score || 0;
    const findings = [];
    
    // Determine overall security level
    const isSecure = score >= 80;
    const isWarning = score >= 50 && score < 80;
    const isCritical = score < 50;

    // SSL/TLS - Use scan's sslStatus if available, otherwise infer from score
    let sslStatus = 'pass';
    let sslDetail = 'Valid certificate';
    let sslRecommendation = '✅ SSL certificate is valid and secure. No action required.';
    let sslImpact = 'SSL/TLS encryption protects data in transit.';

    if (scan.sslStatus === 'expired') { 
      sslStatus = 'fail'; 
      sslDetail = 'Certificate expired'; 
      sslRecommendation = '🚨 SSL certificate is expired. Renew immediately.';
      sslImpact = 'Expired certificates expose all transmitted data to interception.';
    } else if (scan.sslStatus === 'expiring') { 
      sslStatus = 'warn'; 
      sslDetail = 'Certificate expires soon'; 
      sslRecommendation = '⚠️ Certificate expires soon. Renew within 30 days.';
      sslImpact = 'Expiring certificates will cause security warnings.';
    } else if (isCritical) {
      sslStatus = 'fail';
      sslDetail = 'Certificate validation failed';
      sslRecommendation = '🚨 SSL certificate is invalid. Renew immediately.';
      sslImpact = 'Invalid certificates expose all transmitted data to interception.';
    } else if (isWarning) {
      sslStatus = 'warn';
      sslDetail = 'Certificate needs review';
      sslRecommendation = '⚠️ Review SSL certificate configuration. Ensure it is valid and not expiring soon.';
      sslImpact = 'SSL certificate issues could lead to security warnings.';
    }
    
    findings.push({
      label: 'SSL/TLS',
      detail: sslDetail,
      status: sslStatus,
      severity: sslStatus === 'pass' ? 'low' : sslStatus === 'warn' ? 'medium' : 'high',
      impact: sslImpact,
      recommendation: sslRecommendation
    });

    // Security Headers
    let headerStatus = 'pass';
    let headerDetail = 'All headers present';
    let headerRecommendation = '✅ All security headers are properly configured.';
    let headerImpact = 'Headers protect against XSS, clickjacking, and MIME sniffing.';

    if (scan.cspStatus === 'missing' || scan.hstsStatus === 'missing') { 
      headerStatus = 'fail'; 
      headerDetail = 'Critical headers missing';
      headerRecommendation = '🚨 Critical headers missing. Implement CSP, HSTS, X-Frame-Options, X-Content-Type-Options.';
      headerImpact = 'Missing critical headers leave website vulnerable to attacks.';
    } else if (scan.cspStatus === 'partial' || scan.hstsStatus === 'weak') { 
      headerStatus = 'warn'; 
      headerDetail = 'Some headers missing or weak';
      headerRecommendation = '⚠️ Some headers missing or weak. Implement CSP, HSTS, X-Frame-Options.';
      headerImpact = 'Missing or weak headers expose website to web-based attacks.';
    } else if (isCritical) {
      headerStatus = 'fail';
      headerDetail = 'Headers not properly configured';
      headerRecommendation = '🚨 Critical headers missing. Implement security headers immediately.';
      headerImpact = 'Missing security headers leave website vulnerable to attacks.';
    } else if (isWarning) {
      headerStatus = 'warn';
      headerDetail = 'Some headers missing';
      headerRecommendation = '⚠️ Review security headers. Ensure CSP, HSTS, X-Frame-Options are configured.';
      headerImpact = 'Missing security headers could expose website to various web attacks.';
    }
    
    findings.push({
      label: 'Security Headers',
      detail: headerDetail,
      status: headerStatus,
      severity: headerStatus === 'pass' ? 'low' : headerStatus === 'warn' ? 'medium' : 'high',
      impact: headerImpact,
      recommendation: headerRecommendation
    });

    // DNS Configuration
    let dnsStatus = 'pass';
    let dnsDetail = 'Properly configured';
    let dnsRecommendation = '✅ DNS is properly configured. Consider adding SPF, DKIM, DMARC.';
    let dnsImpact = 'Proper DNS ensures reliable domain resolution and email security.';

    if (scan.spfStatus === 'missing') { 
      dnsStatus = 'fail'; 
      dnsDetail = 'SPF missing';
      dnsRecommendation = '🚨 SPF records missing. Configure SPF, DKIM, DMARC immediately.';
      dnsImpact = 'Misconfigured DNS allows spoofing and potential domain takeover.';
    } else if (scan.spfStatus === 'partial') { 
      dnsStatus = 'warn'; 
      dnsDetail = 'SPF partially configured';
      dnsRecommendation = '⚠️ SPF incomplete. Fix SPF records and consider DKIM, DMARC.';
      dnsImpact = 'Incomplete DNS configuration could lead to email delivery problems.';
    } else if (isCritical) {
      dnsStatus = 'fail';
      dnsDetail = 'DNS misconfigured';
      dnsRecommendation = '🚨 DNS misconfigured. Correct DNS records and configure SPF, DKIM, DMARC.';
      dnsImpact = 'Misconfigured DNS leaves domain vulnerable to spoofing and takeover.';
    } else if (isWarning) {
      dnsStatus = 'warn';
      dnsDetail = 'DNS needs review';
      dnsRecommendation = '⚠️ Review DNS configuration. Ensure SPF, DKIM, DMARC are set up.';
      dnsImpact = 'DNS issues could lead to email delivery problems and security risks.';
    }
    
    findings.push({
      label: 'DNS Configuration',
      detail: dnsDetail,
      status: dnsStatus,
      severity: dnsStatus === 'pass' ? 'low' : dnsStatus === 'warn' ? 'medium' : 'high',
      impact: dnsImpact,
      recommendation: dnsRecommendation
    });

    // Network Security
    let netStatus = 'pass';
    let netDetail = 'No open ports';
    let netRecommendation = '✅ No open ports detected. Network is secured.';
    let netImpact = 'Secure network configuration minimizes attack surface.';

    if (scan.portsStatus === 'exposed') { 
      netStatus = 'fail'; 
      netDetail = 'Critical ports exposed';
      netRecommendation = '🚨 Critical services exposed. Close all unnecessary open ports immediately.';
      netImpact = 'Open ports provide direct entry points for attackers.';
    } else if (scan.portsStatus === 'warning') { 
      netStatus = 'warn'; 
      netDetail = 'Some services exposed';
      netRecommendation = '⚠️ Some services exposed. Close unnecessary open ports.';
      netImpact = 'Exposed services provide additional entry points for attackers.';
    } else if (isCritical) {
      netStatus = 'fail';
      netDetail = 'Network security issues detected';
      netRecommendation = '🚨 Network security issues detected. Close unnecessary ports and implement firewalls.';
      netImpact = 'Network vulnerabilities could provide entry points for attackers.';
    } else if (isWarning) {
      netStatus = 'warn';
      netDetail = 'Network needs review';
      netRecommendation = '⚠️ Review network security configuration. Ensure unnecessary ports are closed.';
      netImpact = 'Network configuration issues could provide additional attack vectors.';
    }
    
    findings.push({
      label: 'Network Security',
      detail: netDetail,
      status: netStatus,
      severity: netStatus === 'pass' ? 'low' : netStatus === 'warn' ? 'medium' : 'high',
      impact: netImpact,
      recommendation: netRecommendation
    });

    // WHOIS Information
    let whoisStatus = 'pass';
    let whoisDetail = 'Domain information verified';
    let whoisRecommendation = '✅ Domain information verified. Keep WHOIS details updated.';
    let whoisImpact = 'Valid domain information helps establish trust.';

    if (isCritical) {
      whoisStatus = 'fail';
      whoisDetail = 'Domain information invalid';
      whoisRecommendation = '🚨 Domain information missing or invalid. Verify and update WHOIS details.';
      whoisImpact = 'Missing or invalid information could indicate fraud or ownership issues.';
    } else if (isWarning) {
      whoisStatus = 'warn';
      whoisDetail = 'Domain needs review';
      whoisRecommendation = '⚠️ Review domain registration details. Ensure all information is current.';
      whoisImpact = 'Registration issues could affect domain ownership verification.';
    }
    
    findings.push({
      label: 'WHOIS Information',
      detail: whoisDetail,
      status: whoisStatus,
      severity: whoisStatus === 'pass' ? 'low' : whoisStatus === 'warn' ? 'medium' : 'high',
      impact: whoisImpact,
      recommendation: whoisRecommendation
    });

    // Technologies
    let techStatus = 'pass';
    let techDetail = 'No vulnerable technologies detected';
    let techRecommendation = '✅ No vulnerable technologies detected. Keep all technologies updated.';
    let techImpact = 'Up-to-date technologies reduce known vulnerabilities.';

    if (isCritical) {
      techStatus = 'fail';
      techDetail = 'Vulnerable technologies detected';
      techRecommendation = '🚨 Vulnerable technologies detected. Update immediately to secure versions.';
      techImpact = 'Vulnerable technologies are common entry points for attackers.';
    } else if (isWarning) {
      techStatus = 'warn';
      techDetail = 'Outdated technologies found';
      techRecommendation = '⚠️ Outdated technologies found. Update to latest versions.';
      techImpact = 'Outdated technologies contain known vulnerabilities.';
    }
    
    findings.push({
      label: 'Technologies',
      detail: techDetail,
      status: techStatus,
      severity: techStatus === 'pass' ? 'low' : techStatus === 'warn' ? 'medium' : 'high',
      impact: techImpact,
      recommendation: techRecommendation
    });

    return findings;
  };

  const getCriticalIssuesCount = (scan) => {
    if (!scan) return 0;
    
    // If scan has checks array, count failed and warning checks
    if (scan.checks && Array.isArray(scan.checks) && scan.checks.length > 0) {
      return scan.checks.filter(check => 
        check.status === "Failed" || check.status === "Warning"
      ).length;
    }
    
    // Fallback: Count based on score
    const score = scan.score || 0;
    if (score >= 80) return 0;
    if (score >= 50) return 1;
    return 2;
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

  // Filter and sort scans
  const getFilteredScans = () => {
    let filtered = scans;
    
    if (searchTerm) {
      filtered = filtered.filter(scan => 
        scan.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(scan => {
        if (filterStatus === 'secure') return scan.score >= 80;
        if (filterStatus === 'moderate') return scan.score >= 50 && scan.score < 80;
        if (filterStatus === 'critical') return scan.score < 50;
        return true;
      });
    }
    
    switch(sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.score - b.score);
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const filteredScans = getFilteredScans();
  const totalScans = scans.length;
  const totalPages = Math.ceil(filteredScans.length / 5);

  // Get stats
  const passCount = scans.filter(s => s.score >= 80).length;
  const warnCount = scans.filter(s => s.score >= 50 && s.score < 80).length;
  const failCount = scans.filter(s => s.score < 50).length;
  const avgScore = scans.length > 0 ? Math.round(scans.reduce((acc, s) => acc + s.score, 0) / scans.length) : 0;

  // ===== TOAST NOTIFICATION - TOP RIGHT =====
  const showToast = (message, type = 'success') => {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <span style="font-size: 20px;">${icons[type] || icons.success}</span>
      <span>${message}</span>
      <button class="toast-close" onclick="this.closest('.toast-notification').remove()">
        ✕
      </button>
    `;
    
    document.body.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.animation = 'slideOutToast 0.3s ease forwards';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 4000);
  };

  // ===== EXPORT AS PDF =====
  const handleExportPDF = async () => {
    setExporting(true);
    
    try {
      // Create a temporary container for the PDF content
      const container = document.createElement('div');
      container.style.cssText = `
        padding: 40px;
        background: white;
        font-family: Arial, sans-serif;
        color: #1a1a2e;
        width: 800px;
      `;
      
      // Build the HTML content
      let htmlContent = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d7aff; font-size: 28px; margin-bottom: 8px;">🛡️ Scan History Report</h1>
          <p style="color: #64748b; font-size: 14px;">Generated on ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #e9eff5; margin: 20px 0;">
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px;">
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #2d7aff;">${totalScans}</div>
            <div style="font-size: 12px; color: #64748b;">Total Scans</div>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #43e97b;">${passCount}</div>
            <div style="font-size: 12px; color: #64748b;">Secure</div>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #f5576c;">${failCount}</div>
            <div style="font-size: 12px; color: #64748b;">Critical</div>
          </div>
        </div>
        
        <h2 style="font-size: 18px; color: #1a1a2e; margin-bottom: 12px;">Scan Details</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Domain</th>
              <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Date</th>
              <th style="padding: 10px 12px; text-align: center; border-bottom: 2px solid #e2e8f0;">Score</th>
              <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Status</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      filteredScans.forEach(scan => {
        const statusText = getStatusFromScore(scan.score);
        const statusColor = scan.score >= 80 ? '#43e97b' : scan.score >= 50 ? '#fdcb6e' : '#f5576c';
        htmlContent += `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 12px; font-weight: 500;">${scan.domain}</td>
            <td style="padding: 10px 12px; color: #64748b;">${new Date(scan.date).toLocaleString()}</td>
            <td style="padding: 10px 12px; text-align: center; font-weight: 700;">${scan.score}%</td>
            <td style="padding: 10px 12px;">
              <span style="background: ${statusColor}15; color: ${statusColor}; padding: 2px 10px; border-radius: 12px; font-weight: 600; font-size: 11px;">${statusText}</span>
            </td>
          </tr>
        `;
      });
      
      htmlContent += `
          </tbody>
        </table>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9eff5; text-align: center; font-size: 11px; color: #94a3b8;">
          <p>This report was generated automatically by CyberInsight Security Scanner</p>
          <p>© ${new Date().getFullYear()} CyberInsight - All rights reserved</p>
        </div>
      `;
      
      container.innerHTML = htmlContent;
      document.body.appendChild(container);
      
      // Convert to PDF
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: container.scrollHeight
      });
      
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save(`scan_history_${new Date().toISOString().slice(0,10)}.pdf`);
      
      showToast('✅ Scan history exported as PDF successfully!', 'success');
    } catch (error) {
      console.error('PDF Export error:', error);
      showToast('❌ Failed to export PDF. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  // ===== DOWNLOAD SINGLE SCAN AS PDF =====
  const handleDownloadReportPDF = async (scan) => {
    setDownloading(true);
    
    try {
      const findings = getScanDetails(scan);
      
      const container = document.createElement('div');
      container.style.cssText = `
        padding: 40px;
        background: white;
        font-family: Arial, sans-serif;
        color: #1a1a2e;
        width: 800px;
      `;
      
      const statusColor = scan.score >= 80 ? '#43e97b' : scan.score >= 50 ? '#fdcb6e' : '#f5576c';
      const statusText = getStatusFromScore(scan.score);
      const issuesCount = getCriticalIssuesCount(scan);
      
      let findingsHTML = '';
      findings.forEach(f => {
        const fColor = f.status === 'pass' ? '#43e97b' : f.status === 'warn' ? '#fdcb6e' : '#f5576c';
        findingsHTML += `
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid ${fColor};">
            <div style="font-weight: 600; font-size: 14px; color: #1a1a2e;">${f.label}</div>
            <div style="font-size: 12px; color: #475569; margin: 4px 0;">${f.detail}</div>
            <div style="font-size: 11px; color: #64748b;"><strong>Impact:</strong> ${f.impact}</div>
            <div style="font-size: 11px; color: ${fColor}; margin-top: 4px;">💡 <strong>Recommendation:</strong> ${f.recommendation}</div>
          </div>
        `;
      });
      
      const htmlContent = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d7aff; font-size: 28px; margin-bottom: 4px;">🛡️ Security Scan Report</h1>
          <p style="color: #64748b; font-size: 14px;">Generated on ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #e9eff5; margin: 20px 0;">
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <div>
            <div style="font-size: 12px; color: #64748b;">Domain</div>
            <div style="font-size: 18px; font-weight: 700; color: #1a1a2e;">${scan.domain}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #64748b;">Security Score</div>
            <div style="font-size: 32px; font-weight: 800; color: ${statusColor};">${scan.score}%</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #64748b;">Status</div>
            <span style="background: ${statusColor}15; color: ${statusColor}; padding: 4px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">${statusText}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 12px; color: #64748b; display: flex; gap: 24px;">
            <span><strong>Date:</strong> ${new Date(scan.date).toLocaleString()}</span>
            <span><strong>Scan ID:</strong> #${scan.id}</span>
            <span><strong>Issues Found:</strong> ${issuesCount > 0 ? issuesCount : 'None'}</span>
          </div>
        </div>
        
        <h2 style="font-size: 18px; color: #1a1a2e; margin: 20px 0 12px 0;">Detailed Findings</h2>
        ${findingsHTML}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9eff5; text-align: center; font-size: 11px; color: #94a3b8;">
          <p>This report was generated automatically by CyberInsight Security Scanner</p>
          <p>© ${new Date().getFullYear()} CyberInsight - All rights reserved</p>
        </div>
      `;
      
      container.innerHTML = htmlContent;
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: container.scrollHeight
      });
      
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save(`scan_report_${scan.domain}_${new Date().toISOString().slice(0,10)}.pdf`);
      
      showToast(`📄 Report for ${scan.domain} downloaded as PDF successfully!`, 'success');
    } catch (error) {
      console.error('PDF Download error:', error);
      showToast('❌ Failed to download report. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="history-container">
      {/* ===== BLUE HEADER LIKE PROFILE ===== */}
      <div className="history-header-blue">
        <div className="history-header-content">
          <div>
            <h1 className="history-title-blue">
              <HistoryIcon size={28} />
              Scan History
            </h1>
            <p className="history-subtitle-blue">View all your past security scans and detailed reports</p>
          </div>
          <button 
            className="export-btn-blue cursor-target" 
            onClick={handleExportPDF}
            disabled={exporting || filteredScans.length === 0}
          >
            {exporting ? (
              <>
                <span className="spinner-small"></span>
                Generating PDF...
              </>
            ) : (
              <>
                <FileDown size={18} />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="history-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Shield size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Scans</span>
            <span className="stat-value">{totalScans}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Secure</span>
            <span className="stat-value" style={{ color: '#43e97b' }}>{passCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Needs Improvement</span>
            <span className="stat-value" style={{ color: '#fdcb6e' }}>{warnCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <XCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Critical</span>
            <span className="stat-value" style={{ color: '#f5576c' }}>{failCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Avg Score</span>
            <span className="stat-value">{avgScore}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input cursor-target"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="filter-group">
          <select 
            className="filter-select cursor-target"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="secure">🟢 Secure</option>
            <option value="moderate">🟡 Needs Improvement</option>
            <option value="critical">🔴 Critical</option>
          </select>
          <select 
            className="filter-select cursor-target"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th className="col-domain">Domain</th>
              <th className="col-date">Date</th>
              <th className="col-score">Score</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScans.length > 0 ? (
              filteredScans.map((scan) => (
                <tr key={scan.id} className="scan-row" onClick={() => handleScanClick(scan)}>
                  <td className="col-domain">
                    <span className="domain-name">{scan.domain}</span>
                  </td>
                  <td className="col-date">
                    <div className="date-cell">
                      <Clock size={13} />
                      {new Date(scan.date).toLocaleString()}
                    </div>
                  </td>
                  <td className="col-score">
                    <span className={`score-value ${getScoreColor(scan.score)}`}>
                      {getScoreIcon(scan.score)}
                      {scan.score}%
                    </span>
                  </td>
                  <td className="col-status">
                    {getStatusBadge(scan.score)}
                  </td>
                  <td className="col-actions">
                    <div className="actions-cell">
                      <button 
                        className="action-btn view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScanClick(scan);
                        }}
                        title="View Full Report"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn download-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadReportPDF(scan);
                        }}
                        title="Download PDF Report"
                        disabled={downloading}
                      >
                        {downloading ? (
                          <span className="spinner-small"></span>
                        ) : (
                          <FileText size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  <div className="empty-state-content">
                    <Search size={40} className="empty-icon" />
                    <h3>No scans found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredScans.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {filteredScans.length} of {totalScans} scans
          </div>
          <div className="pagination-controls">
            <button 
              className="page-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 3))].map((_, i) => (
              <button 
                key={i}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 3 && <span className="page-dots">...</span>}
            {totalPages > 3 && (
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
            <button 
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ===== SCAN RESULTS POPUP ===== */}
      {selectedScan && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container scan-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={closePopup}>
              <X size={20} />
            </button>
            
            <div className="popup-header">
              <div className="popup-icon" style={{ 
                background: selectedScan.score >= 80 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 
                           selectedScan.score >= 50 ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' : 
                           'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <Shield size={28} />
              </div>
              <div className="popup-title">
                <h2>{selectedScan.domain}</h2>
                <span className="popup-date"><Calendar size={14} /> {new Date(selectedScan.date).toLocaleString()}</span>
                <span className="popup-id">Scan ID: #{selectedScan.id}</span>
              </div>
            </div>

            <div className="popup-score-section">
              <div className="popup-score-circle" style={{ 
                borderColor: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 50 ? '#fdcb6e' : '#f5576c',
                color: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 50 ? '#fdcb6e' : '#f5576c'
              }}>
                {selectedScan.score}
              </div>
              <div className="popup-score-info">
                <h3>
                  Security Score: {
                    selectedScan.score >= 80
                      ? 'Secure'
                      : selectedScan.score >= 50
                      ? 'Needs Improvement'
                      : 'Critical'
                  }
                </h3>
                <p>
                  Status:
                  <span
                    className={`status-badge ${
                      selectedScan.score >= 80
                        ? "secure"
                        : selectedScan.score >= 50
                        ? "moderate"
                        : "critical"
                    }`}
                  >
                    {getStatusFromScore(selectedScan.score)}
                  </span>
                </p>
                <div className="popup-stats-mini">
                  <span><CheckCircle size={14} /> {getCriticalIssuesCount(selectedScan) === 0 ? 'No Issues Found' : `${getCriticalIssuesCount(selectedScan)} Issues Found`}</span>
                </div>
              </div>
            </div>

<div className="popup-findings">
  <h4><Info size={18} /> Detailed Findings</h4>
  {getScanDetails(selectedScan).map((finding, index) => (
    <div key={index} className={`popup-finding-item ${finding.status}`}>
      <div className="finding-icon">
        {finding.status === 'pass' && <CheckCircle size={18} style={{ color: '#43e97b' }} />}
        {finding.status === 'warn' && <AlertTriangle size={18} style={{ color: '#fdcb6e' }} />}
        {finding.status === 'fail' && <XCircle size={18} style={{ color: '#f5576c' }} />}
      </div>
      <div className="finding-content">
        <div className="finding-label">{finding.label}</div>
        <div className="finding-detail">{finding.detail}</div>
        <div className="finding-impact"><strong>Impact:</strong> {finding.impact}</div>
        <div className="finding-recommendation">
          <Lightbulb size={14} /> <strong>Recommendation:</strong> {finding.recommendation}
        </div>
      </div>
      <div className={`finding-severity ${finding.severity}`}>{finding.severity}</div>
    </div>
  ))}
</div>

            <div className="popup-footer">
              <button className="btn-secondary" onClick={closePopup}>
                <X size={16} /> Close
              </button>
              <button 
                className="btn-download"
                onClick={() => {
                  handleDownloadReportPDF(selectedScan);
                }}
                disabled={downloading}
              >
                {downloading ? (
                  <span className="spinner-small"></span>
                ) : (
                  <FileText size={16} />
                )}
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;