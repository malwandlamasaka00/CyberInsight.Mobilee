// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  refresh: () => api.post('/auth/refresh'),
};

export const scanService = {
  scanWebsite: (url) => api.post('/scan', { url }),
  getHistory: () => api.get('/scan/history'),
  getResults: (scanId) => api.get(`/scan/${scanId}`),
  generateReport: (scanId) => api.get(`/scan/${scanId}/report`, { responseType: 'blob' }),
};

export default api;