import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
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

    return (
        <Router>
            <GlobalLoader />
            <div className="min-h-screen bg-[#151226] text-[#e6e6ff] selection:bg-blue-500/30">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

