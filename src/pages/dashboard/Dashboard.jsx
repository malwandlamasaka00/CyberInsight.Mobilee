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
import {
  getIssuesFoundCount,
  getPassedChecksCount,
} from "../../utils/scanUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  useEffect(() => {
  loadDashboard();
}, []);


    const getScanStatus = (score) => {
      if (score >= 80) return "Secure";
      if (score >= 50) return "Needs Improvement";
      return "Critical";
    };


const loadDashboard = () => {
  const history = historyService.getHistory();

  const totalScans = history.length;

  const overallScore =
  totalScans > 0
    ? Math.round(
        history.reduce(
          (sum, scan) => sum + Number(scan.score || 0),
          0
        ) / totalScans
      )
    : 0;

  const issuesFound = history.reduce(
  (sum, scan) => sum + getIssuesFoundCount(scan),
  0
);
  const passedChecks = history.reduce(
  (sum, scan) => sum + getPassedChecksCount(scan),
  0
  
)
console.log("History:", history);

console.log(
  history.map(scan => ({
    score: scan.score,
    passed: getPassedChecksCount(scan),
    issues: getIssuesFoundCount(scan)
  }))
);

console.log({
  overallScore,
  passedChecks,
  issuesFound
});

;

  const recentScans = history.slice(0, 5).map((scan, index) => ({
  id: index,
  domain: scan.domain || scan.url,
  date: scan.timestamp || scan.date || new Date().toISOString(),
  score: scan.score,
  status: getScanStatus(scan.score),
  issuesFound: getIssuesFoundCount(scan)
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
console.log(
  history.map(scan => ({
    domain: scan.domain,
    ssl: scan.sslStatus,
    csp: scan.cspStatus,
    hsts: scan.hstsStatus,
    spf: scan.spfStatus,
    ports: scan.portsStatus,
    issues: getIssuesFoundCount(scan)
  }))
);
 setData({
  overallScore,
  scansThisMonth: totalScans,
  issuesFound,
  passedChecks,
  recentScans,
  recentReports
});
};
const [data, setData] = useState({
  overallScore: 0,
  scansThisMonth: 0,
  issuesFound: 0,
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
            value={data.issuesFound}
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
              criticalIssues={data.issuesFound}
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