// App.jsx (located at project root)
import React, { useState, useEffect } from 'react';
import './src/styles/globals.css';
import './src/styles/theme.css';
import './src/styles/typography.css';
import './src/styles/variables.css';
import Splash from './src/pages/auth/Splash';
import Login from './src/pages/auth/Login';
import Register from './src/pages/auth/Register';
import Dashboard from './src/pages/dashboard/Dashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('splash');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage('dashboard');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email, password) => {
    // Simulate login
    const userData = { 
      name: 'Demo User', 
      email, 
      memberSince: 'Jan 2026',
      id: 1
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', 'fake-jwt-token-12345');
    setCurrentPage('dashboard');
  };

  const handleRegister = (name, email, password) => {
    const userData = { 
      name, 
      email, 
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      id: Date.now()
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', 'fake-jwt-token-12345');
    setCurrentPage('dashboard');
    alert('Account created! Welcome to CyberInsight.');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setCurrentPage('splash');
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    switch(currentPage) {
      case 'splash':
        return <Splash onGetStarted={() => setCurrentPage('login')} />;
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} />;
      default:
        return <Splash onGetStarted={() => setCurrentPage('login')} />;
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
};

export default App;