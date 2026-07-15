// src/pages/reports/Reports.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  ChevronDown,
  QrCode,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Link
} from 'lucide-react';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import './Reports.css';

const Reports = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [qrToDelete, setQrToDelete] = useState(null);
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = () => {
    try {
      const saved = localStorage.getItem('qrCodes');
      if (saved) {
        setQrCodes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQRCodes = (updatedQrCodes) => {
    localStorage.setItem('qrCodes', JSON.stringify(updatedQrCodes));
    setQrCodes(updatedQrCodes);
  };

  const handleGenerateQR = () => {
    if (!manualUrl.trim()) {
      alert('Please enter a URL to generate a QR code');
      return;
    }
    
    // Create a new QR code entry
    const newQR = {
      id: `qr-${Date.now()}`,
      url: manualUrl,
      domain: manualUrl.replace(/^https?:\/\//, '').split('/')[0],
      createdAt: new Date().toISOString()
    };
    setSelectedQR(newQR);
    setShowQRGenerator(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerateQR();
    }
  };

  const handleQRGenerated = (qrDataUrl) => {
    // Create a new QR code entry with the data URL
    const newQRCode = {
      id: `qr-${Date.now()}`,
      url: manualUrl,
      domain: manualUrl.replace(/^https?:\/\//, '').split('/')[0],
      dataUrl: qrDataUrl,
      createdAt: new Date().toISOString()
    };
    
    const updatedQrCodes = [newQRCode, ...qrCodes];
    saveQRCodes(updatedQrCodes);
    setManualUrl('');
    setShowQRGenerator(false);
    setSelectedQR(null);
  };

  const handleDeleteQR = (qrId) => {
    setQrToDelete(qrId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedQrCodes = qrCodes.filter(qr => qr.id !== qrToDelete);
    saveQRCodes(updatedQrCodes);
    setShowDeleteModal(false);
    setQrToDelete(null);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWebsite = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleRegenerateQR = (qr) => {
    setSelectedQR(qr);
    setManualUrl(qr.url);
    setShowQRGenerator(true);
  };

  const filteredQRCodes = qrCodes.filter(qr => {
    return qr.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           qr.url?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get QR code for the generator
  const getQRUrl = () => {
    if (selectedQR) {
      return selectedQR.url;
    }
    return manualUrl || '';
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="loading-spinner"></div>
        <p>Loading QR codes...</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">QR Code Generator</h1>
          <p className="reports-subtitle">Generate and manage QR codes for any website</p>
        </div>
      </div>

      {/* URL Input Bar for QR Generation */}
      <div className="reports-url-bar">
        <div className="url-input-wrapper">
          <Link size={18} className="url-input-icon" />
          <input
            type="url"
            placeholder="Paste a URL here to generate a QR code (e.g., https://example.com)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="reports-url-input"
          />
          <button 
            className="url-generate-btn"
            onClick={handleGenerateQR}
            disabled={!manualUrl.trim()}
          >
            <QrCode size={18} />
            Generate QR
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="reports-controls">
        <div className="reports-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search QR codes by domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="reports-search-input"
          />
        </div>
        <div className="reports-count">
          {filteredQRCodes.length} QR code{filteredQRCodes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* QR Codes Grid */}
      {filteredQRCodes.length === 0 ? (
        <div className="reports-empty">
          <QrCode size={48} />
          <h3>No QR codes generated yet</h3>
          <p>Paste a URL above and click "Generate QR" to create your first QR code</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredQRCodes.map((qr) => {
            const date = new Date(qr.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={qr.id} className="report-card">
                <div className="report-card-header">
                  <div className="report-card-title">
                    <QrCode size={20} />
                    <span>{qr.domain || 'Unknown'}</span>
                  </div>
                  <div className="report-card-actions">
                    <button 
                      className="report-action-btn"
                      onClick={() => handleCopyUrl(qr.url)}
                      title="Copy URL"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button 
                      className="report-action-btn"
                      onClick={() => handleOpenWebsite(qr.url)}
                      title="Open Website"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button 
                      className="report-action-btn success"
                      onClick={() => handleRegenerateQR(qr)}
                      title="Regenerate QR Code"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button 
                      className="report-action-btn danger"
                      onClick={() => handleDeleteQR(qr.id)}
                      title="Delete QR Code"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* QR Code Display */}
                <div className="report-qr-container">
                  <img 
                    src={qr.dataUrl} 
                    alt={`QR Code for ${qr.domain}`}
                    className="report-qr-image"
                  />
                  <div className="report-qr-url">{qr.url}</div>
                </div>

                <div className="report-card-body">
                  <div className="report-meta">
                    <span className="report-meta-item">
                      <Calendar size={14} />
                      {date}
                    </span>
                  </div>
                </div>

                <div className="report-card-footer">
                  <button 
                    className="report-view-btn"
                    onClick={() => window.open(qr.url, '_blank')}
                  >
                    <ExternalLink size={16} />
                    Open Website
                  </button>
                  <button 
                    className="report-download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `qr-code-${qr.domain}.png`;
                      link.href = qr.dataUrl;
                      link.click();
                    }}
                  >
                    <Download size={16} />
                    Download PNG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && (
        <QRCodeGenerator 
          url={getQRUrl()}
          onClose={() => {
            setShowQRGenerator(false);
            setSelectedQR(null);
          }}
          onGenerate={(dataUrl) => {
            if (selectedQR) {
              // Regenerating existing QR
              const updatedQrCodes = qrCodes.map(qr => {
                if (qr.id === selectedQR.id) {
                  return { ...qr, dataUrl, regeneratedAt: new Date().toISOString() };
                }
                return qr;
              });
              saveQRCodes(updatedQrCodes);
              setShowQRGenerator(false);
              setSelectedQR(null);
              setManualUrl('');
            } else {
              // New QR code
              handleQRGenerated(dataUrl);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete QR Code</h3>
              <button className="delete-modal-close" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this QR code?</p>
              <p className="delete-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-footer">
              <button 
                className="delete-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-modal-confirm"
                onClick={confirmDelete}
              >
                <Trash2 size={16} />
                Delete QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;