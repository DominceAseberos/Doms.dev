import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import MainLayout from "./layout/MainLayout.jsx"
import Dashboard from "./pages/dashboard.jsx"
import AboutMePage from "./pages/AboutMePage.jsx"
import ProjectDetails from "./pages/ProjectDetails.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"

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

import PreLoader from './components/PreLoader'

// ... (GSAP Setup remains)

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <PreLoader onLoadComplete={() => setIsLoading(false)} />}
      <Router>
        <ScrollToTop />
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
        </Routes>
      </Router>
    </>
  )
}
export default App
