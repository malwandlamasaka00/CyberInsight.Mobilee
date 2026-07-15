// src/pages/profile/Profile.jsx
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
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

const Profile = ({ onLogout, onSelectScan }) => {
  const { isAuthenticated } = useAuth();
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
  const [userData, setUserData] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const menuRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'Security Administrator',
    phone: '+1 (555) 123-4567',
    joined: '',
    lastActive: ''
  });

  // Load user data from authService
  const loadUserData = () => {
    try {
      // Get user from authService
      const user = authService.getCurrentUser();
      if (user) {
        setUserData(user);
        
        // Handle both field name formats
        const firstName = user.first_name || user.name || '';
        const lastName = user.last_name || user.surname || '';
        const fullName = firstName && lastName 
          ? `${firstName} ${lastName}` 
          : firstName || lastName || user.email?.split('@')[0] || 'User';
        
        setProfile({
          name: fullName,
          email: user.email || 'user@example.com',
          role: user.role || 'Security Administrator',
          phone: user.phone || '+1 (555) 123-4567',
          joined: user.memberSince || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          lastActive: new Date().toLocaleString()
        });
      } else {
        // Fallback to localStorage
        const userData = localStorage.getItem('sentinel_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserData(parsedUser);
          const firstName = parsedUser.first_name || parsedUser.name || '';
          const lastName = parsedUser.last_name || parsedUser.surname || '';
          const fullName = firstName && lastName 
            ? `${firstName} ${lastName}` 
            : firstName || lastName || parsedUser.email?.split('@')[0] || 'User';
          
          setProfile({
            name: fullName,
            email: parsedUser.email || 'user@example.com',
            role: parsedUser.role || 'Security Administrator',
            phone: parsedUser.phone || '+1 (555) 123-4567',
            joined: parsedUser.memberSince || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            lastActive: new Date().toLocaleString()
          });
        }
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  };

  // Load user data on mount and when auth changes
  useEffect(() => {
    loadUserData();
  }, [isAuthenticated]);

  // Load scan history from history service
  useEffect(() => {
    const loadHistory = () => {
      try {
        const history = historyService.getHistory();
        if (history && history.length > 0) {
          setScanHistory(history);
        } else {
          setScanHistory([]);
        }
      } catch (e) {
        console.error('Error loading history:', e);
        setScanHistory([]);
      }
    };

    loadHistory();

    // Listen for history updates
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener('scanHistoryUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('scanHistoryUpdated', handleHistoryUpdate);
    };
  }, []);

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

  // ===== TOAST NOTIFICATION =====
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    try {
      // Get existing user data
      let existingUser = authService.getCurrentUser();
      if (!existingUser) {
        const stored = localStorage.getItem('sentinel_user');
        if (stored) {
          existingUser = JSON.parse(stored);
        }
      }
      
      if (existingUser) {
        // Split the full name into first and last name
        const nameParts = profile.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const updatedUser = { 
          ...existingUser, 
          first_name: firstName,
          last_name: lastName,
          name: firstName,
          surname: lastName,
          phone: profile.phone,
          email: profile.email
        };
        
        // Update in authService
        if (authService.updateUser) {
          authService.updateUser(updatedUser);
        }
        
        // Update in localStorage
        localStorage.setItem('sentinel_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
      
      localStorage.setItem('profileData', JSON.stringify(profile));
      showToast('Profile updated successfully!', 'success');
    } catch (e) {
      console.error('Error saving user data:', e);
      showToast('Error saving profile', 'error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload user data
    loadUserData();
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
        showToast('Profile picture uploaded successfully!', 'success');
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
      showToast('Profile picture saved successfully!', 'success');
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

  // ===== GET SCAN DETAILS WITH RECOMMENDATIONS (FROM HISTORY) =====
  const getScanDetails = (scan) => {
    // If scan has checks array, use it
    if (scan.checks && Array.isArray(scan.checks) && scan.checks.length > 0) {
      return scan.checks.map(check => {
        const isPassed = check.status === "Passed";
        const isWarning = check.status === "Warning";
        const isFailed = check.status === "Failed";

        // Get recommendation based on check name and status
        const getRecommendation = (checkName, status) => {
          const isPass = status === "Passed";
          const isWarn = status === "Warning";
          const isFail = status === "Failed";

          // SSL/TLS Recommendations
          if (checkName === "SSL/TLS") {
            if (isPass) return "SSL certificate is valid and secure. No action required.";
            if (isWarn) return "⚠️ Certificate expires soon. Renew your SSL certificate within 30 days to maintain secure HTTPS connections.";
            return "🚨 SSL certificate is invalid or expired. Immediately renew your SSL certificate to prevent security warnings and protect user data in transit.";
          }

          // HTTP Security Headers Recommendations
          if (checkName === "Security Headers") {
            if (isPass) return "All security headers are properly configured. Your website is well-protected against web attacks.";
            if (isWarn) return "⚠️ Some security headers are missing. Implement Content-Security-Policy (CSP), HSTS, X-Frame-Options, and X-Content-Type-Options headers to improve security.";
            return "🚨 Critical security headers are missing. Implement Content-Security-Policy to prevent XSS attacks, enable HSTS to enforce HTTPS, set X-Frame-Options to prevent clickjacking, and configure X-Content-Type-Options to prevent MIME sniffing.";
          }

          // DNS Configuration Recommendations
          if (checkName === "DNS Configuration") {
            if (isPass) return "DNS is properly configured. Consider implementing SPF, DKIM, and DMARC for additional email security.";
            if (isWarn) return "⚠️ DNS configuration issues detected. Review your A records, MX records, and TXT records. Ensure proper SPF configuration to prevent email spoofing.";
            return "🚨 DNS is misconfigured. Immediately review and correct your DNS records. Configure SPF records to prevent email spoofing, implement DKIM for email authentication, and set up DMARC policies for email protection.";
          }

          // Network Security Recommendations
          if (checkName === "Network Security") {
            if (isPass) return "No open ports detected. Your network is properly secured. Continue monitoring for any changes.";
            if (isWarn) return "⚠️ Some unnecessary services are exposed. Review and close unnecessary open ports. Restrict access to essential services only.";
            return "🚨 Critical services are exposed. Immediately close all unnecessary open ports. Implement firewalls to filter traffic and regularly audit network configurations. Unauthorized access could compromise your infrastructure.";
          }

          // WHOIS Information Recommendations
          if (checkName === "WHOIS Information") {
            if (isPass) return "Domain information verified. Keep WHOIS details up to date and consider using WHOIS privacy protection.";
            if (isWarn) return "⚠️ Domain registration issues detected. Review your domain registration details and ensure all information is current.";
            return "🚨 Domain information is missing or invalid. Verify domain registration details, keep WHOIS information up to date, monitor domain expiration dates, and use WHOIS privacy protection.";
          }

          // Technology Detection Recommendations
          if (checkName === "Technologies") {
            if (isPass) return "No vulnerable technologies detected. Keep all technologies updated to latest versions for continued security.";
            if (isWarn) return "⚠️ Outdated technologies found. Update to the latest versions of all technologies. Replace outdated or vulnerable components.";
            return "🚨 Vulnerable technologies detected. Immediately update all technologies to their latest secure versions. Review your entire technology stack for known vulnerabilities and replace any insecure components.";
          }

          // Default recommendation
          if (isPass) return "Check passed. No action required.";
          if (isWarn) return "⚠️ Review and address the issue to improve security.";
          return "🚨 Critical issue. Immediate action required.";
        };

        // Get impact based on check name and status
        const getImpact = (checkName, status) => {
          const isPass = status === "Passed";
          const isWarn = status === "Warning";
          const isFail = status === "Failed";

          if (checkName === "SSL/TLS") {
            if (isPass) return "SSL/TLS encryption protects data in transit between users and your website.";
            if (isWarn) return "Expiring certificates will soon cause security warnings and potential data exposure.";
            return "Invalid certificates leave all data transmitted between users and your website vulnerable to interception and attacks.";
          }

          if (checkName === "Security Headers") {
            if (isPass) return "Properly configured security headers protect against XSS, clickjacking, MIME sniffing, and other web attacks.";
            if (isWarn) return "Missing headers leave your website partially exposed to web-based attacks.";
            return "Missing security headers leave your website vulnerable to XSS attacks, clickjacking, and other common web threats.";
          }

          if (checkName === "DNS Configuration") {
            if (isPass) return "Proper DNS configuration ensures reliable domain resolution and email security.";
            if (isWarn) return "DNS issues can lead to email delivery problems and potential domain takeover.";
            return "Misconfigured DNS leaves your domain vulnerable to spoofing, email interception, and potential takeover.";
          }

          if (checkName === "Network Security") {
            if (isPass) return "Secure network configuration minimizes attack surface and protects infrastructure.";
            if (isWarn) return "Exposed services provide additional entry points that attackers could exploit.";
            return "Open ports and exposed services provide direct entry points for attackers to compromise your infrastructure.";
          }

          if (checkName === "WHOIS Information") {
            if (isPass) return "Valid domain information helps establish trust and proper domain management.";
            if (isWarn) return "Domain registration issues could affect domain ownership verification.";
            return "Missing or invalid domain information could indicate domain ownership issues or potential fraud.";
          }

          if (checkName === "Technologies") {
            if (isPass) return "Up-to-date technologies reduce the risk of known vulnerabilities.";
            if (isWarn) return "Outdated technologies contain known vulnerabilities that attackers actively exploit.";
            return "Vulnerable technologies are common entry points for attackers and must be updated immediately.";
          }

          return isPass ? "Security check passed." : isWarn ? "⚠️ Security concern detected." : "🚨 Critical security issue detected.";
        };

        return {
          label: check.name,
          detail: check.details || "Check completed",
          status: isPassed ? "pass" : isWarning ? "warn" : "fail",
          severity: isPassed ? "low" : isWarning ? "medium" : "high",
          impact: getImpact(check.name, check.status),
          recommendation: getRecommendation(check.name, check.status)
        };
      });
    }

    // Fallback: Generate findings from scan status data
    const score = scan.score || 0;
    const findings = [];
    
    // SSL/TLS
    let sslStatus = 'pass';
    let sslDetail = 'Valid certificate';
    if (scan.sslStatus === 'expired') { sslStatus = 'fail'; sslDetail = 'Certificate expired'; }
    else if (scan.sslStatus === 'expiring') { sslStatus = 'warn'; sslDetail = 'Certificate expires soon'; }
    
    findings.push({
      label: 'SSL/TLS',
      detail: sslDetail,
      status: sslStatus,
      severity: sslStatus === 'pass' ? 'low' : sslStatus === 'warn' ? 'medium' : 'high',
      impact: sslStatus === 'pass' ? 'SSL/TLS encryption protects data in transit.' : 
               sslStatus === 'warn' ? 'Expiring certificates will soon cause security warnings.' : 
               'Invalid certificates leave data vulnerable to interception.',
      recommendation: sslStatus === 'pass' ? 'Certificate is valid and secure.' : 
                      sslStatus === 'warn' ? '⚠️ Renew certificate within 30 days.' : 
                      '🚨 Renew SSL certificate immediately.'
    });

    // Security Headers
    let headerStatus = 'pass';
    let headerDetail = 'All headers present';
    if (scan.cspStatus === 'missing' || scan.hstsStatus === 'missing') { 
      headerStatus = 'fail'; 
      headerDetail = 'Critical headers missing'; 
    } else if (scan.cspStatus === 'partial' || scan.hstsStatus === 'weak') { 
      headerStatus = 'warn'; 
      headerDetail = 'Some headers missing or weak'; 
    }
    
    findings.push({
      label: 'Security Headers',
      detail: headerDetail,
      status: headerStatus,
      severity: headerStatus === 'pass' ? 'low' : headerStatus === 'warn' ? 'medium' : 'high',
      impact: headerStatus === 'pass' ? 'Headers protect against web attacks.' : 
               headerStatus === 'warn' ? 'Missing headers expose website to attacks.' : 
               'Critical headers missing - website vulnerable to XSS and clickjacking.',
      recommendation: headerStatus === 'pass' ? 'Headers are properly configured.' : 
                      headerStatus === 'warn' ? '⚠️ Add missing security headers.' : 
                      '🚨 Implement Content-Security-Policy, HSTS, X-Frame-Options, and X-Content-Type-Options.'
    });

    // DNS Configuration
    let dnsStatus = 'pass';
    let dnsDetail = 'Properly configured';
    if (scan.spfStatus === 'missing') { dnsStatus = 'fail'; dnsDetail = 'SPF missing'; }
    else if (scan.spfStatus === 'partial') { dnsStatus = 'warn'; dnsDetail = 'SPF partially configured'; }
    
    findings.push({
      label: 'DNS Configuration',
      detail: dnsDetail,
      status: dnsStatus,
      severity: dnsStatus === 'pass' ? 'low' : dnsStatus === 'warn' ? 'medium' : 'high',
      impact: dnsStatus === 'pass' ? 'Proper DNS ensures email security.' : 
               dnsStatus === 'warn' ? 'DNS issues could lead to email problems.' : 
               'Misconfigured DNS leaves domain vulnerable to spoofing.',
      recommendation: dnsStatus === 'pass' ? 'DNS is properly configured.' : 
                      dnsStatus === 'warn' ? '⚠️ Fix DNS configuration issues.' : 
                      '🚨 Reconfigure DNS records and set up SPF, DKIM, DMARC.'
    });

    // Network Security
    let netStatus = 'pass';
    let netDetail = 'No open ports';
    if (scan.portsStatus === 'exposed') { netStatus = 'fail'; netDetail = 'Critical ports exposed'; }
    else if (scan.portsStatus === 'warning') { netStatus = 'warn'; netDetail = 'Some services exposed'; }
    
    findings.push({
      label: 'Network Security',
      detail: netDetail,
      status: netStatus,
      severity: netStatus === 'pass' ? 'low' : netStatus === 'warn' ? 'medium' : 'high',
      impact: netStatus === 'pass' ? 'Network minimizes attack surface.' : 
               netStatus === 'warn' ? 'Exposed services provide attack entry points.' : 
               'Open ports provide direct entry for attackers.',
      recommendation: netStatus === 'pass' ? 'All ports are properly secured.' : 
                      netStatus === 'warn' ? '⚠️ Close unnecessary open ports.' : 
                      '🚨 Immediately close exposed critical ports.'
    });

    return findings;
  };

  // ===== STATS =====

  const totalScans = scanHistory.length;
  const avgScore = totalScans > 0 ? Math.round(scanHistory.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalScans) : 0;
  const passedScans = scanHistory.filter(s => s.status === 'Secure' || s.status === 'Passed').length;
  const failedScans = scanHistory.filter(s => s.status === 'Critical' || s.status === 'Failed').length;
  const warnScans = scanHistory.filter(s => s.status === 'Needs Improvement' || s.status === 'Warning').length;

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getStatusIcon = (status) => {
    const statusLower = String(status).toLowerCase();
    if (statusLower === 'secure' || statusLower === 'passed' || statusLower === 'pass') {
      return <CheckCircle size={16} style={{ color: '#43e97b' }} />;
    }
    if (statusLower === 'needs improvement' || statusLower === 'warning' || statusLower === 'warn') {
      return <AlertTriangle size={16} style={{ color: '#fdcb6e' }} />;
    }
    if (statusLower === 'critical' || statusLower === 'failed' || statusLower === 'fail') {
      return <XCircle size={16} style={{ color: '#f5576c' }} />;
    }
    return <Shield size={16} style={{ color: '#94a3b8' }} />;
  };

  const getStatusLabel = (status) => {
    const statusLower = String(status).toLowerCase();
    if (statusLower === 'secure' || statusLower === 'passed' || statusLower === 'pass') return 'Secure';
    if (statusLower === 'needs improvement' || statusLower === 'warning' || statusLower === 'warn') return 'Warning';
    if (statusLower === 'critical' || statusLower === 'failed' || statusLower === 'fail') return 'Critical';
    return status;
  };

  const getStatusClass = (status) => {
    const statusLower = String(status).toLowerCase();
    if (statusLower === 'secure' || statusLower === 'passed' || statusLower === 'pass') return 'pass';
    if (statusLower === 'needs improvement' || statusLower === 'warning' || statusLower === 'warn') return 'warn';
    if (statusLower === 'critical' || statusLower === 'failed' || statusLower === 'fail') return 'fail';
    return 'warn';
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
                    {getStatusIcon(scan.status)}
                  </span>
                  <div className="scan-item-info">
                    <span className="scan-url">{scan.domain || scan.url || 'Unknown'}</span>
                    <span className="scan-date">{scan.date ? new Date(scan.date).toLocaleString() : 'Unknown date'}</span>
                  </div>
                </div>
                <div className="scan-item-right">
                  <span className={`scan-score ${getScoreClass(scan.score || 0)}`}>
                    {scan.score || 0}
                  </span>
                  <span className="scan-status-badge">
                    <span className={`badge-${getStatusClass(scan.status)}`}>
                      {getStatusLabel(scan.status)}
                    </span>
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
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Run a security scan to see results here</p>
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
                background: (selectedScan.score || 0) >= 80 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 
                           (selectedScan.score || 0) >= 60 ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)' : 
                           'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }}>
                <Shield size={28} />
              </div>
              <div className="popup-title">
                <h2>{selectedScan.domain || selectedScan.url || 'Unknown'}</h2>
                <span className="popup-date"><Calendar size={14} /> {selectedScan.date ? new Date(selectedScan.date).toLocaleString() : 'Unknown date'}</span>
              </div>
            </div>

            <div className="popup-score-section">
              <div className="popup-score-circle" style={{ 
                borderColor: (selectedScan.score || 0) >= 80 ? '#43e97b' : (selectedScan.score || 0) >= 60 ? '#fdcb6e' : '#f5576c',
                color: (selectedScan.score || 0) >= 80 ? '#43e97b' : (selectedScan.score || 0) >= 60 ? '#fdcb6e' : '#f5576c'
              }}>
                {selectedScan.score || 0}
              </div>
              <div className="popup-score-info">
                <h3>Security Score: {(selectedScan.score || 0) >= 80 ? 'Good' : (selectedScan.score || 0) >= 60 ? 'Fair' : 'Poor'}</h3>
                <p>Status: <span className={`status-badge ${getStatusClass(selectedScan.status)}`}>
                  {getStatusLabel(selectedScan.status)}
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