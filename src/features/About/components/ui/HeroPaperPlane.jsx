import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

// ── CONFIGURATION: EASILY ADJUST PLANE ANIMATION FOR EVERY SCREEN SIZE ──
const SHARED_CONFIG = {
    // Magic Feature: Automatically rotates the plane to point exactly where it's flying!
    autoRotate: true,
    rotationOffset: 90,

    // Global Timing
    delay: 1.5, // Wait for GlobalLoader to finish fading (500ms) + buffer
    durationPerPoint: 1, // Multiply this by the number of points to get total duration
    ease: "power2.inOut",

    // Debugging
    // Set this to true to see the exact curved path the plane will take!
    showDebugPath: false,
};

export const PLANE_CONFIG = {
    desktop: { // Screens larger than 1024px
        ...SHARED_CONFIG,
        initial: { x: -2000, y: -500, xPercent: -50, yPercent: -50, scale: 0.1, opacity: 1, rotation: 45 },
        flightPath: [
            { x: -500, y: 0 },
            { x: -100, y: -100 },
            { x: 400, y: 500 },
            { x: 600, y: 0 },
            { x: 200, y: 100 },
            { x: -100, y: 500 },
            { x: -400, y: 100 },
        ],
        finalScale: 0.6,
        finalOpacity: 1,
    },
    tablet: { // Screens between 768px and 1023px
        ...SHARED_CONFIG,
        initial: { x: -1200, y: -400, xPercent: -50, yPercent: -50, scale: 0.1, opacity: 1, rotation: 45 },
        flightPath: [
            { x: 0, y: -100 },
            { x: 400, y: 200 },
            { x: 400, y: 400 },
            { x: 100, y: 300 },
            { x: -250, y: 0 },


        ],
        finalScale: 0.4, // Smaller plane
        finalOpacity: 1,
    },
    mobile: { // Screens smaller than 768px
        ...SHARED_CONFIG,
        initial: { x: -250, y: -500, xPercent: -50, yPercent: -50, scale: 0.05, opacity: 1, rotation: 45 },
        flightPath: [
            { x: 150, y: -120 },
            { x: 0, y: 300 },
            { x: -170, y: 0 },

            // Lands lower and more centered for mobile
        ],
        finalScale: 0.25, // Tiny plane
        finalOpacity: 1,
    }
};

export default function HeroPaperPlane({ style = {} }) {
    const planeRef = useRef(null);
    const debugPathRef = useRef(null);

    // State to force re-render of debug points when matchMedia changes
    const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');

    useEffect(() => {
        if (!planeRef.current) return;

        let mm = gsap.matchMedia();

        const runAnimation = (config, breakpointName) => {
            setCurrentBreakpoint(breakpointName);

            // Set the starting position instantly
            gsap.set(planeRef.current, config.initial);

            // If debugging is on, draw the exact path GSAP calculates
            if (config.showDebugPath && debugPathRef.current) {
                try {
                    const fullPath = [
                        { x: config.initial.x, y: config.initial.y },
                        ...config.flightPath
                    ];
                    const rawPath = MotionPathPlugin.arrayToRawPath(fullPath, { curviness: 1.5 });
                    const pathStr = MotionPathPlugin.rawPathToString(rawPath);
                    debugPathRef.current.setAttribute('d', pathStr);
                } catch (e) {
                    console.error("Could not draw debug path:", e);
                }
            }

            // Animate along the curved path!
            gsap.to(planeRef.current, {
                motionPath: {
                    path: config.flightPath,
                    curviness: 1.5,
                    autoRotate: config.autoRotate ? config.rotationOffset : false,
                },
                scale: config.finalScale,
                opacity: config.finalOpacity,
                duration: config.flightPath.length * config.durationPerPoint,
                delay: config.delay,
                ease: config.ease
            });
        };

        mm.add("(min-width: 1024px)", () => runAnimation(PLANE_CONFIG.desktop, 'desktop'));
        mm.add("(min-width: 768px) and (max-width: 1023px)", () => runAnimation(PLANE_CONFIG.tablet, 'tablet'));
        mm.add("(max-width: 767px)", () => runAnimation(PLANE_CONFIG.mobile, 'mobile'));

        return () => mm.revert(); // Automatically cleans up all animations and triggers on resize!
    }, []);

    // Get the active config for drawing debug dots
    const activeConfig = PLANE_CONFIG[currentBreakpoint];

    return (
        <>
            <div
                ref={planeRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '400px',
                    height: '350px',
                    pointerEvents: 'none',
                    zIndex: 5,
                    // Center the transform origin for predictable rotation and scaling
                    transformOrigin: '50% 50%',
                    ...style
                }}
            >
                {/* The Plane Body (Terminal Shape folded via clipPath) */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0d1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    clipPath: 'polygon(50% 0%, 81% 29%, 90% 48%, 57% 49%, 52% 64%, 46% 49%, 14% 49%, 21% 29%)',
                }}>
                    {/* Scanline Overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
                        backgroundSize: '100% 2px',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }} />
                </div>

                {/* Paper Plane Creases */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
                    {/* Left wing crease */}
                    <line x1="50%" y1="0%" x2="46%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    {/* Right wing crease */}
                    <line x1="50%" y1="0%" x2="57%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    {/* Center fold down to the tail */}
                    <line x1="50%" y1="0%" x2="52%" y2="64%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>

            {/* DEBUG PATH LINE (Moved OUTSIDE the plane so it doesn't move with it) */}
            {activeConfig.showDebugPath && (
                <svg
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '1px',
                        height: '1px',
                        overflow: 'visible',
                        pointerEvents: 'none',
                        zIndex: 9999
                    }}
                >
                    <path
                        ref={debugPathRef}
                        fill="none"
                        stroke="red"
                        strokeWidth="4"
                        strokeDasharray="10, 10"
                        opacity="0.8"
                    />

                    {/* Draw points as blue dots */}
                    <circle cx={activeConfig.initial.x} cy={activeConfig.initial.y} r="8" fill="blue" />
                    {activeConfig.flightPath.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="8" fill="blue" />
                    ))}
                </svg>
            )}
        </>
    );
}
