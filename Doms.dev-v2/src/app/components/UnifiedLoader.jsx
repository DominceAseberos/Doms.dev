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
                setTimeout(() => {
                    phaseRef.current = 2;
                    setPhase(2);
                    setProgress(50);
                }, 200);
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

        // Start font cycling for "D" logo
        intervalsRef.current.font = setInterval(() => {
            setCurrentFont((prev) => (prev + 1) % fonts.length);
        }, 300);

        // Animate progress from 50% to 90% while loading
        let currentProgress = 50;
        intervalsRef.current.progress = setInterval(() => {
            if (dataLoading && currentProgress < 90) {
                currentProgress += 0.5;
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
        }, 50);

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
