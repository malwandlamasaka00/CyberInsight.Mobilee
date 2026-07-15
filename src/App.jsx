// App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import TargetCursor from './components/TargetCursor/TargetCursor';
import './styles/globals.css'; 

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
         
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;