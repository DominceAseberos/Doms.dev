import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigationStore } from '@/store/navigationStore';
import { usePortfolioData } from "@shared/hooks/usePortfolioData";

export const useDashboard = () => {
    const compRef = useRef(null);
    const { dashboardVisited, setDashboardVisited } = useNavigationStore();
    const { uiConfig, profile, isLoading } = usePortfolioData();
    const [isMobile, setIsMobile] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [revealReady, setRevealReady] = useState(false);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Data ready check
    useEffect(() => {
        if (!isLoading && profile && uiConfig) {
            setIsDataReady(true);
        }
    }, [isLoading, profile, uiConfig]);

    // Loader callback
    const handleLoadComplete = useCallback(() => {
        setRevealReady(true);
    }, []);

    // Mark visited once mounted/ready logic handled in animation hook or here?
    // Original code set it in the animation effect.
    // We can expose setDashboardVisited or handle it in animation hook.
    // Since animation hook handles the "entry", it fits there better.

    return {
        compRef,
        isMobile,
        isDataReady,
        revealReady,
        handleLoadComplete,
        uiConfig,
        profile,
        dashboardVisited,     // Needed for animation hook
        setDashboardVisited   // Needed for animation hook
    };
};
