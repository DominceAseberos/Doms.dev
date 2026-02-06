import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2 } from 'lucide-react';
import './PageLoader.css';

const PreLoader = ({ onLoadComplete }) => {
    const containerRef = useRef(null);
    const intervalsRef = useRef({ font: null, progress: null });
    const completedRef = useRef(false);

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("BOOTING SYSTEM");
    const [isComplete, setIsComplete] = useState(false);
    const [currentFont, setCurrentFont] = useState(0);

    const fonts = ['Orbitron', 'Audiowide', 'Bebas Neue', 'Rajdhani'];

    useEffect(() => {
        // Skip if already completed
        if (completedRef.current) return;

        let currentProgress = 0;

        // Font cycling
        intervalsRef.current.font = setInterval(() => {
            setCurrentFont((prev) => (prev + 1) % fonts.length);
        }, 300);

        // Progress animation
        intervalsRef.current.progress = setInterval(() => {
            currentProgress += Math.random() * 3;
            if (currentProgress > 100) currentProgress = 100;

            if (currentProgress < 30) setStatus("INITIALIZING CORE");
            else if (currentProgress < 60) setStatus("LOADING MODULES");
            else if (currentProgress < 90) setStatus("VERIFYING ASSETS");
            else setStatus("SYSTEM READY");

            setProgress(Math.min(currentProgress, 100));

            if (currentProgress >= 100) {
                clearInterval(intervalsRef.current.progress);
                completedRef.current = true;
                setIsComplete(true);

                setTimeout(() => {
                    clearInterval(intervalsRef.current.font);
                    if (containerRef.current) {
                        gsap.to(containerRef.current, {
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.inOut",
                            onComplete: onLoadComplete
                        });
                    }
                }, 500);
            }
        }, 50);

        return () => {
            if (intervalsRef.current.font) clearInterval(intervalsRef.current.font);
            if (intervalsRef.current.progress) clearInterval(intervalsRef.current.progress);
        };
    }, []);

    return (
        <div ref={containerRef} className="page-loader">
            <div className="page-loader__content">
                <div className="page-loader__logo-container">
                    {isComplete ? (
                        <CheckCircle2 size={80} className="page-loader__checkmark" strokeWidth={2.5} />
                    ) : (
                        <span
                            className="page-loader__logo"
                            style={{ fontFamily: `'${fonts[currentFont]}', sans-serif` }}
                        >
                            D
                        </span>
                    )}
                </div>

                <div className="page-loader__bar-container">
                    <div className="page-loader__bar-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="page-loader__status">{status}</div>
            </div>
        </div>
    );
};

export default PreLoader;
