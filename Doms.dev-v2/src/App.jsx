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

import PreLoader from '@app/components/PreLoader'
import ProtectedRoute from '@shared/components/ProtectedRoute'
import ErrorBoundary from '@app/components/ErrorBoundary'
import ScrollToTop from "@app/components/ScrollToTop.jsx"

// Lazy Load Portfolio Pages
const MainLayout = lazy(() => import('./layout/MainLayout.jsx'));
const Dashboard = lazy(() => import('@app/pages/dashboard.jsx'));
const AboutMePage = lazy(() => import('@app/pages/AboutMePage.jsx'));
const ProjectDetails = lazy(() => import('@app/pages/ProjectDetails.jsx'));
const FeedPage = lazy(() => import('@app/pages/FeedPage.jsx'));

// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import('@admin/pages/AdminDashboard'));
const LoginPage = lazy(() => import('@admin/pages/LoginPage'));
const ProjectsManager = lazy(() => import('@admin/pages/ProjectsManager'));
const ProfileManager = lazy(() => import('@admin/pages/ProfileManager'));
const MediaCenter = lazy(() => import('@admin/pages/MediaCenter'));
const MusicManager = lazy(() => import('@admin/pages/MusicManager'));
const FeedManager = lazy(() => import('@admin/pages/FeedManager'));
const AdminLayout = lazy(() => import('@admin/components/AdminLayout'));

function App() {
  // ...

  const [isLoading, setIsLoading] = useState(true);

  return (
    <ErrorBoundary>
      {isLoading && <PreLoader onLoadComplete={() => setIsLoading(false)} />}
      <Router>
        <ScrollToTop />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
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
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}
export default App
