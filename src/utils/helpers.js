// src/utils/helpers.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#1e7b4c';
  if (score >= 60) return '#b9692b';
  return '#b34033';
};

export const getScoreLabel = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

export const truncateUrl = (url, maxLength = 30) => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
};

export const generateId = () => {
  return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};