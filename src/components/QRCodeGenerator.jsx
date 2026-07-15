// src/components/QRCodeGenerator.jsx
import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 
import { Download, Share2, Copy, Check, X, QrCode, Save } from 'lucide-react';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ url, size = 200, onClose, onGenerate }) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const qrRef = useRef(null);

  // Default settings
  const qrSize = 200;
  const fgColor = '#1e293b';
  const bgColor = '#ffffff';
  const level = 'H';
  const includeMargin = true;

  // Extract domain from URL for filename
  const getDomain = () => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'scan';
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Capture QR code as data URL
  const captureQRCode = () => {
    return new Promise((resolve) => {
      const svg = qrRef.current?.querySelector('svg');
      if (!svg) {
        resolve(null);
        return;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml' }));
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  };

  // Handle Save QR Code to Reports
  const handleSaveQR = async () => {
    if (!onGenerate) {
      alert('Save functionality is not available');
      return;
    }
    
    setIsSaving(true);
    try {
      const dataUrl = await captureQRCode();
      if (dataUrl) {
        onGenerate(dataUrl);
        alert(' QR Code saved to Reports successfully!');
        if (onClose) {
          setTimeout(() => onClose(), 500);
        }
      } else {
        alert('Failed to capture QR code. Please try again.');
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Error saving QR code. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadQR = (format = 'png') => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      captureQRCode().then((dataUrl) => {
        if (dataUrl) {
          const link = document.createElement('a');
          const domain = getDomain();
          link.download = `qr-code-${domain}.png`;
          link.href = dataUrl;
          link.click();
        }
      });
      return;
    }

    const link = document.createElement('a');
    const domain = getDomain();
    
    if (format === 'png') {
      link.download = `qr-code-${domain}.png`;
      link.href = canvas.toDataURL('image/png');
    } else if (format === 'jpeg') {
      link.download = `qr-code-${domain}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
    } else if (format === 'svg') {
      const svg = qrRef.current?.querySelector('svg');
      if (svg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        link.download = `qr-code-${domain}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }
    }
    
    link.click();
  };

  const shareQR = async () => {
    try {
      const dataUrl = await captureQRCode();
      if (!dataUrl) return;
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.share && blob) {
        await navigator.share({
          title: `QR Code for ${getDomain()}`,
          text: `Scan this QR code to view: ${url}`,
          files: [new File([blob], `qr-code-${getDomain()}.png`, { type: 'image/png' })],
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="qr-generator-modal-overlay" onClick={onClose}>
      <div className="qr-generator-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qr-generator-modal-header">
          <div className="qr-generator-modal-title">
            <QrCode size={20} />
            <h3>Generate QR Code</h3>
          </div>
          <button className="qr-generator-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="qr-generator-modal-body">
          <div className="qr-generator-modal-content">
            {/* QR Code Display */}
            <div className="qr-code-display-area">
              <div className="qr-code-wrapper" ref={qrRef}>
                <QRCodeSVG
                  value={url}
                  size={qrSize}
                  level={level}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  includeMargin={includeMargin}
                />
              </div>
              
              <div className="qr-code-url-info">
                <span className="qr-code-url-label">URL:</span>
                <span className="qr-code-url-text">{url}</span>
                <button 
                  className="qr-code-copy-btn"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="qr-generator-actions">
            {onGenerate && (
              <button 
                className="qr-action-btn save"
                onClick={handleSaveQR}
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save '}
              </button>
            )}
            <button 
              className="qr-action-btn primary"
              onClick={() => downloadQR('png')}
            >
              <Download size={16} />
               PNG
            </button>
           
            <button 
              className="qr-action-btn secondary"
              onClick={() => downloadQR('jpeg')}
            >
              <Download size={16} />
              JPEG
            </button>
            <button 
              className="qr-action-btn primary"
              onClick={shareQR}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default QRCodeGenerator;