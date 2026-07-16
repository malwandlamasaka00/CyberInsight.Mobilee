// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Plus, FileText,
  AlertTriangle, Activity, Award, CheckCircle
} from 'lucide-react';
import './Dashboard.css';
import ScanModal from '../../components/ScanModal/ScanModal';
import WelcomeCard from './components/WelcomeCard';
import DashboardStatCard from './components/DashboardStatCard';
import OverallScoreCard from './components/OverallScoreCard';
import QuickActions from './components/QuickActions';
import RecentScanCard from './components/RecentScanCard';
import RecentReportsCard from './components/RecentReportsCard';
import {
  getIssuesFoundCount,
  getPassedChecksCount,
} from "../../utils/scanUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    loadDashboard();
  }, []);

  const getScanStatus = (score) => {
    if (score >= 80) return "Secure";
    if (score >= 50) return "Needs Improvement";
    return "Critical";
  };

  const loadDashboard = async () => {
    try {
      const [userResponse, scansResponse] = await Promise.all([
        api.get('/auth/me'),
        api.get('/scans')
      ]);

      const user = userResponse.data;
      console.log("USER:", user);

      const fullName =
  `${user.first_name || ""} ${user.last_name || ""}`.trim();

setUserName(fullName || user.email || "User");

      const scans = scansResponse.data.map(scan => ({
        id: scan.id,
        domain: scan.url,
        url: scan.url,
        score: scan.security_score,
        timestamp: scan.created_at,
        date: scan.created_at,
        checks: []
      }));

      const totalScans = scans.length;

      const overallScore =
        totalScans > 0
          ? Math.round(
            scans.reduce(
              (sum, scan) => sum + Number(scan.score || 0),
              0
            ) / totalScans
          )
          : 0;

      // Calculate passed checks (score >= 80)
      const passedChecks = scans.filter(
        scan => (scan.score || 0) >= 80
      ).length;

      // Calculate critical issues (score < 50)
      const issuesFound = scans.filter(
        scan => (scan.score || 0) < 50
      ).length;

      // Calculate needs improvement (remaining scans)
      // totalScans - passedChecks - issuesFound = needsImprovement
      const needImprovementCount = totalScans - passedChecks - issuesFound;

      const recentScans = scans.slice(0, 5).map(scan => ({
        id: scan.id,
        domain: scan.domain || scan.url,
        date: scan.date,
        score: scan.score,
        status: getScanStatus(scan.score),
        issuesFound: scan.score < 50 ? 1 : 0
      }));

      const recentReports = [];

      setData({
        overallScore,
        scansThisMonth: totalScans,
        issuesFound,
        passedChecks,
        needImprovementCount, // Add this field
        recentScans,
        recentReports
      });

    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const [data, setData] = useState({
    overallScore: 0,
    scansThisMonth: 0,
    issuesFound: 0,
    passedChecks: 0,
    needImprovementCount: 0, // Initialize this field
    recentScans: [],
    recentReports: []
  });

  // Handle New Scan button click - navigates to History page
  const handleNewScan = () => {
    navigate('/scan');
  };

  return (
    <div className="dashboard-container">
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => {
          setIsScanModalOpen(false);
          loadDashboard();
        }}
      />

      <div className="dashboard-content">
        <div className="dashboard-header-actions">
          <div>
            <h1 className="dashboard-title">Security Dashboard</h1>
            <p className="dashboard-subtitle">Real-time security intelligence monitoring</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary cursor-target"
              onClick={handleNewScan}
            >
              <Plus size={18} />
              New Scan
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <WelcomeCard
          userName={userName}
          scanCount={data.scansThisMonth}
        />

        <div className="stats-grid">
          <DashboardStatCard
            title="Security Score"
            value={data.overallScore}
            suffix="%"
            icon={Award}
            color="blue"
            description="Overall security posture"
          />
          <DashboardStatCard
            title="Scans This Month"
            value={data.scansThisMonth}
            icon={Activity}
            color="green"
            description="Security scans performed"
          />
          <DashboardStatCard
            title="Critical Issues"
            value={data.issuesFound}
            icon={AlertTriangle}
            color="red"
            description="Require immediate attention"
          />
          <DashboardStatCard
            title="Passed Checks"
            value={data.passedChecks}
            icon={CheckCircle}
            color="green"
            description="Security checks passed"
          />
          <DashboardStatCard
            title="Needs Improvement" // Add this new stat card
            value={data.needImprovementCount}
            icon={Shield} // or any other icon you prefer
            color="yellow" // or "orange" depending on your theme
            description="Scans requiring attention"
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-left">
            <OverallScoreCard
              score={data.overallScore}
              criticalIssues={data.issuesFound}
              needImprovementCount={data.needImprovementCount}
              passedChecks={data.passedChecks}
              totalScans={data.scansThisMonth}
              averageScore={data.overallScore}
            />
            <QuickActions />
          </div>

          <div className="dashboard-right">
            <RecentScanCard scans={data.recentScans} />
            <RecentReportsCard reports={data.recentReports} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;