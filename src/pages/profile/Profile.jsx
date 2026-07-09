// src/pages/profile/Profile.jsx
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Save,
  Camera,
  Key,
  Activity
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Security Admin',
    email: 'admin@sentinel.com',
    role: 'System Administrator',
    joined: '2026-01-15',
    lastActive: '2026-07-09T14:30:00Z'
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-subtitle">Manage your account settings</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <button className="profile-avatar-btn cursor-target">
              <Camera size={16} />
            </button>
          </div>
          <div className="profile-name">{profile.name}</div>
          <div className="profile-role">{profile.role}</div>
          <div className="profile-badge">
            <Shield size={14} />
            <span>Verified Account</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-details-header">
            <h2>Account Information</h2>
            <button 
              className="profile-edit-btn cursor-target"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <label>Full Name</label>
              <div className="profile-detail-value">
                <User size={16} />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.name} 
                    className="profile-input cursor-target"
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                ) : (
                  <span>{profile.name}</span>
                )}
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Email Address</label>
              <div className="profile-detail-value">
                <Mail size={16} />
                {isEditing ? (
                  <input 
                    type="email" 
                    value={profile.email} 
                    className="profile-input cursor-target"
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                ) : (
                  <span>{profile.email}</span>
                )}
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Role</label>
              <div className="profile-detail-value">
                <Shield size={16} />
                <span>{profile.role}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Member Since</label>
              <div className="profile-detail-value">
                <Calendar size={16} />
                <span>{new Date(profile.joined).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Last Active</label>
              <div className="profile-detail-value">
                <Activity size={16} />
                <span>{new Date(profile.lastActive).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button className="profile-save-btn cursor-target">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}

          <div className="profile-security-section">
            <h3>Security Settings</h3>
            <button className="profile-security-btn cursor-target">
              <Key size={16} />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;