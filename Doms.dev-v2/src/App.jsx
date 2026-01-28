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

import PreLoader from './components/PreLoader'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from "./components/ScrollToTop.jsx"

// Lazy Load Portfolio Pages
const MainLayout = lazy(() => import('./layout/MainLayout.jsx'));
const Dashboard = lazy(() => import('./pages/dashboard.jsx'));
const AboutMePage = lazy(() => import('./pages/AboutMePage.jsx'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails.jsx'));

// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const ProfileManager = lazy(() => import('./pages/admin/ProfileManager'));
const MediaCenter = lazy(() => import('./pages/admin/MediaCenter'));
const DashboardManager = lazy(() => import('./pages/admin/DashboardManager'));

function App() {
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <ProjectsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <ProfileManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/media"
              element={
                <ProtectedRoute>
                  <MediaCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardManager />
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
