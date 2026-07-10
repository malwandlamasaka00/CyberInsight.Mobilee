// src/pages/reports/Reports.jsx
import React, { useState } from 'react';
import { 
  FileText, Download, Eye, Calendar, Shield, 
  Search, ChevronLeft, ChevronRight,
  Clock, Award, AlertTriangle, CheckCircle,
  X, Plus, BarChart3, PieChart, TrendingUp, TrendingDown,
  Filter, RefreshCw, Printer
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const reports = [
    { 
      id: 1, 
      domain: 'example.com', 
      generated: '2026-07-09T15:00:00Z', 
      size: '2.4 MB', 
      type: 'Full Security Report',
      status: 'Ready',
      score: 92,
      findings: 3,
      critical: 0,
      warnings: 2,
      passed: 12
    },
    { 
      id: 2, 
      domain: 'test-site.org', 
      generated: '2026-07-09T12:30:00Z', 
      size: '1.8 MB', 
      type: 'SSL Report',
      status: 'Ready',
      score: 65,
      findings: 8,
      critical: 2,
      warnings: 4,
      passed: 6
    },
    { 
      id: 3, 
      domain: 'myapp.io', 
      generated: '2026-07-08T19:00:00Z', 
      size: '3.1 MB', 
      type: 'Full Security Report',
      status: 'Ready',
      score: 45,
      findings: 15,
      critical: 4,
      warnings: 6,
      passed: 4
    },
    { 
      id: 4, 
      domain: 'secure-site.com', 
      generated: '2026-07-08T10:00:00Z', 
      size: '2.1 MB', 
      type: 'Headers Report',
      status: 'Ready',
      score: 88,
      findings: 5,
      critical: 1,
      warnings: 3,
      passed: 10
    },
    { 
      id: 5, 
      domain: 'api-service.net', 
      generated: '2026-07-07T16:20:00Z', 
      size: '1.2 MB', 
      type: 'DNS Report',
      status: 'Processing',
      score: 71,
      findings: 6,
      critical: 2,
      warnings: 3,
      passed: 8
    },
    { 
      id: 6, 
      domain: 'ecommerce-store.org', 
      generated: '2026-07-07T09:45:00Z', 
      size: '4.2 MB', 
      type: 'Full Security Report',
      status: 'Ready',
      score: 55,
      findings: 12,
      critical: 3,
      warnings: 5,
      passed: 5
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'Ready') {
      return (
        <span className="report-status ready">
          <CheckCircle size={12} />
          Ready
        </span>
      );
    }
    return (
      <span className="report-status processing">
        <Clock size={12} />
        Processing
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Security Reports</h1>
          <p className="reports-subtitle">Generate and manage detailed security reports</p>
        </div>
        <div className="reports-header-actions">
          <button className="reports-header-btn cursor-target">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="generate-report-btn cursor-target">
            <Plus size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="reports-stats">
        <div className="reports-stat">
          <FileText size={16} className="stat-icon" />
          <div>
            <span className="stat-value">{reports.length}</span>
            <span className="stat-label">Total Reports</span>
          </div>
        </div>
        <div className="reports-stat">
          <CheckCircle size={16} className="stat-icon" style={{ color: 'var(--green)' }} />
          <div>
            <span className="stat-value">{reports.filter(r => r.status === 'Ready').length}</span>
            <span className="stat-label">Ready</span>
          </div>
        </div>
        <div className="reports-stat">
          <Clock size={16} className="stat-icon" style={{ color: 'var(--yellow)' }} />
          <div>
            <span className="stat-value">{reports.filter(r => r.status === 'Processing').length}</span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
        <div className="reports-stat">
          <Award size={16} className="stat-icon" style={{ color: 'var(--blue)' }} />
          <div>
            <span className="stat-value">89%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="reports-filters">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input cursor-target"
          />
        </div>
        <div className="filter-group">
          <select 
            className="filter-select cursor-target"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="Full Security Report">Full Security</option>
            <option value="SSL Report">SSL/TLS</option>
            <option value="Headers Report">Headers</option>
            <option value="DNS Report">DNS</option>
          </select>
          <select className="filter-select cursor-target">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Domain</th>
              <th>Type</th>
              <th>Score</th>
              <th>Findings</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="cursor-target">
                <td>
                  <div className="report-name-cell">
                    <div className="report-icon-small">
                      <Shield size={14} />
                    </div>
                    <span>#{report.id.toString().padStart(4, '0')}</span>
                  </div>
                </td>
                <td className="domain-cell">{report.domain}</td>
                <td className="type-cell">{report.type}</td>
                <td className="score-cell">
                  <span className="score-badge" style={{ 
                    background: getScoreColor(report.score) + '20',
                    color: getScoreColor(report.score)
                  }}>
                    {report.score}%
                  </span>
                </td>
                <td className="findings-cell">
                  <span className="findings-count">
                    <AlertTriangle size={12} className="findings-icon" />
                    {report.findings}
                  </span>
                </td>
                <td className="date-cell">
                  <Calendar size={14} />
                  {new Date(report.generated).toLocaleDateString()}
                </td>
                <td>{getStatusBadge(report.status)}</td>
                <td className="actions-cell">
                  <button className="action-btn cursor-target" onClick={() => openModal(report)}>
                    <Eye size={16} />
                  </button>
                  <button className="action-btn cursor-target">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing 1-{filteredReports.length} of {reports.length} reports
        </div>
        <div className="pagination-controls">
          <button className="page-btn cursor-target" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="page-btn active cursor-target">1</button>
          <button className="page-btn cursor-target">2</button>
          <button className="page-btn cursor-target">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedReport && (
        <div className="report-modal-overlay" onClick={closeModal}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="report-modal-close cursor-target" onClick={closeModal}>
              <X size={24} />
            </button>

            <div className="report-modal-header">
              <div className="report-modal-title-wrapper">
                <div className="report-modal-icon-wrapper">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="report-modal-title">Report #{selectedReport.id.toString().padStart(4, '0')}</h2>
                  <p className="report-modal-domain">{selectedReport.domain}</p>
                </div>
              </div>
              <div className="report-modal-status-badge">
                {getStatusBadge(selectedReport.status)}
              </div>
            </div>

            <div className="report-modal-body">
              {/* Score Overview */}
              <div className="report-modal-score-section">
                <div className="report-modal-score-display">
                  <div className="report-modal-score-circle">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                      <circle 
                        cx="60" cy="60" r="50" 
                        fill="none" 
                        stroke={getScoreColor(selectedReport.score)} 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray={314.16}
                        strokeDashoffset={314.16 - (selectedReport.score / 100) * 314.16}
                      />
                    </svg>
                    <div className="report-modal-score-center">
                      <span className="report-modal-score-number">{selectedReport.score}%</span>
                      <span className="report-modal-score-label-text" style={{ color: getScoreColor(selectedReport.score) }}>
                        {getScoreLabel(selectedReport.score)}
                      </span>
                    </div>
                  </div>
                  <div className="report-modal-score-stats">
                    <div className="report-modal-score-stat">
                      <span className="stat-number">{selectedReport.passed}</span>
                      <span className="stat-label">Passed</span>
                    </div>
                    <div className="report-modal-score-stat">
                      <span className="stat-number" style={{ color: 'var(--yellow)' }}>{selectedReport.warnings}</span>
                      <span className="stat-label">Warnings</span>
                    </div>
                    <div className="report-modal-score-stat">
                      <span className="stat-number" style={{ color: 'var(--red)' }}>{selectedReport.critical}</span>
                      <span className="stat-label">Critical</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Info */}
              <div className="report-modal-info-grid">
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">Report Type</span>
                  <span className="report-modal-info-value">{selectedReport.type}</span>
                </div>
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">Generated</span>
                  <span className="report-modal-info-value">
                    {new Date(selectedReport.generated).toLocaleString()}
                  </span>
                </div>
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">File Size</span>
                  <span className="report-modal-info-value">{selectedReport.size}</span>
                </div>
                <div className="report-modal-info-item">
                  <span className="report-modal-info-label">Total Findings</span>
                  <span className="report-modal-info-value">{selectedReport.findings}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="report-modal-actions">
                <button className="report-modal-action-btn primary cursor-target">
                  <Download size={16} />
                  Download Report
                </button>
                <button className="report-modal-action-btn secondary cursor-target">
                  <Eye size={16} />
                  View Full Report
                </button>
                <button className="report-modal-action-btn secondary cursor-target">
                  <Printer size={16} />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;