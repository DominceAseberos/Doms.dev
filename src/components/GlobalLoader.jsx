import React, { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

const GlobalLoader = () => {
    // We start as loading initially until Astro's page-load event tells us we are ready.
    const [renderLoader, setRenderLoader] = useState(true);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setRenderLoader(true);
            setFade(false); // Instantly show
        };

        const handleStop = () => {
            // Trigger fade out
            setFade(true);
            // Remove from DOM after transition completes
            setTimeout(() => setRenderLoader(false), 500);
        };

        // If we are already loaded when this runs, hide it.
        // For the very first load, the browser might have already fired DOMContentLoaded
        if (document.readyState === 'complete') {
            handleStop();
        }

        document.addEventListener('astro:before-preparation', handleStart);
        document.addEventListener('astro:page-load', handleStop);

        // Fallback for initial load if not caught by page-load
        window.addEventListener('load', handleStop);

        return () => {
            document.removeEventListener('astro:before-preparation', handleStart);
            document.removeEventListener('astro:page-load', handleStop);
            window.removeEventListener('load', handleStop);
        };
    }, []);

    if (!renderLoader) return null;

    return (
        <div
            className={`flex items-center justify-center min-h-screen bg-[var(--bg)] transition-opacity duration-500 z-50 fixed inset-0 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
            <AnimatedLogo />
        </div>
    );
};

export default GlobalLoader;
