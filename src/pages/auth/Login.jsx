// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('demo@cyberinsight.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <i className="fas fa-lock"></i>
        <h3>Secure Access</h3>
        <p>Sign in to your CyberInsight dashboard to manage scans and reports.</p>
      </div>
      <div className="login-form">
        <h2>Sign in</h2>
        <p className="subhead">Access your CyberInsight dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="far fa-envelope" style={{ marginRight: '6px' }}></i> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label><i className="fas fa-key" style={{ marginRight: '6px' }}></i> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary">
            <i className="fas fa-arrow-right-to-bracket"></i> Sign in
          </button>
        </form>
        <div style={{ marginTop: '1.2rem', fontSize: '0.9rem', color: '#475569' }}>
          <span>Don't have an account?</span>
          <button className="auth-toggle-btn" onClick={onSwitchToRegister}>
            Sign up
          </button>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px dashed #dce1ea', paddingTop: '1rem' }}>
          <i className="fas fa-shield-alt" style={{ marginRight: '4px' }}></i>
          demo credentials pre‑filled
        </div>
      </div>
    </div>
  );
};

export default Login;