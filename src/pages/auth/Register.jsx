// src/pages/Register.jsx
import React, { useState } from 'react';
import './Login.css';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onRegister(name, email, password);
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <i className="fas fa-user-plus"></i>
        <h3>Create Account</h3>
        <p>Start securing your websites with CyberInsight today.</p>
      </div>
      <div className="login-form">
        <h2>Sign up</h2>
        <p className="subhead">Create your CyberInsight account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-user" style={{ marginRight: '6px' }}></i> Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
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
          <div className="form-group">
            <label><i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i> Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary">
            <i className="fas fa-user-plus"></i> Create account
          </button>
        </form>
        <div style={{ marginTop: '1.2rem', fontSize: '0.9rem', color: '#475569' }}>
          <span>Already have an account?</span>
          <button className="auth-toggle-btn" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;