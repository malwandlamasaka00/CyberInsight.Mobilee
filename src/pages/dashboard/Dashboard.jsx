// src/pages/dashboard/Dashboard.jsx
import React, { useState } from 'react';
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
  
  const [data] = useState({
    overallScore: 78,
    scansThisMonth: 45,
    criticalIssues: 3,
    passedChecks: 12,
    recentScans: [
      { id: 1, domain: 'example.com', date: '2026-07-09T14:30:00Z', score: 92, criticalIssues: 0 },
      { id: 2, domain: 'test-site.org', date: '2026-07-09T12:15:00Z', score: 65, criticalIssues: 2 },
      { id: 3, domain: 'myapp.io', date: '2026-07-08T18:45:00Z', score: 45, criticalIssues: 4 },
      { id: 4, domain: 'secure-site.com', date: '2026-07-08T10:00:00Z', score: 88, criticalIssues: 1 }
    ],
    recentReports: [
      { id: 1, domain: 'example.com', generated: '2026-07-09T15:00:00Z', size: '2.4 MB', type: 'PDF' },
      { id: 2, domain: 'test-site.org', generated: '2026-07-09T12:30:00Z', size: '1.8 MB', type: 'PDF' },
      { id: 3, domain: 'myapp.io', generated: '2026-07-08T19:00:00Z', size: '3.1 MB', type: 'PDF' }
    ]
  });

  return (
    <div className="dashboard-container">
      <ScanModal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)} 
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
              warnings={8}
              passedChecks={data.passedChecks}
              totalScans={127}
              averageScore={72}
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