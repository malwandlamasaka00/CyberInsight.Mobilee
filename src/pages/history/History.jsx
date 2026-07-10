// src/pages/history/History.jsx
import React, { useState } from 'react';
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

  const scans = [
    { 
      id: 1, 
      domain: 'example.com', 
      date: '2026-07-09T14:30:00Z', 
      score: 92, 
      status: 'pass', 
      critical: 0,
      sslStatus: 'valid',
      cspStatus: 'configured',
      hstsStatus: 'enabled',
      spfStatus: 'configured',
      portsStatus: 'secured'
    },
    { 
      id: 2, 
      domain: 'test-site.org', 
      date: '2026-07-09T12:15:00Z', 
      score: 65, 
      status: 'warn', 
      critical: 2,
      sslStatus: 'expiring',
      cspStatus: 'partial',
      hstsStatus: 'weak',
      spfStatus: 'partial',
      portsStatus: 'warning'
    },
    { 
      id: 3, 
      domain: 'myapp.io', 
      date: '2026-07-08T18:45:00Z', 
      score: 45, 
      status: 'fail', 
      critical: 4,
      sslStatus: 'expired',
      cspStatus: 'missing',
      hstsStatus: 'missing',
      spfStatus: 'missing',
      portsStatus: 'exposed'
    },
    { 
      id: 4, 
      domain: 'secure-site.com', 
      date: '2026-07-08T10:00:00Z', 
      score: 88, 
      status: 'pass', 
      critical: 1,
      sslStatus: 'valid',
      cspStatus: 'configured',
      hstsStatus: 'enabled',
      spfStatus: 'configured',
      portsStatus: 'secured'
    },
    { 
      id: 5, 
      domain: 'api-service.net', 
      date: '2026-07-07T16:20:00Z', 
      score: 71, 
      status: 'warn', 
      critical: 2,
      sslStatus: 'valid',
      cspStatus: 'partial',
      hstsStatus: 'enabled',
      spfStatus: 'configured',
      portsStatus: 'warning'
    },
    { 
      id: 6, 
      domain: 'ecommerce-store.org', 
      date: '2026-07-07T09:45:00Z', 
      score: 55, 
      status: 'warn', 
      critical: 3,
      sslStatus: 'expiring',
      cspStatus: 'partial',
      hstsStatus: 'weak',
      spfStatus: 'missing',
      portsStatus: 'warning'
    },
    { 
      id: 7, 
      domain: 'blog-platform.com', 
      date: '2026-07-06T14:10:00Z', 
      score: 82, 
      status: 'pass', 
      critical: 1,
      sslStatus: 'valid',
      cspStatus: 'configured',
      hstsStatus: 'enabled',
      spfStatus: 'configured',
      portsStatus: 'secured'
    },
    { 
      id: 8, 
      domain: 'auth-service.io', 
      date: '2026-07-06T11:30:00Z', 
      score: 93, 
      status: 'pass', 
      critical: 0,
      sslStatus: 'valid',
      cspStatus: 'configured',
      hstsStatus: 'enabled',
      spfStatus: 'configured',
      portsStatus: 'secured'
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-green';
    if (score >= 60) return 'score-yellow';
    if (score >= 40) return 'score-orange';
    return 'score-red';
  };

  const getStatusBadge = (status, score) => {
    if (status === 'pending') {
      return <span className="status-badge pending"><Clock size={11} /> Pending</span>;
    }
    if (status === 'pass' || score >= 80) {
      return <span className="status-badge secure"><CheckCircle size={11} /> Secure</span>;
    }
    if (status === 'warn' || score >= 60) {
      return <span className="status-badge moderate"><AlertTriangle size={11} /> Moderate</span>;
    }
    return <span className="status-badge critical"><XCircle size={11} /> Critical</span>;
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle size={14} className="icon-green" />;
    if (score >= 60) return <AlertTriangle size={14} className="icon-yellow" />;
    return <XCircle size={14} className="icon-red" />;
  };

  // Generate detailed findings for a scan
  const getScanDetails = (scan) => {
    const findings = [
      { 
        label: 'SSL Certificate', 
        status: scan.sslStatus === 'valid' ? 'pass' : scan.sslStatus === 'expiring' ? 'warn' : 'fail', 
        detail: scan.sslStatus === 'valid' ? 'Valid · 126 days left' : scan.sslStatus === 'expiring' ? 'Expiring soon · 15 days left' : 'Expired certificate',
        severity: scan.sslStatus === 'valid' ? 'low' : scan.sslStatus === 'expiring' ? 'medium' : 'high',
        impact: 'Protects data in transit between browser and server.',
        recommendation: scan.sslStatus === 'valid' ? 'Certificate is valid and secure' : scan.sslStatus === 'expiring' ? 'Renew certificate within 30 days' : 'Renew SSL certificate immediately'
      },
      { 
        label: 'Content-Security-Policy (CSP)', 
        status: scan.cspStatus === 'configured' ? 'pass' : scan.cspStatus === 'partial' ? 'warn' : 'fail', 
        detail: scan.cspStatus === 'configured' ? 'Configured properly' : scan.cspStatus === 'partial' ? 'Partially configured' : 'Missing',
        severity: scan.cspStatus === 'configured' ? 'low' : scan.cspStatus === 'partial' ? 'medium' : 'high',
        impact: 'Prevents XSS attacks by controlling resources.',
        recommendation: scan.cspStatus === 'configured' ? 'CSP is properly configured' : scan.cspStatus === 'partial' ? 'Add missing CSP directives' : 'Implement a Content Security Policy'
      },
      { 
        label: 'HSTS (Strict-Transport-Security)', 
        status: scan.hstsStatus === 'enabled' ? 'pass' : scan.hstsStatus === 'weak' ? 'warn' : 'fail', 
        detail: scan.hstsStatus === 'enabled' ? 'Enabled with valid config' : scan.hstsStatus === 'weak' ? 'Configured but weak' : 'Missing',
        severity: scan.hstsStatus === 'enabled' ? 'low' : scan.hstsStatus === 'weak' ? 'medium' : 'high',
        impact: 'Forces HTTPS connections to prevent downgrade attacks.',
        recommendation: scan.hstsStatus === 'enabled' ? 'HSTS is properly configured' : scan.hstsStatus === 'weak' ? 'Increase HSTS max-age' : 'Enable HSTS on your server'
      },
      { 
        label: 'SPF Record', 
        status: scan.spfStatus === 'configured' ? 'pass' : scan.spfStatus === 'partial' ? 'warn' : 'fail', 
        detail: scan.spfStatus === 'configured' ? 'Configured with proper records' : scan.spfStatus === 'partial' ? 'Partially configured' : 'Missing',
        severity: scan.spfStatus === 'configured' ? 'low' : scan.spfStatus === 'partial' ? 'medium' : 'high',
        impact: 'Prevents email spoofing and protects domain reputation.',
        recommendation: scan.spfStatus === 'configured' ? 'SPF is properly configured' : scan.spfStatus === 'partial' ? 'Update SPF records' : 'Configure SPF records'
      },
      { 
        label: 'Open Ports', 
        status: scan.portsStatus === 'secured' ? 'pass' : scan.portsStatus === 'warning' ? 'warn' : 'fail', 
        detail: scan.portsStatus === 'secured' ? 'No unnecessary ports exposed' : scan.portsStatus === 'warning' ? 'Some unnecessary ports open' : 'Critical ports exposed',
        severity: scan.portsStatus === 'secured' ? 'low' : scan.portsStatus === 'warning' ? 'medium' : 'high',
        impact: 'Reduces attack surface and minimizes entry points.',
        recommendation: scan.portsStatus === 'secured' ? 'All ports are properly secured' : scan.portsStatus === 'warning' ? 'Close unnecessary open ports' : 'Immediately close exposed critical ports'
      },
    ];
    return findings;
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
        if (filterStatus === 'secure') return scan.status === 'pass' || scan.score >= 80;
        if (filterStatus === 'moderate') return scan.status === 'warn' || (scan.score >= 60 && scan.score < 80);
        if (filterStatus === 'critical') return scan.status === 'fail' || scan.score < 60;
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
  const passCount = scans.filter(s => s.status === 'pass' || s.score >= 80).length;
  const warnCount = scans.filter(s => s.status === 'warn' || (s.score >= 60 && s.score < 80)).length;
  const failCount = scans.filter(s => s.status === 'fail' || s.score < 60).length;
  const avgScore = Math.round(scans.reduce((acc, s) => acc + s.score, 0) / scans.length);

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
              <th style="padding: 10px 12px; text-align: center; border-bottom: 2px solid #e2e8f0;">Critical Issues</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      filteredScans.forEach(scan => {
        const statusText = scan.status === 'pass' ? 'Secure' : scan.status === 'warn' ? 'Warning' : 'Critical';
        const statusColor = scan.status === 'pass' ? '#43e97b' : scan.status === 'warn' ? '#fdcb6e' : '#f5576c';
        htmlContent += `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 12px; font-weight: 500;">${scan.domain}</td>
            <td style="padding: 10px 12px; color: #64748b;">${new Date(scan.date).toLocaleString()}</td>
            <td style="padding: 10px 12px; text-align: center; font-weight: 700;">${scan.score}%</td>
            <td style="padding: 10px 12px;">
              <span style="background: ${statusColor}15; color: ${statusColor}; padding: 2px 10px; border-radius: 12px; font-weight: 600; font-size: 11px;">${statusText}</span>
            </td>
            <td style="padding: 10px 12px; text-align: center;">${scan.critical > 0 ? scan.critical : '✓'}</td>
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
      
      const statusColor = scan.status === 'pass' ? '#43e97b' : scan.status === 'warn' ? '#fdcb6e' : '#f5576c';
      const statusText = scan.status === 'pass' ? 'Secure' : scan.status === 'warn' ? 'Warning' : 'Critical';
      
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
            <span><strong>Critical Issues:</strong> ${scan.critical > 0 ? scan.critical : 'None'}</span>
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
            <span className="stat-label">Warnings</span>
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
            <option value="moderate">🟡 Moderate</option>
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
              <th className="col-critical">Critical Issues</th>
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
                    {getStatusBadge(scan.status, scan.score)}
                  </td>
                  <td className="col-critical">
                    {scan.critical > 0 ? (
                      <span className="critical-count">{scan.critical}</span>
                    ) : (
                      <span className="no-critical">✓ None</span>
                    )}
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
                <td colSpan="6" className="empty-state">
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
                           selectedScan.score >= 60 ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' : 
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
                borderColor: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c',
                color: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c'
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
                <div className="popup-stats-mini">
                  <span><CheckCircle size={14} /> {selectedScan.critical === 0 ? 'No critical issues' : `${selectedScan.critical} critical issues`}</span>
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
              <button className="btn-primary" onClick={closePopup}>
                <CheckCircle size={16} /> Got It
              </button>
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