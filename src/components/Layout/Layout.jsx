// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  X, 
  BarChart3, 
  Search, 
  History, 
  User, 
  Menu, 
  LogOut,
  FileText 
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Add your logout logic here
    // For now, just navigate to login page
    navigate('/login');
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`layout-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={32} className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">Sentinel</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main</span>
            <Link 
              to="/dashboard" 
              className={`nav-item cursor-target ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/scan" 
              className={`nav-item cursor-target ${isActive('/scan') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Search size={20} />
              <span>Scan</span>
            </Link>
            <Link 
              to="/history" 
              className={`nav-item cursor-target ${isActive('/history') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <History size={20} />
              <span>History</span>
            </Link>
          </div>

            <div className="nav-section">
            <span className="nav-section-title"> generate QR Code</span>
            <Link 
              to="/reports" 
              className={`nav-item cursor-target ${isActive('/reports') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <FileText size={20} />
              <span>QR Codes</span>
            </Link>
          </div>
          
          
          
          <div className="nav-section">
            <span className="nav-section-title">Account</span>
            <Link 
              to="/profile" 
              className={`nav-item cursor-target ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          {/* Logout Button */}
          <button 
            className="sidebar-logout-btn cursor-target" 
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          
          <div className="sidebar-status">
            <div className="status-indicator online" />
            <span>System Online</span>
          </div>
          <div className="sidebar-version">v1.0.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="layout-main">
        <header className="layout-header">
          <div className="header-left">
            <button className="menu-toggle cursor-target" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          <div className="header-right">
            <div className="header-actions-wrapper">
              <ThemeToggle />
              <div className="header-user">
                <div className="header-avatar">
                  <User size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="layout-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;