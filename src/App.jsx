import React, { useEffect, lazy, Suspense } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Home from './pages/Home/index';
import ProjectsPage from './pages/Projects/index';
import ProjectDetailsPage from './pages/Projects/components/ProjectDetailsPage';
import AboutPage from './pages/About/index';
import ContactPage from './pages/Contact/index';
import LabPage from './pages/Lab/index';
// Admin pages — dev only, excluded from production bundle
const LandingEditor  = import.meta.env.DEV ? lazy(() => import('./pages/admin/LandingEditor'))  : null;
const AboutEditor    = import.meta.env.DEV ? lazy(() => import('./pages/admin/AboutEditor'))    : null;
const ProjectEditor  = import.meta.env.DEV ? lazy(() => import('./pages/admin/ProjectEditor'))  : null;
import GlobalLoader from './components/GlobalLoader';
import useLoadingStore from './store/useLoadingStore';
import useThemeStore from './store/useThemeStore';

function App() {
    const setLoading = useLoadingStore((state) => state.setLoading);
    const initTheme = useThemeStore((state) => state.initTheme);

    useEffect(() => {
        // App initial load complete after 3.2s
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3200);

        return () => clearTimeout(timer);
    }, [setLoading]);

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    // Initialize Lenis
    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: true,
        });
        // Expose globally so components can call lenis.stop() / lenis.start()
        window.lenis = lenis;
        return () => { window.lenis = null; };
    }, []);

    return (
        <Router>
            <GlobalLoader />
            <div className="nav-hover-zone" aria-hidden="true" />
            <div id="smooth-wrapper" className="min-h-screen selection:bg-red-500/30">
                <div id="smooth-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/lab" element={<LabPage />} />
                        {import.meta.env.DEV && LandingEditor && (
                            <Route path="/admin/landing" element={<Suspense fallback={null}><LandingEditor /></Suspense>} />
                        )}
                        {import.meta.env.DEV && AboutEditor && (
                            <Route path="/admin/about" element={<Suspense fallback={null}><AboutEditor /></Suspense>} />
                        )}
                        {import.meta.env.DEV && ProjectEditor && (
                            <Route path="/admin/projects" element={<Suspense fallback={null}><ProjectEditor /></Suspense>} />
                        )}
                        {import.meta.env.DEV && ProjectEditor && (
                            <Route path="/admin/projects/:projectId" element={<ProjectDetailsPage isAdmin={true} />} />
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

