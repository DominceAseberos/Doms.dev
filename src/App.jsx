import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnimatedLogo from './components/AnimatedLogo';

function App() {
    const [loading, setLoading] = useState(true);
    const [fadeLoading, setFadeLoading] = useState(false);

    useEffect(() => {
        // Show loading screen for enough time to complete 1 loop
        const timer = setTimeout(() => {
            setFadeLoading(true);
            setTimeout(() => setLoading(false), 500); // fade out effect
        }, 3200);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen bg-[#0a0f1a] transition-opacity duration-500 z-50 fixed inset-0 ${fadeLoading ? 'opacity-0' : 'opacity-100'}`}>
                <AnimatedLogo />
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-[#151226] text-[#e6e6ff] selection:bg-blue-500/30">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
