// src/components/QRCodeGenerator.jsx
import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ url, size = 200 }) => {
  return (
    <div className="qr-generator">
      <QRCode value={url} size={size} level="H" includeMargin />
      <p>Scan this QR to view security report</p>
    </div>
  );
};

export default QRCodeGenerator;