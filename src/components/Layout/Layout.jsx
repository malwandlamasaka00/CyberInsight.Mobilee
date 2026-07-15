// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
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
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-collapse on route change
  useEffect(() => {
    setIsCollapsed(true);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`layout-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`layout-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={isCollapsed ? 28 : 32} className="sidebar-logo-icon" />
            {!isCollapsed && <span className="sidebar-logo-text">CyberInsight</span>}
          </div>
          <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isCollapsed && <span className="nav-section-title">Main</span>}
            <Link 
              to="/dashboard" 
              className={`nav-item cursor-target ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? 'Dashboard' : ''}
            >
              <BarChart3 size={20} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
            <Link 
              to="/scan" 
              className={`nav-item cursor-target ${isActive('/scan') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? 'Scan' : ''}
            >
              <Search size={20} />
              {!isCollapsed && <span>Scan</span>}
            </Link>
            <Link 
              to="/history" 
              className={`nav-item cursor-target ${isActive('/history') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? 'History' : ''}
            >
              <History size={20} />
              {!isCollapsed && <span>History</span>}
            </Link>
          </div>

          <div className="nav-section">
            {!isCollapsed && <span className="nav-section-title">Tools</span>}
            <Link 
              to="/reports" 
              className={`nav-item cursor-target ${isActive('/reports') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? 'QR Codes' : ''}
            >
              <FileText size={20} />
              {!isCollapsed && <span>QR Codes</span>}
            </Link>
          </div>
          
          <div className="nav-section">
            {!isCollapsed && <span className="nav-section-title">Account</span>}
            <Link 
              to="/profile" 
              className={`nav-item cursor-target ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? 'Profile' : ''}
            >
              <User size={20} />
              {!isCollapsed && <span>Profile</span>}
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="sidebar-logout-btn cursor-target" 
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
          
          {!isCollapsed && (
            <>
              <div className="sidebar-status">
                <div className="status-indicator online" />
                <span>System Online</span>
              </div>
              <div className="sidebar-version">v1.0.0</div>
            </>
          )}
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