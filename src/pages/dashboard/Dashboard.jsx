// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { historyService } from '../../services/historyService';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  useEffect(() => {
  loadDashboard();
}, []);

const loadDashboard = () => {
  const history = historyService.getHistory();

  const totalScans = history.length;

  const overallScore =
  totalScans > 0
    ? Math.round(
        history.reduce((sum, scan) => sum + scan.score, 0) / totalScans
      )
    : 0;

  const criticalIssues = history.reduce(
  (sum, scan) => sum + (scan.critical || 0),
  0
);

  const passedChecks = history.reduce((sum, scan) => {
  let passed = 0;

  if (scan.sslStatus === "valid") passed++;
  if (scan.cspStatus === "configured") passed++;
  if (scan.hstsStatus === "enabled") passed++;
  if (scan.spfStatus === "configured") passed++;
  if (scan.portsStatus === "secure") passed++;

  return sum + passed;
}, 0);

  const recentScans = history.slice(0, 5).map((scan, index) => ({
    id: index,
    domain: scan.domain || scan.url,
    date: scan.timestamp || scan.date || new Date().toISOString(),
    score: scan.score,

criticalIssues: scan.critical || 0
  }));

  const recentReports = history
    .filter(scan => scan.reportGenerated)
    .slice(0, 5)
    .map((scan, index) => ({
      id: index,
      domain: scan.domain || scan.url,
      generated: scan.timestamp,
      size: "PDF",
      type: "PDF"
    }));

  setData({
    overallScore,
    scansThisMonth: totalScans,
    criticalIssues,
    passedChecks,
    recentScans,
    recentReports
  });
};
 const [data, setData] = useState({
  overallScore: 0,
  scansThisMonth: 0,
  criticalIssues: 0,
  passedChecks: 0,
  recentScans: [],
  recentReports: []
});

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
            <button className="btn-primary cursor-target" onClick={() => setIsScanModalOpen(true)}>
              <Plus size={18} />
              New Scan
            </button>
            <button className="btn-secondary cursor-target" onClick={() => navigate('/reports')}>
              <FileText size={18} />
              Reports
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <WelcomeCard 
          userName="Samkelo Mazeka"
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
            trend="up"
            trendValue="3%"
          />
          <DashboardStatCard
            title="Scans This Month"
            value={data.scansThisMonth}
            icon={Activity}
            color="green"
            description="Security scans performed"
            trend="up"
            trendValue="12%"
          />
          <DashboardStatCard
            title="Critical Issues"
            value={data.criticalIssues}
            icon={AlertTriangle}
            color="red"
            description="Require immediate attention"
            trend="down"
            trendValue="2"
          />
          <DashboardStatCard
            title="Passed Checks"
            value={data.passedChecks}
            icon={CheckCircle}
            color="green"
            description="Security checks passed"
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-left">
            <OverallScoreCard
              score={data.overallScore}
              criticalIssues={data.criticalIssues}
              warnings={0}
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