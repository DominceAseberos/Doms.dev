import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './PageLoader.css'; // Shared styles

const PreLoader = ({ onLoadComplete }) => {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("BOOTING SYSTEM");

    useEffect(() => {
        let currentProgress = 0;

        // Simulate initial load (Boot sequence)
        const interval = setInterval(() => {
            currentProgress += Math.random() * 3;
            if (currentProgress > 100) currentProgress = 100;

            // Status Updates
            if (currentProgress < 30) setStatus("INITIALIZING CORE");
            else if (currentProgress < 60) setStatus("LOADING MODULES");
            else if (currentProgress < 90) setStatus("VERIFYING ASSETS");
            else setStatus("SYSTEM READY");

            setProgress(Math.min(currentProgress, 100));

            if (currentProgress >= 100) {
                clearInterval(interval);

                // Exit Animation
                setTimeout(() => {
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: onLoadComplete
                    });
                }, 500);
            }
        }, 50); // Fast ticks

        return () => clearInterval(interval);
    }, [onLoadComplete]);

    return (
        <div
            ref={containerRef}
            className="page-loader"
        >
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

export default PreLoader;
