// src/components/QRScanner/WebQRScanner.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Scan, X, Camera, AlertCircle } from 'lucide-react';

const WebQRScanner = ({ onScanComplete, onClose }) => {
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if browser supports QR scanning
    if ('BarcodeDetector' in window) {
      startScanning();
    } else {
      setError('Your browser does not support QR scanning. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      detectQR();
    } catch (err) {
      setError('Camera access denied. Please allow camera access.');
      console.error(err);
    }
  };

  const detectQR = async () => {
    if (!isScanning) return;

    try {
      const barcodeDetector = new window.BarcodeDetector({
        formats: ['qr_code']
      });
      
      const barcodes = await barcodeDetector.detect(videoRef.current);
      
      if (barcodes.length > 0) {
        const qrData = barcodes[0].rawValue;
        onScanComplete(qrData);
        setIsScanning(false);
        // Stop camera
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        return;
      }
    } catch (err) {
      console.error('Detection error:', err);
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(detectQR);
    }
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container">
        {/* Header */}
        <div className="qr-scanner-header">
          <h3>
            <Scan size={20} />
            Scan QR Code
          </h3>
          <button className="qr-scanner-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="qr-scanner-body">
          {error ? (
            <div className="qr-scanner-error">
              <AlertCircle size={48} stroke="#f5576c" />
              <p>{error}</p>
              <button className="btn-retry" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="qr-reader"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  aspectRatio: '1',
                  background: '#000',
                  borderRadius: '12px',
                }}
              />
              <div className="qr-scanner-overlay-frame">
                <div className="qr-corner qr-corner-tl"></div>
                <div className="qr-corner qr-corner-tr"></div>
                <div className="qr-corner qr-corner-bl"></div>
                <div className="qr-corner qr-corner-br"></div>
                <div className="qr-scan-line"></div>
              </div>
              <div className="qr-scanner-instructions">
                <p>Position the QR code within the frame</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebQRScanner;