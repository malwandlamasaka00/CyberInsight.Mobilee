// src/pages/dashboard/profile/Profile.jsx
import React from 'react';

const Profile = ({ user }) => {
  const userData = user || {
    name: 'Demo User',
    email: 'demo@cyberinsight.com',
    memberSince: 'Jan 2026',
  };

  return (
    <div className="profile-section">
      <h3><i className="fas fa-user-circle"></i> Profile</h3>
      <div className="profile-row">
        <div className="profile-field">
          <label>Full Name</label>
          <div className="value">{userData.name}</div>
        </div>
        <div className="profile-field">
          <label>Email</label>
          <div className="value">{userData.email}</div>
        </div>
        <div className="profile-field">
          <label>Member Since</label>
          <div className="value">{userData.memberSince}</div>
        </div>
        <div className="profile-field">
          <label>Status</label>
          <div className="value"><span className="status-badge active">Active</span></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;