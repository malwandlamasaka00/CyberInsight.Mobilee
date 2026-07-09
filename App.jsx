// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './src/contexts/ThemeContext';  // Changed from context to contexts
import Layout from './src/components/Layout/Layout';
import Dashboard from './src/pages/dashboard/Dashboard';
import History from './src/pages/history/History';
import Profile from './src/pages/profile/Profile';
import Scan from './src/pages/scan/Scan';
import Reports from './src/pages/reports/Reports';
import TargetCursor from './src/components/TargetCursor/TargetCursor';
import './src/styles/globals.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <TargetCursor 
          targetSelector=".cursor-target, button, a, input, .scan-btn, .btn-primary, .btn-secondary, .quick-action-card, .stat-card, .nav-item, .view-all-btn, .download-btn, .scan-view-btn, .scan-modal-close, .scan-modal-btn, .scan-modal-feature, .scan-modal-result-card, .scan-modal-issue-item, .electric-border, .reflective-card-container, .scan-type-item, .scan-quick-tag, .scan-score-stat, .scan-check-item, .scan-action-btn, .scan-header-stat, .report-item, .report-view-btn, .report-download-btn, .action-btn, .page-btn, .generate-report-btn, .filter-select, .theme-toggle"
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          cursorColor="#2563eb"
          cursorColorOnTarget="#3b82f6"
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/scan" element={
            <Layout>
              <Scan />
            </Layout>
          } />
          <Route path="/history" element={
            <Layout>
              <History />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout>
              <Reports />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;