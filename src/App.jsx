import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ZoneDetails from './pages/ZoneDetails';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import AUP from './pages/AUP';
import Privacy from './pages/Privacy';
import Abuse from './pages/Abuse';
import DNSChecker from './pages/DNSChecker';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/auth/callback" element={<Auth />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/aup" element={<AUP />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/abuse" element={<Abuse />} />

        {/* Protected/Dashboard Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/zones" element={<Dashboard />} />
              <Route path="/zones/:id" element={<ZoneDetails />} />
              <Route path="/dns-checker" element={<DNSChecker />} />
              <Route path="/settings" element={<Settings />} />
              {/* Fallback to dashboard for unknown routes within layout? Or public 404? */}
              {/* For now, just redirecting / to landing is handled above */}
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
