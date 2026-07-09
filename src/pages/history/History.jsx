// src/pages/history/History.jsx
import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './History.css';

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const scans = [
    { id: 1, domain: 'example.com', date: '2026-07-09T14:30:00Z', score: 92, status: 'completed', critical: 0 },
    { id: 2, domain: 'test-site.org', date: '2026-07-09T12:15:00Z', score: 65, status: 'completed', critical: 2 },
    { id: 3, domain: 'myapp.io', date: '2026-07-08T18:45:00Z', score: 45, status: 'completed', critical: 4 },
    { id: 4, domain: 'secure-site.com', date: '2026-07-08T10:00:00Z', score: 88, status: 'completed', critical: 1 },
    { id: 5, domain: 'api-service.net', date: '2026-07-07T16:20:00Z', score: 71, status: 'completed', critical: 2 },
    { id: 6, domain: 'ecommerce-store.org', date: '2026-07-07T09:45:00Z', score: 55, status: 'completed', critical: 3 },
    { id: 7, domain: 'blog-platform.com', date: '2026-07-06T14:10:00Z', score: 82, status: 'completed', critical: 1 },
    { id: 8, domain: 'auth-service.io', date: '2026-07-06T11:30:00Z', score: 93, status: 'completed', critical: 0 },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-green';
    if (score >= 60) return 'score-yellow';
    if (score >= 40) return 'score-orange';
    return 'score-red';
  };

  const getStatusBadge = (status, score) => {
    if (status === 'pending') {
      return <span className="status-badge pending">Pending</span>;
    }
    if (score >= 80) {
      return <span className="status-badge secure">Secure</span>;
    }
    if (score >= 60) {
      return <span className="status-badge moderate">Moderate</span>;
    }
    return <span className="status-badge critical">Critical</span>;
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle size={16} className="icon-green" />;
    if (score >= 60) return <AlertTriangle size={16} className="icon-yellow" />;
    return <AlertTriangle size={16} className="icon-red" />;
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h1 className="history-title">Scan History</h1>
          <p className="history-subtitle">View all your past security scans</p>
        </div>
        <button className="export-btn cursor-target">
          <Download size={18} />
          Export Data
        </button>
      </div>

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
        </div>
        <div className="filter-group">
          <select className="filter-select cursor-target">
            <option value="all">All Status</option>
            <option value="secure">Secure</option>
            <option value="moderate">Moderate</option>
            <option value="critical">Critical</option>
          </select>
          <select className="filter-select cursor-target">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </div>

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Date</th>
              <th>Score</th>
              <th>Status</th>
              <th>Critical Issues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id} className="cursor-target">
                <td className="domain-cell">
                  <span className="domain-name">{scan.domain}</span>
                </td>
                <td className="date-cell">
                  <Clock size={14} />
                  {new Date(scan.date).toLocaleString()}
                </td>
                <td className="score-cell">
                  <span className={`score-value ${getScoreColor(scan.score)}`}>
                    {getScoreIcon(scan.score)}
                    {scan.score}%
                  </span>
                </td>
                <td>{getStatusBadge(scan.status, scan.score)}</td>
                <td className="critical-cell">
                  {scan.critical > 0 ? (
                    <span className="critical-count">{scan.critical}</span>
                  ) : (
                    <span className="no-critical">None</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button className="action-btn cursor-target">
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

      <div className="pagination">
        <div className="pagination-info">
          Showing 1-8 of 24 scans
        </div>
        <div className="pagination-controls">
          <button className="page-btn cursor-target" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="page-btn active cursor-target">1</button>
          <button className="page-btn cursor-target">2</button>
          <button className="page-btn cursor-target">3</button>
          <button className="page-btn cursor-target">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;