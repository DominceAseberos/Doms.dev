import React, { useState, useEffect, useRef } from 'react';
import './PageLoader.css';

const PageLoader = ({
    isLoading = true,
    loadingText = "LOADING",
    onLoadComplete
}) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [status, setStatus] = useState("INITIALIZING");

    // Timing Constants
    const DURATION_MAX = 8000; // 8 seconds hard limit
    const ACCEL_DURATION = 500; // 0.5s to finish when loaded
    const TARGET_IDLE = 90; // Stall at 90% if still loading

    // Refs for animation state
    const stateRef = useRef({
        startTime: 0,
        animationId: null,
        isAccelerating: false,
        accelStartTime: 0,
        startProgress: 0,
        completed: false
    });

    useEffect(() => {
        // Reset state on mount
        stateRef.current.startTime = performance.now();
        stateRef.current.completed = false;
        stateRef.current.isAccelerating = false;

        const animate = (timestamp) => {
            const state = stateRef.current;
            if (state.completed) return;

            if (!state.startTime) state.startTime = timestamp;
            const elapsed = timestamp - state.startTime;

            // 1. TIMEOUT CHECK
            if (elapsed > DURATION_MAX && !state.isAccelerating) {
                // Force finish if we hit 8s limit
                finishLoading();
                return;
            }

            let currentProgress = 0;

            // 2. ACCELERATION MODE (Data Loaded)
            if (state.isAccelerating) {
                if (!state.accelStartTime) state.accelStartTime = timestamp;
                const accelElapsed = timestamp - state.accelStartTime;
                const progressDelta = 100 - state.startProgress;

                // Linear interpolation from startProgress to 100%
                const accelRatio = Math.min(accelElapsed / ACCEL_DURATION, 1);
                currentProgress = state.startProgress + (progressDelta * accelRatio);

                if (accelRatio >= 1) {
                    finishLoading();
                    return;
                }
            }
            // 3. NORMAL MODE (Still Loading)
            else {
                // Logarithmic-ish ease out to 90%
                // We map 0 -> DURATION_MAX to 0 -> 90
                // Use a simple ease-out curve: 1 - (1-x)^2
                const t = Math.min(elapsed / DURATION_MAX, 1);
                const easeOut = 1 - Math.pow(1 - t, 1.5); // Smoother ease
                currentProgress = easeOut * TARGET_IDLE;

                // Update status text based on progress thresholds
                if (currentProgress < 20) setStatus("CONNECTING");
                else if (currentProgress < 50) setStatus(loadingText || "FETCHING DATA");
                else if (currentProgress < 80) setStatus("PROCESSING ASSETS");
                else setStatus("FINALIZING");
            }

            setProgress(currentProgress);
            state.animationId = requestAnimationFrame(animate);
        };

        // Start animation loop
        stateRef.current.animationId = requestAnimationFrame(animate);

        return () => {
            if (stateRef.current.animationId) {
                cancelAnimationFrame(stateRef.current.animationId);
            }
        };
    }, []); // Run once on mount (setup loop)

    // Watch isLoading prop to trigger acceleration
    useEffect(() => {
        if (!isLoading && !stateRef.current.isAccelerating && !stateRef.current.completed) {
            // Trigger smooth acceleration to 100%
            stateRef.current.isAccelerating = true;
            stateRef.current.startProgress = progress; // Start from current visual progress
            setStatus("READY");
        }
    }, [isLoading, progress]);

    const finishLoading = () => {
        stateRef.current.completed = true;
        setProgress(100);
        setStatus("READY");

        // Stop animation loop
        if (stateRef.current.animationId) {
            cancelAnimationFrame(stateRef.current.animationId);
        }

        // Exit sequence
        setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setVisible(false);
                onLoadComplete?.();
            }, 500); // CSS transition delay
        }, 200); // Brief pause at 100%
    };

    if (!visible) return null;

    return (
        <div className={`page-loader ${fadeOut ? 'fade-out' : ''}`}>
            <div className="page-loader__content">
                <div className="page-loader__logo-container">
                    <span className="page-loader__logo">D</span>
                </div>

                <div className="page-loader__bar-container">
                    <div
                        className="page-loader__bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="page-loader__status">
                    {status}
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
