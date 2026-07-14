// src/services/qrService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5173';

export const qrService = {
  /**
   * Decode QR code from an image file
   * @param {File} file - The image file containing a QR code
   * @returns {Promise} - Decoded QR code data
   */
  async decodeQR(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/qr/decode', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to decode QR code');
    }

    return response.json();
  },

  /**
   * Decode QR code from base64 image data
   * @param {string} base64Data - Base64 encoded image data
   * @returns {Promise} - Decoded QR code data
   */
  async decodeQRBase64(base64Data) {
    const response = await fetch('/qr/decode-base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to decode QR code');
    }

    return response.json();
  },

  /**
   * Check if QR decoder service is healthy
   * @returns {Promise} - Health status
   */
  async health() {
    const response = await fetch('/qr/health');
    return response.json();
  }
};