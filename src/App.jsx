import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';
import './index.css';

// Code-split app pages so the public landing page ships a small initial bundle.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ZoneDetails = lazy(() => import('./pages/ZoneDetails'));
const DNSChecker = lazy(() => import('./pages/DNSChecker'));
const Edge = lazy(() => import('./pages/Edge'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const AUP = lazy(() => import('./pages/legal/AUP'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const Abuse = lazy(() => import('./pages/legal/Abuse'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <Router>
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </Router>
      <Toaster />
    </TooltipProvider>
  );
}
