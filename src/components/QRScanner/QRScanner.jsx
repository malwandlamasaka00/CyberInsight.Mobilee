// src/components/QRScanner/QRScanner.jsx
import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Scan, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Image, 
  FileImage,
  Trash2,
  Server,
  Shield,
  ArrowRight
} from 'lucide-react';
import { qrService } from '../../services/qrService';
import './QRScanner.css';

const QRScanner = ({ onScanComplete, onClose, onAutoScan }) => {
  const [error, setError] = useState(null);
  const [scannedUrl, setScannedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [decodingResult, setDecodingResult] = useState(null);
  const [autoScan, setAutoScan] = useState(true);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, JPEG, etc.)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size should be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setScannedUrl(null);
      setDecodingResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // src/components/QRScanner/QRScanner.jsx
// Update the handleScanImage function

const handleScanImage = async () => {
  if (!selectedFile) {
    setError('Please select an image file first');
    return;
  }

  setIsLoading(true);
  setError(null);
  setDecodingResult(null);

  try {
    const result = await qrService.decodeQR(selectedFile);

    console.log('QR Decode result:', result);

    if (result.success) {
      setDecodingResult(result);
      
      // Check if the QR code contains a valid URL
      if (result.is_url && result.url) {
        // Valid URL found
        setScannedUrl(result.url);
        
        if (onScanComplete) {
          onScanComplete(result.url);
        }
        
        if (autoScan && onAutoScan) {
          setTimeout(() => {
            onAutoScan(result.url);
          }, 1000);
        }
      } else {
        // QR code decoded but no valid URL
        setScannedUrl(null);
        setError(result.message || 'QR code does not contain a valid URL');
        
        // Show the content if available
        if (result.content) {
          setError(`QR Code contains: "${result.content}"\n\nThis is not a valid URL. Please scan a QR code that contains a website address.`);
        }
      }
    } else {
      setError(result.error || 'No QR code found in the image');
    }
  } catch (err) {
    console.error('QR decoding error:', err);
    setError(err.message || 'Failed to decode QR code');
  } finally {
    setIsLoading(false);
  }
};
  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setScannedUrl(null);
    setError(null);
    setIsLoading(false);
    setDecodingResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect({ target: { files: [file] } });
    } else {
      setError('Please drop an image file');
    }
  };

  const handleAutoScanToggle = () => {
    setAutoScan(!autoScan);
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container">
        {/* Header */}
        <div className="qr-scanner-header">
          <h3>
            <Scan size={20} />
            Upload QR Code
          </h3>
          <div className="qr-scanner-header-actions">
            <span className="qr-api-status">
              <Server size={14} />
              API Ready
            </span>
            <button className="qr-scanner-close" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="qr-scanner-body">
          {isLoading && (
            <div className="qr-scanner-loading">
              <div className="qr-loading-spinner"></div>
              <p>Decoding QR Code...</p>
              <p className="qr-loading-sub">Processing on secure server</p>
            </div>
          )}

          {error && (
            <div className="qr-scanner-error">
              <AlertCircle size={48} color="#f5576c" />
              <p className="qr-error-message">{error}</p>
              <div className="qr-scanner-error-actions">
                <button className="btn-retry" onClick={handleScanImage}>
                  <RefreshCw size={16} />
                  Retry
                </button>
                <button className="btn-close" onClick={handleClose}>
                  <X size={16} />
                  Close
                </button>
              </div>
            </div>
          )}

          {scannedUrl && !error && (
            <div className="qr-scanner-success">
              <CheckCircle size={48} color="#43e97b" />
              <p>QR Code Decoded Successfully!</p>
              {decodingResult && (
                <div className="qr-decoding-details">
                  <span className="qr-detail-label">Filename:</span>
                  <span className="qr-detail-value">{decodingResult.filename}</span>
                </div>
              )}
              <div className="scanned-url">{scannedUrl}</div>
              
              <div className="qr-auto-scan-toggle">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={autoScan} 
                    onChange={handleAutoScanToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">
                  <Shield size={14} />
                  Auto-run security scan
                </span>
              </div>
              
              <div className="qr-success-actions">
                <button 
                  className="btn-scan-now"
                  onClick={() => {
                    if (onAutoScan) {
                      onAutoScan(scannedUrl);
                      handleClose();
                    }
                  }}
                >
                  <Shield size={16} />
                  Scan Now
                  <ArrowRight size={16} />
                </button>
                <button className="btn-scan-again" onClick={handleReset}>
                  <RefreshCw size={16} />
                  Scan Another QR Code
                </button>
              </div>
            </div>
          )}

          {!scannedUrl && !error && !isLoading && (
            <div className="qr-upload-wrapper">
              {imagePreview ? (
                <div className="qr-image-preview-container">
                  <div className="qr-image-preview">
                    <img src={imagePreview} alt="QR Code" className="qr-preview-image" />
                    <div className="qr-image-overlay">
                      <button 
                        className="qr-remove-image"
                        onClick={handleReset}
                        title="Remove image"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <button 
                    className="btn-scan-image"
                    onClick={handleScanImage}
                  >
                    <Scan size={18} />
                    Decode QR Code
                  </button>
                </div>
              ) : (
                <div 
                  className="qr-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="qr-upload-content">
                    <div className="qr-upload-icon-wrapper">
                      <Upload size={48} className="qr-upload-icon" />
                    </div>
                    <h4>Upload QR Code Image</h4>
                    <p>Click to browse or drag & drop an image</p>
                    <div className="qr-upload-formats">
                      <span>PNG</span>
                      <span>JPG</span>
                      <span>JPEG</span>
                      <span>BMP</span>
                      <span>WEBP</span>
                    </div>
                    <button 
                      className="btn-upload"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <FileImage size={16} />
                      Choose File
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="qr-scanner-footer">
          <div className="qr-scanner-footer-content">
            <p className="qr-scanner-tip">
              <Image size={14} />
              Supported formats: PNG, JPG, JPEG, BMP, WEBP (Max 10MB)
            </p>
            <p className="qr-scanner-tip">
              <Server size={14} />
              Powered by CyberInsight QR Decoder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;