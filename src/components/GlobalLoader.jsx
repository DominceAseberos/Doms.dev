import React, { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';
import useLoadingStore from '../store/useLoadingStore';

const GlobalLoader = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const [renderLoader, setRenderLoader] = useState(isLoading);
    const [fade, setFade] = useState(!isLoading);

    useEffect(() => {
        if (isLoading) {
            setRenderLoader(true);
            setFade(false); // Make it visible instantly when loading is true
        } else {
            // Initiate fade out when loading becomes false
            setFade(true);
            const timer = setTimeout(() => {
                setRenderLoader(false); // Remove from DOM after fade completes
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!renderLoader) return null;

    return (
        <div
            className={`flex items-center justify-center min-h-screen bg-[#0a0f1a] transition-opacity duration-500 z-50 fixed inset-0 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
            <AnimatedLogo />
        </div>
    );
};

export default GlobalLoader;
