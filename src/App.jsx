import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ZoneDetails from './pages/ZoneDetails';
import DNSChecker from './pages/DNSChecker';
import Edge from './pages/Edge';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Terms from './pages/legal/Terms';
import AUP from './pages/legal/AUP';
import Privacy from './pages/legal/Privacy';
import Abuse from './pages/legal/Abuse';
import ApiDocs from './pages/ApiDocs';
import Layout from './components/Layout';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';
import './index.css';

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/auth/callback" element={<Auth />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/aup" element={<AUP />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/abuse" element={<Abuse />} />
          <Route path="/api-docs" element={<ApiDocs />} />

          {/* Protected (app shell) */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/zones" element={<Dashboard />} />
                  <Route path="/zones/:id" element={<ZoneDetails />} />
                  <Route path="/dns-checker" element={<DNSChecker />} />
                  <Route path="/edge" element={<Edge />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </TooltipProvider>
  );
}
