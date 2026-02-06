import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// GSAP Performance Optimization
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Configure GSAP for optimal performance
gsap.registerPlugin(ScrollTrigger);

// Global GSAP optimizations (runs once)
gsap.config({
  force3D: true,           // Force GPU acceleration
  nullTargetWarn: false,   // Reduce console spam
});

// Set frame rate to 30fps (2x performance boost)
// Animations will be slightly less smooth but much more performant
gsap.ticker.fps(30);

// ScrollTrigger optimizations
ScrollTrigger.config({
  limitCallbacks: true,    // Reduce callback frequency
  syncInterval: 150,       // Check every 150ms instead of 100ms
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" // Only refresh on these events
});

import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { diagnosticService } from '@shared/services/diagnosticService'

import UnifiedLoader from '@app/components/UnifiedLoader';
import ProtectedRoute from '@shared/components/ProtectedRoute'
import ErrorBoundary from '@app/components/ErrorBoundary'
import ScrollToTop from "@app/components/ScrollToTop.jsx"

// Lazy Load Portfolio Pages
const MainLayout = lazy(() => import('./layout/MainLayout.jsx'));
const Dashboard = lazy(() => import('@app/pages/dashboard.jsx'));
const AboutMePage = lazy(() => import('@app/pages/AboutMePage.jsx'));
const ProjectDetails = lazy(() => import('@app/pages/ProjectDetails.jsx'));
const FeedPage = lazy(() => import('@app/pages/FeedPage.jsx'));
const NotFound = lazy(() => import('@app/pages/NotFound.jsx'));

// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import('@admin/pages/AdminDashboard'));
const LoginPage = lazy(() => import('@admin/pages/LoginPage'));
const ProjectsManager = lazy(() => import('@admin/pages/ProjectsManager'));
const ProfileManager = lazy(() => import('@admin/pages/ProfileManager'));
const MediaCenter = lazy(() => import('@admin/pages/MediaCenter'));
const MusicManager = lazy(() => import('@admin/pages/MusicManager'));
const FeedManager = lazy(() => import('@admin/pages/FeedManager'));
const DiagnosticLogs = lazy(() => import('@admin/pages/DiagnosticLogs'));
const AdminLayout = lazy(() => import('@admin/components/AdminLayout'));

// Route tracker component (must be inside Router)
const RouteTracker = () => {
  const location = useLocation();

  // Log visit once per session
  useEffect(() => {
    diagnosticService.logVisit();
  }, []);

  // Track breadcrumbs on route change
  useEffect(() => {
    diagnosticService.trackPageVisit(location.pathname);
  }, [location]);

  return null;
};

function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <ErrorBoundary>
      {!appReady && <UnifiedLoader onComplete={() => setAppReady(true)} />}
      {appReady && (
        <Router>
          <RouteTracker />
          <ScrollToTop />
          <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a]" />
          }>
            <Routes>
              {/* Main Dashboard Route */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />

              {/* Dedicated About Me Page Route */}
              <Route
                path="/about"
                element={<AboutMePage />}
              />

              {/* Project Details Page Route */}
              <Route
                path="/project/:id"
                element={<ProjectDetails />}
              />

              {/* Feed Page Route */}
              <Route
                path="/feed"
                element={<FeedPage />}
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ProjectsManager />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ProfileManager />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/media"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <MediaCenter />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/music"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <MusicManager />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/feed"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <FeedManager />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/diagnostics"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <DiagnosticLogs />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </ErrorBoundary>
  );
}
export default App

