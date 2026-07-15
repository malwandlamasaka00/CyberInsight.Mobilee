// App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import TargetCursor from './components/TargetCursor/TargetCursor';
import './styles/globals.css'; 

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <TargetCursor 
            targetSelector=".cursor-target, button, a, input, .scan-btn, .btn-primary, .btn-secondary, .quick-action-card, .stat-card, .nav-item, .view-all-btn, .download-btn, .scan-view-btn, .scan-modal-close, .scan-modal-btn, .scan-modal-feature, .scan-modal-result-card, .scan-modal-issue-item, .electric-border, .reflective-card-container, .scan-type-item, .scan-quick-tag, .scan-score-stat, .scan-check-item, .scan-action-btn, .scan-header-stat, .report-item, .report-view-btn, .report-download-btn, .action-btn, .page-btn, .generate-report-btn, .filter-select, .theme-toggle"
            spinDuration={2}
            hideDefaultCursor={true}
            parallaxOn={true}
            cursorColor="#2563eb"
            cursorColorOnTarget="#3b82f6"
          />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;