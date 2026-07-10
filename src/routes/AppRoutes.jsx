// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/dashboard/Dashboard';
import History from '../pages/history/History';
import Profile from '../pages/profile/Profile';
import Scan from '../pages/scan/Scan';
import Reports from '../pages/reports/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/dashboard" 
        element={
          <Layout>
            <Dashboard />
          </Layout>
        } 
      />
      <Route 
        path="/scan" 
        element={
          <Layout>
            <Scan />
          </Layout>
        } 
      />
      <Route 
        path="/history" 
        element={
          <Layout>
            <History />
          </Layout>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <Layout>
            <Profile />
          </Layout>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <Layout>
            <Reports />
          </Layout>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;