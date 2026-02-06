import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { usePortfolioData } from '@shared/hooks/usePortfolioData';
import { preloadAssets } from '@shared/utils/assetPreloader';
import './PageLoader.css';

const UnifiedLoader = ({ onComplete }) => {
    const [phase, setPhase] = useState(1);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('INITIALIZING');
    const [subStatus, setSubStatus] = useState('');
    const [currentFont, setCurrentFont] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const containerRef = useRef(null);
    const intervalsRef = useRef({ font: null, progress: null });
    const phaseRef = useRef(1);

    const fonts = ['Orbitron', 'Audiowide', 'Bebas Neue', 'Rajdhani'];

    // Get data loading state
    const { isLoading: dataLoading } = usePortfolioData();

    // Phase 1: Load assets (0-50%)
    useEffect(() => {
        let mounted = true;
        const startTime = performance.now();

        const loadPhase1 = async () => {
            setStatus('LOADING ASSETS');

            await preloadAssets((loaded, total, asset) => {
                if (!mounted) return;

                const phaseProgress = (loaded / total) * 50;
                setProgress(phaseProgress);
                setSubStatus(`${asset.type}: ${asset.name}`);

                // Status updates
                if (loaded < total * 0.3) {
                    setStatus('LOADING FONTS');
                } else if (loaded < total * 0.7) {
                    setStatus('LOADING ASSETS');
                } else {
                    setStatus('VERIFYING RESOURCES');
                }
            });

            // Assets loaded, move to Phase 2
            if (mounted) {
                // Check if assets loaded instantly (cached)
                const loadDuration = performance.now() - startTime;
                const isCached = loadDuration < 200; // Threshold for cached assets

                // If cached, give it a tiny delay just to show 50% briefly, else normal delay
                setTimeout(() => {
                    phaseRef.current = 2;
                    setPhase(2);
                    setProgress(50);
                    // Pass cached state via ref or state if needed, checking in Phase 2
                    if (isCached) containerRef.current.dataset.cached = "true";
                }, isCached ? 50 : 200);
            }
        };

        loadPhase1();

        return () => {
            mounted = false;
        };
    }, []);

    // Phase 2: Load data (50-100%)
    useEffect(() => {
        if (phase !== 2) return;

        setStatus('LOADING DATA');
        setSubStatus('projects, profile, skills...');

        // Check if we are in "fast mode" (cached assets)
        const isCached = containerRef.current?.dataset.cached === "true";

        // Start font cycling for "D" logo
        intervalsRef.current.font = setInterval(() => {
            setCurrentFont((prev) => (prev + 1) % fonts.length);
        }, 200); // Slightly faster font cycle

        // Animate progress from 50% to 100%
        let currentProgress = 50;

        // Faster interval if cached, normal if not
        // User wants ~1.5s load time even if cached.
        // 50% -> 100% = 50 units.
        // If increment is 0.8, steps = 50 / 0.8 = 62.5 steps.
        // 62.5 steps * 20ms = 1250ms (plus Phase 1 time). Perfect.
        const intervalTime = (isCached && !dataLoading) ? 20 : 50;
        const increment = (isCached && !dataLoading) ? 0.8 : 0.5;

        intervalsRef.current.progress = setInterval(() => {
            // STOP at 90% if data is still loading
            // GO to 100% if data is loaded OR we are in fast mode (assuming fast mode implies data readiness check or we skip wait)
            // Actually, if data is NOT ready, we must wait regardless of cache.
            const limit = (!dataLoading) ? 100 : 90;

            if (currentProgress < limit) {
                currentProgress += increment;
                // Cap at limit
                if (currentProgress > limit) currentProgress = limit;

                setProgress(currentProgress);

                // Status updates based on progress
                if (currentProgress < 60) {
                    setStatus('CONNECTING');
                } else if (currentProgress < 75) {
                    setStatus('FETCHING DATA');
                } else if (currentProgress < 85) {
                    setStatus('PROCESSING');
                } else {
                    setStatus('FINALIZING');
                }
            }
        }, intervalTime);

        return () => {
            if (intervalsRef.current.font) clearInterval(intervalsRef.current.font);
            if (intervalsRef.current.progress) clearInterval(intervalsRef.current.progress);
        };
    }, [phase, dataLoading]);

    // Complete when data is ready
    useEffect(() => {
        if (phase === 2 && !dataLoading && !isComplete) {
            if (import.meta.env.DEV) console.log('[UnifiedLoader] Data loaded, completing...');

            // Clear intervals
            if (intervalsRef.current.font) clearInterval(intervalsRef.current.font);
            if (intervalsRef.current.progress) clearInterval(intervalsRef.current.progress);

            // Accelerate to 100%
            setProgress(100);
            setStatus('SYSTEM READY');
            setIsComplete(true);

            // Show success state briefly, then fade out
            setTimeout(() => {
                if (import.meta.env.DEV) console.log('[UnifiedLoader] Starting fade out...');

                if (containerRef.current) {
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            if (import.meta.env.DEV) console.log('[UnifiedLoader] Fade complete, calling onComplete');
                            onComplete?.();
                        }
                    });
                } else {
                    // Fallback if container ref is null
                    if (import.meta.env.DEV) console.log('[UnifiedLoader] Container ref null, calling onComplete directly');
                    onComplete?.();
                }
            }, 500);
        }
    }, [phase, dataLoading, isComplete, onComplete]);

    return (
        <div ref={containerRef} className="page-loader">
            <div className="page-loader__content">
                <div className="page-loader__logo-container">
                    {isComplete ? (
                        <CheckCircle2
                            size={80}
                            className="page-loader__checkmark"
                            strokeWidth={2.5}
                        />
                    ) : (
                        <span
                            className="page-loader__logo"
                            style={{
                                fontFamily: phase === 1
                                    ? `'Orbitron', sans-serif`
                                    : `'${fonts[currentFont]}', sans-serif`
                            }}
                        >
                            D
                        </span>
                    )}
                </div>

                <div className="page-loader__bar-container">
                    <div
                        className="page-loader__bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="page-loader__status">{status}</div>
                {subStatus && (
                    <div
                        className="page-loader__sub-status"
                        style={{
                            fontSize: 'clamp(10px, 1.5vw, 12px)',
                            color: 'rgba(255, 255, 255, 0.4)',
                            marginTop: '8px',
                            fontFamily: 'monospace'
                        }}
                    >
                        {subStatus}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedLoader;
