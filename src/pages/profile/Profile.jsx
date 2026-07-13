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
import { historyService } from '../../services/historyService';
import './Profile.css';

const Profile = ({ user: propUser, onLogout, onSelectScan }) => {
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
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const menuRef = useRef(null);

  // Get user from props or localStorage
  const getUser = () => {
    if (propUser) return propUser;
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        localStorage.setItem('user', JSON.stringify(parsed));
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing session user data:', error);
    }
    
    return null;
  };

  const user = getUser();

  // Helper function to get user's full name
  const getUserFullName = () => {
    if (!user) return '';
    if (user.name) return user.name;
    if (user.full_name) return user.full_name;
    if (user.first_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    if (user.email) return user.email.split('@')[0];
    return '';
  };

  // Initialize profile with user data from registration
  const [profile, setProfile] = useState({
    name: getUserFullName() || '',
    email: user?.email || ''
  });

  // Load scan history from historyService
  useEffect(() => {
    const loadHistory = () => {
      try {
        const history = historyService.getHistory();
        setScanHistory(history);
      } catch (error) {
        console.error('Error loading scan history:', error);
        setScanHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistory();
  }, []);

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: getUserFullName() || user?.email?.split('@')[0] || '',
        email: user?.email || ''
      });
    }
  }, [user]);

  // Load saved image for specific user
  useEffect(() => {
    if (user?.email) {
      const savedImage = localStorage.getItem(`profileImage_${user.email}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [user]);

  // Load saved image on mount (fallback)
  useEffect(() => {
    if (!user?.email) {
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
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
    // Save profile data with user-specific key
    if (user?.email) {
      localStorage.setItem(`profileData_${user.email}`, JSON.stringify(profile));
    } else {
      localStorage.setItem('profileData', JSON.stringify(profile));
    }
    showToast('✅ Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setProfile({
        name: getUserFullName() || user?.email?.split('@')[0] || '',
        email: user?.email || ''
      });
    }
    showToast('📝 Changes cancelled', 'info');
  };

  // ===== TOAST NOTIFICATION - TOP RIGHT =====
  const showToast = (message, type = 'success') => {
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

  // ===== PROFILE PICTURE HANDLERS =====

  const getFirstLetter = () => {
    if (!profile.name) return '?';
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
        // Save with user-specific key
        if (user?.email) {
          localStorage.setItem(`profileImage_${user.email}`, reader.result);
        } else {
          localStorage.setItem('profileImage', reader.result);
        }
        setIsUploading(false);
        setShowMenu(false);
        showToast('✅ Profile picture uploaded successfully!', 'success');
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
      if (user?.email) {
        localStorage.setItem(`profileImage_${user.email}`, capturedPhoto);
      } else {
        localStorage.setItem('profileImage', capturedPhoto);
      }
      closeCamera();
      showToast('✅ Profile picture saved successfully!', 'success');
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
        if (user?.email) {
          localStorage.removeItem(`profileImage_${user.email}`);
        } else {
          localStorage.removeItem('profileImage');
        }
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

  // ===== GET SCAN DETAILS =====
  const getScanDetails = (scan) => {
    const findings = [
      { 
        label: 'SSL Certificate', 
        status: scan.sslStatus === 'valid' ? 'pass' : scan.sslStatus === 'expiring' ? 'warn' : 'fail', 
        detail: scan.sslStatus === 'valid' ? 'Valid · 126 days left' : scan.sslStatus === 'expiring' ? 'Expiring soon · 15 days left' : 'Expired certificate',
        severity: scan.sslStatus === 'valid' ? 'low' : scan.sslStatus === 'expiring' ? 'medium' : 'high',
        impact: 'Protects data in transit between browser and server.',
        recommendation: scan.sslStatus === 'valid' ? 'Certificate is valid and secure' : scan.sslStatus === 'expiring' ? 'Renew certificate within 30 days' : 'Renew SSL certificate immediately'
      },
      { 
        label: 'Content-Security-Policy (CSP)', 
        status: scan.cspStatus === 'configured' ? 'pass' : scan.cspStatus === 'partial' ? 'warn' : 'fail', 
        detail: scan.cspStatus === 'configured' ? 'Configured properly' : scan.cspStatus === 'partial' ? 'Partially configured' : 'Missing',
        severity: scan.cspStatus === 'configured' ? 'low' : scan.cspStatus === 'partial' ? 'medium' : 'high',
        impact: 'Prevents XSS attacks by controlling resources.',
        recommendation: scan.cspStatus === 'configured' ? 'CSP is properly configured' : scan.cspStatus === 'partial' ? 'Add missing CSP directives' : 'Implement a Content Security Policy'
      },
      { 
        label: 'HSTS (Strict-Transport-Security)', 
        status: scan.hstsStatus === 'enabled' ? 'pass' : scan.hstsStatus === 'weak' ? 'warn' : 'fail', 
        detail: scan.hstsStatus === 'enabled' ? 'Enabled with valid config' : scan.hstsStatus === 'weak' ? 'Configured but weak' : 'Missing',
        severity: scan.hstsStatus === 'enabled' ? 'low' : scan.hstsStatus === 'weak' ? 'medium' : 'high',
        impact: 'Forces HTTPS connections to prevent downgrade attacks.',
        recommendation: scan.hstsStatus === 'enabled' ? 'HSTS is properly configured' : scan.hstsStatus === 'weak' ? 'Increase HSTS max-age' : 'Enable HSTS on your server'
      },
      { 
        label: 'SPF Record', 
        status: scan.spfStatus === 'configured' ? 'pass' : scan.spfStatus === 'partial' ? 'warn' : 'fail', 
        detail: scan.spfStatus === 'configured' ? 'Configured with proper records' : scan.spfStatus === 'partial' ? 'Partially configured' : 'Missing',
        severity: scan.spfStatus === 'configured' ? 'low' : scan.spfStatus === 'partial' ? 'medium' : 'high',
        impact: 'Prevents email spoofing and protects domain reputation.',
        recommendation: scan.spfStatus === 'configured' ? 'SPF is properly configured' : scan.spfStatus === 'partial' ? 'Update SPF records' : 'Configure SPF records'
      },
      { 
        label: 'Open Ports', 
        status: scan.portsStatus === 'secured' ? 'pass' : scan.portsStatus === 'warning' ? 'warn' : 'fail', 
        detail: scan.portsStatus === 'secured' ? 'No unnecessary ports exposed' : scan.portsStatus === 'warning' ? 'Some unnecessary ports open' : 'Critical ports exposed',
        severity: scan.portsStatus === 'secured' ? 'low' : scan.portsStatus === 'warning' ? 'medium' : 'high',
        impact: 'Reduces attack surface and minimizes entry points.',
        recommendation: scan.portsStatus === 'secured' ? 'All ports are properly secured' : scan.portsStatus === 'warning' ? 'Close unnecessary open ports' : 'Immediately close exposed critical ports'
      },
    ];
    return findings;
  };

  // ===== STATS =====

  const totalScans = scanHistory.length;
  const avgScore = totalScans > 0 ? Math.round(scanHistory.reduce((acc, curr) => acc + curr.score, 0) / totalScans) : 0;
  const passedScans = scanHistory.filter(s => s.status === 'pass' || s.score >= 80).length;
  const failedScans = scanHistory.filter(s => s.status === 'fail' || s.score < 60).length;
  const warnScans = scanHistory.filter(s => s.status === 'warn' || (s.score >= 60 && s.score < 80)).length;

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getStatusIcon = (status, score) => {
    if (status === 'pass' || score >= 80) return <CheckCircle size={16} style={{ color: '#43e97b' }} />;
    if (status === 'warn' || (score >= 60 && score < 80)) return <AlertTriangle size={16} style={{ color: '#fdcb6e' }} />;
    return <XCircle size={16} style={{ color: '#f5576c' }} />;
  };

  const getStatusLabel = (status, score) => {
    if (status === 'pass' || score >= 80) return 'Secure';
    if (status === 'warn' || (score >= 60 && score < 80)) return 'Warning';
    return 'Critical';
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  // If no user is logged in
  if (!user && !profile.email) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <Shield size={48} />
          <h2>No User Logged In</h2>
          <p>Please log in to view your profile.</p>
          <button 
            className="btn-primary cursor-target"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          
          <div className="profile-name">{profile.name || 'User'}</div>
          
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
                  <span>{profile.name || 'Not set'}</span>
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
                  <span>{profile.email || 'Not set'}</span>
                )}
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
              <span className="stat-value">{avgScore}%</span>
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
          {scanHistory.length > 0 ? (
            scanHistory.map((scan) => (
              <div 
                key={scan.id} 
                className="profile-scan-item clickable"
                onClick={() => handleScanClick(scan)}
                style={{ cursor: 'pointer' }}
              >
                <div className="scan-item-left">
                  <span className="scan-status-icon">
                    {getStatusIcon(scan.status, scan.score)}
                  </span>
                  <div className="scan-item-info">
                    <span className="scan-url">{scan.domain || scan.url}</span>
                    <span className="scan-date">{new Date(scan.date).toLocaleString()}</span>
                  </div>
                </div>
                <div className="scan-item-right">
                  <span className={`scan-score ${getScoreClass(scan.score)}`}>
                    {scan.score}%
                  </span>
                  <span className="scan-status-badge">
                    {scan.status === 'pass' || scan.score >= 80 ? <span className="badge-pass">Secure</span> : 
                     scan.status === 'warn' || (scan.score >= 60 && scan.score < 80) ? <span className="badge-warn">Warning</span> : 
                     <span className="badge-fail">Critical</span>}
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
              <h3>{profile.name || 'User'}</h3>
              <p>{profile.email || ''}</p>
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
                <h2>{selectedScan.domain || selectedScan.url}</h2>
                <span className="popup-date"><Calendar size={14} /> {new Date(selectedScan.date).toLocaleString()}</span>
              </div>
            </div>

            <div className="popup-score-section">
              <div className="popup-score-circle" style={{ 
                borderColor: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c',
                color: selectedScan.score >= 80 ? '#43e97b' : selectedScan.score >= 60 ? '#fdcb6e' : '#f5576c'
              }}>
                {selectedScan.score}%
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