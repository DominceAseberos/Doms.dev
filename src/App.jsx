import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Home from './pages/Home/index';
import ProjectsPage from './pages/Projects/index';
import AboutPage from './pages/About/index';
import ContactPage from './pages/Contact/index';
import LabPage from './pages/Lab/index';
import GlobalLoader from './components/GlobalLoader';
import useLoadingStore from './store/useLoadingStore';

function App() {
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        // App initial load complete after 3.2s
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3200);

        return () => clearTimeout(timer);
    }, [setLoading]);

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
            <div id="smooth-wrapper" className="min-h-screen selection:bg-red-500/30">
                <div id="smooth-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/lab" element={<LabPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

