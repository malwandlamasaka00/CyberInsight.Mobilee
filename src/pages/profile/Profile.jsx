// src/pages/dashboard/profile/Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Save,
  Camera,
  Key,
  Activity,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  PenSquare,
  X,
  ChevronRight,
  Lightbulb,
  Info,
  Upload,
  Trash2,
  Eye
} from 'lucide-react';
import './Profile.css';

const Profile = ({ user, onLogout, scanHistory = [], onSelectScan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const menuRef = useRef(null);

  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@cyberinsight.com',
    role: 'Security Administrator',
    phone: '+1 (555) 123-4567',
    joined: user?.memberSince || 'Jan 2026',
    lastActive: new Date().toLocaleString()
  });

  const userData = user || {
    name: 'Demo User',
    email: 'demo@cyberinsight.com',
    memberSince: 'Jan 2026',
  };

  // Use the scanHistory from props or default data
  const scans = scanHistory && scanHistory.length > 0 ? scanHistory : [
    { id: 1, url: 'example.com', date: 'Today 14:32', score: 92, status: 'pass' },
    { id: 2, url: 'myapp.dev', date: 'Yesterday 09:15', score: 76, status: 'warn' },
    { id: 3, url: 'api.secure.co', date: 'Jul 7, 2026', score: 88, status: 'pass' },
    { id: 4, url: 'testsite.io', date: 'Jul 5, 2026', score: 65, status: 'warn' },
    { id: 5, url: 'securebank.com', date: 'Jul 3, 2026', score: 95, status: 'pass' },
  ];

  // ===== TOAST NOTIFICATION - TOP RIGHT =====
  const showToast = (message, type = 'success') => {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <span style="font-size: 20px;">${icons[type] || icons.success}</span>
      <span>${message}</span>
      <button class="toast-close" onclick="this.closest('.toast-notification').remove()">
        ✕
      </button>
    `;
    
    document.body.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.animation = 'slideOutToast 0.3s ease forwards';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 4000);
  };

  // ===== CUSTOM CONFIRM MODAL =====
  const showConfirmModalDialog = (message, onConfirm) => {
    setConfirmAction(() => onConfirm);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Load saved image on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [stream]);

  // Start camera when modal opens
  useEffect(() => {
    if (showCameraModal && videoRef.current && !capturedPhoto) {
      startCamera();
    }
  }, [showCameraModal, capturedPhoto]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem('profileData', JSON.stringify(profile));
    showToast(' Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile({
      name: user?.name || 'Demo User',
      email: user?.email || 'demo@cyberinsight.com',
      role: 'Security Administrator',
      phone: '+1 (555) 123-4567',
      joined: user?.memberSince || 'Jan 2026',
      lastActive: new Date().toLocaleString()
    });
    showToast('📝 Changes cancelled', 'info');
  };

  // ===== PROFILE PICTURE HANDLERS =====

  const getFirstLetter = () => {
    if (!profile.name) return 'U';
    return profile.name.charAt(0).toUpperCase();
  };

  const getProfileImageUrl = () => {
    return profileImage || null;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('❌ Please select an image file', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showToast('❌ Image size should be less than 5MB', 'error');
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
        setIsUploading(false);
        setShowMenu(false);
        showToast(' Profile picture uploaded successfully!', 'success');
        window.dispatchEvent(
          new CustomEvent('profilePictureUpdated', {
            detail: {
              email: profile.email,
              profilePicture: reader.result,
            },
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setCameraError('Could not start video playback');
          });
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError('Unable to access camera. Please check your camera permissions.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(imageData);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setCameraError(null);
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const savePhoto = () => {
    if (capturedPhoto) {
      setProfileImage(capturedPhoto);
      localStorage.setItem('profileImage', capturedPhoto);
      closeCamera();
      showToast(' Profile picture saved successfully!', 'success');
      window.dispatchEvent(
        new CustomEvent('profilePictureUpdated', {
          detail: {
            email: profile.email,
            profilePicture: capturedPhoto,
          },
        })
      );
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setShowCameraModal(false);
    setCapturedPhoto(null);
    setCameraError(null);
  };

  const handleTakePhoto = () => {
    setShowCameraModal(true);
    setCapturedPhoto(null);
    setCameraError(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    showConfirmModalDialog(
      'Are you sure you want to remove your profile picture?',
      () => {
        setProfileImage(null);
        localStorage.removeItem('profileImage');
        setShowMenu(false);
        showToast('🗑️ Profile picture removed', 'info');
        window.dispatchEvent(
          new CustomEvent('profilePictureUpdated', {
            detail: {
              email: profile.email,
              profilePicture: null,
            },
          })
        );
      }
    );
  };

  // ===== SCAN HANDLERS =====

  const handleScanClick = (scan) => {
    setSelectedScan(scan);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setSelectedScan(null);
    document.body.style.overflow = 'auto';
  };

  // ===== STATS =====

  const totalScans = scans.length;
  const avgScore = totalScans > 0 ? Math.round(scans.reduce((acc, curr) => acc + curr.score, 0) / totalScans) : 0;
  const passedScans = scans.filter(s => s.status === 'pass').length;
  const failedScans = scans.filter(s => s.status === 'fail').length;
  const warnScans = scans.filter(s => s.status === 'warn').length;

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pass': return <CheckCircle size={16} style={{ color: '#43e97b' }} />;
      case 'warn': return <AlertTriangle size={16} style={{ color: '#fdcb6e' }} />;
      case 'fail': return <XCircle size={16} style={{ color: '#f5576c' }} />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pass': return 'Secure';
      case 'warn': return 'Warning';
      case 'fail': return 'Critical';
      default: return '';
    }
  };

  const getScanDetails = (scan) => {
    const findings = [
      { 
        label: 'SSL Certificate', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Valid · 126 days left' : scan.score >= 60 ? 'Expiring soon · 15 days left' : 'Expired certificate',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Protects data in transit between browser and server.',
        recommendation: scan.score >= 80 ? 'Certificate is valid and secure' : scan.score >= 60 ? 'Renew certificate within 30 days' : 'Renew SSL certificate immediately'
      },
      { 
        label: 'Content-Security-Policy (CSP)', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Configured properly' : scan.score >= 60 ? 'Partially configured' : 'Missing',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Prevents XSS attacks by controlling resources.',
        recommendation: scan.score >= 80 ? 'CSP is properly configured' : scan.score >= 60 ? 'Add missing CSP directives' : 'Implement a Content Security Policy'
      },
      { 
        label: 'HSTS (Strict-Transport-Security)', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Enabled with valid config' : scan.score >= 60 ? 'Configured but weak' : 'Missing',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Forces HTTPS connections to prevent downgrade attacks.',
        recommendation: scan.score >= 80 ? 'HSTS is properly configured' : scan.score >= 60 ? 'Increase HSTS max-age' : 'Enable HSTS on your server'
      },
      { 
        label: 'SPF Record', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'Configured with proper records' : scan.score >= 60 ? 'Partially configured' : 'Missing',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Prevents email spoofing and protects domain reputation.',
        recommendation: scan.score >= 80 ? 'SPF is properly configured' : scan.score >= 60 ? 'Update SPF records' : 'Configure SPF records'
      },
      { 
        label: 'Open Ports', 
        status: scan.score >= 80 ? 'pass' : scan.score >= 60 ? 'warn' : 'fail', 
        detail: scan.score >= 80 ? 'No unnecessary ports exposed' : scan.score >= 60 ? 'Some unnecessary ports open' : 'Critical ports exposed',
        severity: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
        impact: 'Reduces attack surface and minimizes entry points.',
        recommendation: scan.score >= 80 ? 'All ports are properly secured' : scan.score >= 60 ? 'Close unnecessary open ports' : 'Immediately close exposed critical ports'
      },
    ];
    return findings;
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div>
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">Manage your account settings and view your security activity</p>
          </div>
          <div className="profile-header-actions">
            <button 
              className="profile-edit-btn cursor-target"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X size={16} /> : <PenSquare size={16} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Column - Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-wrapper">
            <div 
              className={`profile-avatar ${getProfileImageUrl() ? 'has-image' : 'no-image'}`}
              onClick={() => getProfileImageUrl() && setShowFullImage(true)}
              style={{ cursor: getProfileImageUrl() ? 'pointer' : 'default' }}
            >
              {getProfileImageUrl() ? (
                <img 
                  src={getProfileImageUrl()} 
                  alt={profile.name}
                  className="profile-avatar-image"
                />
              ) : (
                <span className="avatar-initial">{getFirstLetter()}</span>
              )}
            </div>
            
            <div className="profile-avatar-actions" ref={menuRef}>
              <button 
                className="profile-avatar-btn edit-btn cursor-target"
                onClick={() => setShowMenu(!showMenu)}
              >
                <PenSquare size={14} />
                <span>Edit</span>
              </button>
              
              {showMenu && (
                <div className="edit-menu">
                  {getProfileImageUrl() && (
                    <button 
                      className="menu-item cursor-target"
                      onClick={() => {
                        setShowMenu(false);
                        setShowFullImage(true);
                      }}
                    >
                      <Eye size={14} />
                      <span>View photo</span>
                    </button>
                  )}
                  <button 
                    className="menu-item cursor-target"
                    onClick={handleTakePhoto}
                  >
                    <Camera size={14} />
                    <span>Take photo</span>
                  </button>
                  <button 
                    className="menu-item cursor-target"
                    onClick={handleUploadClick}
                  >
                    <Upload size={14} />
                    <span>Upload photo</span>
                  </button>
                  {getProfileImageUrl() && (
                    <button 
                      className="menu-item remove cursor-target"
                      onClick={handleRemovePhoto}
                    >
                      <Trash2 size={14} />
                      <span>Remove photo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            
            {isUploading && (
              <div className="profile-uploading">
                <div className="upload-spinner"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>
          
          <div className="profile-name">{profile.name}</div>
          <div className="profile-role">{profile.role}</div>
          <div className="profile-badge">
            <Shield size={14} />
            <span>Verified Account</span>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="profile-details">
          <div className="profile-details-header">
            <h2>Account Information</h2>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <label>Full Name</label>
              <div className="profile-detail-value">
                <User size={16} />
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name"
                    value={profile.name} 
                    className="profile-input cursor-target"
                    onChange={handleInputChange}
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
                    name="email"
                    value={profile.email} 
                    className="profile-input cursor-target"
                    onChange={handleInputChange}
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
              <label>Phone</label>
              <div className="profile-detail-value">
                {isEditing ? (
                  <input 
                    type="text" 
                    name="phone"
                    value={profile.phone} 
                    className="profile-input cursor-target"
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Member Since</label>
              <div className="profile-detail-value">
                <Calendar size={16} />
                <span>{profile.joined}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <label>Last Active</label>
              <div className="profile-detail-value">
                <Activity size={16} />
                <span>{profile.lastActive}</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button className="profile-save-btn cursor-target" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </button>
              <button className="profile-cancel-btn cursor-target" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats-section">
        <h3><Activity size={20} /> Scan Statistics</h3>
        <div className="profile-stats-grid">
          <div className="stat-card-mini">
            <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Shield size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Avg Security Score</span>
              <span className="stat-value">{avgScore}</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <CheckCircle size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Secure</span>
              <span className="stat-value" style={{ color: '#43e97b' }}>{passedScans}</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' }}>
              <AlertTriangle size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Warnings</span>
              <span className="stat-value" style={{ color: '#fdcb6e' }}>{warnScans}</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <XCircle size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Critical</span>
              <span className="stat-value" style={{ color: '#f5576c' }}>{failedScans}</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <div className="stat-icon-mini" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <Globe size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Scans</span>
              <span className="stat-value">{totalScans}</span>
            </div>
          </div>
        </div>
      </div>

      {/* My Scans Section */}
      <div className="profile-scans-section">
        <div className="profile-scans-header">
          <h3><Globe size={20} /> My Scans</h3>
          <span className="scan-count-badge">{totalScans} scans</span>
        </div>
        <div className="profile-scans-list">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <div 
                key={scan.id} 
                className="profile-scan-item clickable"
                onClick={() => handleScanClick(scan)}
                style={{ cursor: 'pointer' }}
              >
                <div className="scan-item-left">
                  <span className="scan-status-icon">
                    {getStatusIcon(scan.status)}
                  </span>
                  <div className="scan-item-info">
                    <span className="scan-url">{scan.url}</span>
                    <span className="scan-date">{scan.date}</span>
                  </div>
                </div>
                <div className="scan-item-right">
                  <span className={`scan-score ${getScoreClass(scan.score)}`}>
                    {scan.score}
                  </span>
                  <span className="scan-status-badge">
                    {scan.status === 'pass' && <span className="badge-pass">Secure</span>}
                    {scan.status === 'warn' && <span className="badge-warn">Warning</span>}
                    {scan.status === 'fail' && <span className="badge-fail">Critical</span>}
                  </span>
                  <span className="scan-view-icon">
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="profile-scans-empty">
              <Globe size={40} />
              <p>No scans performed yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== CUSTOM CONFIRM MODAL ===== */}
      {showConfirmModal && (
        <div className="confirm-overlay" onClick={handleCancelConfirm}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <div className="confirm-icon">
                <AlertTriangle size={28} style={{ color: '#f5576c' }} />
              </div>
              <h3>Confirm Action</h3>
            </div>
            <div className="confirm-body">
              <p>Are you sure you want to remove your profile picture?</p>
              <p className="confirm-warning">This action cannot be undone.</p>
            </div>
            <div className="confirm-footer">
              <button className="confirm-btn cancel" onClick={handleCancelConfirm}>
                <X size={16} />
                Cancel
              </button>
              <button className="confirm-btn danger" onClick={handleConfirm}>
                <Trash2 size={16} />
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FULL IMAGE MODAL ===== */}
      {showFullImage && getProfileImageUrl() && (
        <div 
          className="full-image-overlay"
          onClick={() => setShowFullImage(false)}
        >
          <button
            className="full-image-close cursor-target"
            onClick={() => setShowFullImage(false)}
          >
            ✕
          </button>
          
          <div 
            className="full-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getProfileImageUrl()} 
              alt={profile.name}
              className="full-image"
            />
            <div className="full-image-info">
              <h3>{profile.name}</h3>
              <p>{profile.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== CAMERA MODAL ===== */}
      {showCameraModal && (
        <div className="camera-modal-overlay" onClick={closeCamera}>
          <div className="camera-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="camera-modal-header">
              <h3>{capturedPhoto ? 'Preview Photo' : 'Take a Photo'}</h3>
              <button className="camera-modal-close cursor-target" onClick={closeCamera}>
                <X size={20} />
              </button>
            </div>
            
            <div className="camera-modal-body">
              {cameraError ? (
                <div className="camera-error">
                  <AlertTriangle size={32} />
                  <p>{cameraError}</p>
                  <button onClick={startCamera} className="retry-camera-btn cursor-target">
                    Try Again
                  </button>
                </div>
              ) : !capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </>
              ) : (
                <div className="captured-preview">
                  <img src={capturedPhoto} alt="Captured" className="captured-image" />
                </div>
              )}
            </div>
            
            <div className="camera-modal-footer">
              {!capturedPhoto ? (
                <>
                  <button className="camera-btn cancel cursor-target" onClick={closeCamera}>
                    Cancel
                  </button>
                  <button 
                    className="camera-btn capture cursor-target" 
                    onClick={capturePhoto}
                    disabled={cameraError}
                  >
                    <Camera size={16} /> Capture
                  </button>
                </>
              ) : (
                <>
                  <button className="camera-btn retake cursor-target" onClick={retakePhoto}>
                    <X size={16} /> Retake
                  </button>
                  <button className="camera-btn save cursor-target" onClick={savePhoto}>
                    <CheckCircle size={16} /> Save Photo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== SCAN RESULTS POPUP ===== */}
      {selectedScan && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container scan-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close cursor-target" onClick={closePopup}>
              <X size={20} />
            </button>
            
            <div className="popup-header">
              <div className="popup-icon" style={{ 
                background: selectedScan.score >= 80 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 
                           selectedScan.score >= 60 ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' : 
                           'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <Shield size={28} />
              </div>
              <div className="popup-title">
                <h2>{selectedScan.url}</h2>
                <span className="popup-date"><Calendar size={14} /> {selectedScan.date}</span>
              </div>
            </div>

            <div className="popup-score-section">
              <div className="popup-score-circle" style={{ 
                borderColor: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c',
                color: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c'
              }}>
                {selectedScan.score}
              </div>
              <div className="popup-score-info">
                <h3>Security Score: {selectedScan.score >= 80 ? 'Good' : selectedScan.score >= 60 ? 'Fair' : 'Poor'}</h3>
                <p>Status: <span className={`status-badge ${selectedScan.status}`}>
                  {selectedScan.status === 'pass' && '✅ Secure'}
                  {selectedScan.status === 'warn' && '⚠️ Warning'}
                  {selectedScan.status === 'fail' && '❌ Critical'}
                </span></p>
              </div>
            </div>

            <div className="popup-findings">
              <h4><Info size={18} /> Detailed Findings</h4>
              {getScanDetails(selectedScan).map((finding, index) => (
                <div key={index} className={`popup-finding-item ${finding.status}`}>
                  <div className="finding-icon">
                    {finding.status === 'pass' && <CheckCircle size={18} style={{ color: '#43e97b' }} />}
                    {finding.status === 'warn' && <AlertTriangle size={18} style={{ color: '#fdcb6e' }} />}
                    {finding.status === 'fail' && <XCircle size={18} style={{ color: '#f5576c' }} />}
                  </div>
                  <div className="finding-content">
                    <div className="finding-label">{finding.label}</div>
                    <div className="finding-detail">{finding.detail}</div>
                    <div className="finding-impact"><strong>Impact:</strong> {finding.impact}</div>
                    <div className="finding-recommendation">
                      <Lightbulb size={14} /> <strong>Recommendation:</strong> {finding.recommendation}
                    </div>
                  </div>
                  <div className={`finding-severity ${finding.severity}`}>{finding.severity}</div>
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <button className="btn-primary cursor-target" onClick={closePopup}>
                <CheckCircle size={16} /> Got It
              </button>
              <button className="btn-secondary cursor-target" onClick={closePopup}>
                <X size={16} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;