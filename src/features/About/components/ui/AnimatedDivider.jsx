import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CatLineAbout from './CatLineAbout';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedDivider({
    style,
    className,
    scrollStart = 'top 75%',
    scrollEnd = 'bottom 20%',
    scrub = 1.5,
    maskMaxSize = 180,
    tailFadeStart = 45,
    headThickness = 5
}) {
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        // Select all the individual stroke paths
        const maskPaths = svgRef.current.querySelectorAll('.cat-line-path');
        if (!maskPaths || maskPaths.length === 0) return;

        const isMobileOrTablet = window.innerWidth <= 1024;

        const triggerConfig = isMobileOrTablet ? {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
        } : {
            trigger: containerRef.current,
            start: 'top 60%', // Starts much later (near the middle of the screen) so you see the first stroke!
            end: 'top 10%',   // Ends near the top
            scrub: scrub,
        };

        // Set initial state for each path based on its actual length
        gsap.set(maskPaths, {
            strokeDasharray: (i, el) => el.getTotalLength(),
            strokeDashoffset: (i, el) => el.getTotalLength()
        });

        const tl = gsap.timeline({
            scrollTrigger: triggerConfig
        });

        const maskPathsArr = Array.from(maskPaths);
        const totalLen = maskPathsArr.reduce((sum, path) => sum + path.getTotalLength(), 0);

        // Draw the paths sequentially, with duration proportional to their true length
        maskPathsArr.forEach((path) => {
            const len = path.getTotalLength();
            tl.to(path, {
                strokeDashoffset: 0,
                duration: isMobileOrTablet ? (len / totalLen) * 3.5 : len,
                ease: isMobileOrTablet ? 'power1.inOut' : 'none',
            });
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [scrollStart, scrollEnd, scrub]);

    return (
        <div ref={containerRef} className={className} style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '4rem 0', overflow: 'hidden', ...style }}>
            <CatLineAbout
                className="ns-animated-divider"
                ref={svgRef}
                style={{
                    display: 'block',
                    width: "100%",
                    maxWidth: "100vw",
                    height: "auto",
                    opacity: 1,
                    pointerEvents: "none",
                    color: "var(--ns-body-color, #1a1a1a)"
                }}
                preserveAspectRatio="xMidYMid meet"
            />
        </div>
    );
}
