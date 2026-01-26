import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const PreLoader = ({ onLoadComplete }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline();

        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 10;
                return next > 100 ? 100 : next;
            });
        }, 100);

        // Animate Text
        gsap.fromTo(textRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        // When page fully loads
        const handleLoad = () => {
            clearInterval(interval);
            setProgress(100);

            // Exit animation
            tl.to(textRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                delay: 0.5
            })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: onLoadComplete
                });
        };

        // If document is already loaded
        if (document.readyState === 'complete') {
            setTimeout(handleLoad, 1500); // Min display time
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
            clearInterval(interval);
        };
    }, [onLoadComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
            style={{
                background: `linear-gradient(to bottom, rgb(10, 10, 10), rgb(20, 20, 20))`
            }}
        >
            <div ref={textRef} className="flex flex-col items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-playfair">
                    DOMINCE
                </h1>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs font-mono opacity-50 uppercase tracking-widest">
                    Loading Portfolio... {Math.round(progress)}%
                </p>
            </div>
        </div>
    );
};

export default PreLoader;
