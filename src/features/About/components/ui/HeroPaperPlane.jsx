import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SHOW_PLANE_PATHS } from './planeDebugConfig';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

// ── EXIT CONFIG: How the plane flies OFF screen on scroll ────────────────────
// Add/remove waypoints freely — the path auto-visualizes when SHOW_PLANE_PATHS=true
const EXIT_CONFIG = {
    // Waypoints the plane exits through are now responsive and defined in PLANE_CONFIG
    exitScale: 0.05,
    exitOpacity: 0,

    // Scroll range settings
    scrollStart: 'top top',  // When to begin (try 'center top' to start later)
    scrollDistance: 600,        // px of scroll the exit lasts — increase for slower exit
    scrub: 1.5,

    // Rotation offset so the plane points forward (90 degrees for this SVG)
    autoRotate: 90,
};

// ── CONFIGURATION: EASILY ADJUST PLANE ANIMATION FOR EVERY SCREEN SIZE ──
const SHARED_CONFIG = {
    // Magic Feature: Automatically rotates the plane to point exactly where it's flying!
    autoRotate: true,
    rotationOffset: 90,

    // Global Timing
    delay: 1.5, // Wait for GlobalLoader to finish fading (500ms) + buffer
    durationPerPoint: 1, // Multiply this by the number of points to get total duration
    ease: "power2.inOut",
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
        exitPath: [
            { x: -500, y: 200 },
            { x: -2500, y: 500 },
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
        exitPath: [
            { x: -300, y: 150 },
            { x: -1500, y: 400 },
        ],
        finalScale: 0.4,
        finalOpacity: 1,
    },
    mobile: { // Screens smaller than 768px
        ...SHARED_CONFIG,
        initial: { x: -250, y: -500, xPercent: -50, yPercent: -50, scale: 0.05, opacity: 1, rotation: 45 },
        flightPath: [
            { x: 150, y: -120 },
            { x: 0, y: 300 },
            { x: -170, y: 0 },
        ],
        exitPath: [
            { x: 0, y: 100 },
            { x: -800, y: 900 },
        ],
        finalScale: 0.25,
        finalOpacity: 1,
    }
};

// Responsive plane body size per breakpoint (keeps the plane from being too
// large on smaller laptop/screens, matching the responsive navbar approach)
const PLANE_SIZES = {
    desktop: { width: 360, height: 315 },
    tablet: { width: 252, height: 221 },
    mobile: { width: 190, height: 166 },
};

export default function HeroPaperPlane({ style = {} }) {
    const planeRef = useRef(null);
    const debugPathRef = useRef(null);   // fly-in path ref
    const exitPathRef = useRef(null);   // exit path ref
    const exitTlRef = useRef(null);     // track the exit timeline to prevent duplicates

    // State to force re-render of debug points when matchMedia changes
    const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');

    useEffect(() => {
        if (!planeRef.current) return;

        let mm = gsap.matchMedia();

        const runAnimation = (config, breakpointName) => {
            setCurrentBreakpoint(breakpointName);

            // Clean up any existing exit animation to prevent duplicates
            if (exitTlRef.current) {
                exitTlRef.current.kill();
                exitTlRef.current = null;
            }

            // Set the starting position instantly
            gsap.set(planeRef.current, config.initial);

            // Draw fly-in debug path if enabled
            // (Handled separately in the debug useEffect below)

            // Animate along the curved path!
            // The exit ScrollTrigger is only created AFTER the fly-in completes,
            // so scrolling during entry has zero effect on the plane.
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
                ease: config.ease,
                onComplete: () => {
                    // ── SCROLL-BASED EXIT ANIMATION (only starts after fly-in is done) ──
                    if (!planeRef.current) return;
                    const heroSection = planeRef.current.closest('section') || planeRef.current.parentElement;

                    exitTlRef.current = gsap.timeline({
                        scrollTrigger: {
                            trigger: heroSection,
                            start: EXIT_CONFIG.scrollStart,
                            end: `+=${EXIT_CONFIG.scrollDistance}`,
                            scrub: EXIT_CONFIG.scrub,
                        }
                    }).to(planeRef.current, {
                        motionPath: {
                            path: config.exitPath,
                            curviness: 1.2,
                            autoRotate: EXIT_CONFIG.autoRotate,
                        },
                        scale: EXIT_CONFIG.exitScale,
                        opacity: EXIT_CONFIG.exitOpacity,
                        ease: 'power1.in',
                    });
                }
            });
        };

        const conditions = {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)"
        };

        mm.add(conditions, (context) => {
            const { isDesktop, isTablet } = context.conditions;

            let config = PLANE_CONFIG.mobile;
            let breakpointName = 'mobile';

            if (isDesktop) {
                config = PLANE_CONFIG.desktop;
                breakpointName = 'desktop';
            } else if (isTablet) {
                config = PLANE_CONFIG.tablet;
                breakpointName = 'tablet';
            }

            runAnimation(config, breakpointName);
        });

        return () => {
            mm.revert();
            if (exitTlRef.current) {
                exitTlRef.current.kill();
            }
        };
    }, []);

    // ── Debug path drawing — reacts to active breakpoint change ──
    useEffect(() => {
        if (!SHOW_PLANE_PATHS) return;

        const config = PLANE_CONFIG[currentBreakpoint];

        // Draw fly-in path
        if (debugPathRef.current && config) {
            try {
                const fullPath = [
                    { x: config.initial.x, y: config.initial.y },
                    ...config.flightPath
                ];
                const rawPath = MotionPathPlugin.arrayToRawPath(fullPath, { curviness: 1.5 });
                debugPathRef.current.setAttribute('d', MotionPathPlugin.rawPathToString(rawPath));
            } catch (e) { /* ignore */ }
        }

        // Draw exit path
        if (exitPathRef.current && config) {
            try {
                // Start from the final resting position of the fly-in path
                const lastFlyIn = config.flightPath[config.flightPath.length - 1];
                const fullExit = [{ x: lastFlyIn.x, y: lastFlyIn.y }, ...config.exitPath];
                const rawPath = MotionPathPlugin.arrayToRawPath(fullExit, { curviness: 1.2 });
                exitPathRef.current.setAttribute('d', MotionPathPlugin.rawPathToString(rawPath));
            } catch (e) { /* ignore */ }
        }
    }, [currentBreakpoint]);

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
                    width: `${PLANE_SIZES[currentBreakpoint].width}px`,
                    height: `${PLANE_SIZES[currentBreakpoint].height}px`,
                    pointerEvents: 'none',
                    zIndex: 5,
                    transformOrigin: '50% 50%',
                    willChange: 'transform',
                    ...style
                }}
            >
                {/* The Plane Body */}
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
                    <line x1="50%" y1="0%" x2="46%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    <line x1="50%" y1="0%" x2="57%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    <line x1="50%" y1="0%" x2="52%" y2="64%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>

            {/* ── DEBUG PATHS (shown when SHOW_PLANE_PATHS = true in planeDebugConfig.js) ── */}
            {SHOW_PLANE_PATHS && (
                <svg style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: '1px', height: '1px', overflow: 'visible',
                    pointerEvents: 'none', zIndex: 9999
                }}>
                    {/* Fly-in path (green) */}
                    <path ref={debugPathRef} fill="none" stroke="lime" strokeWidth="3" strokeDasharray="10,6" opacity="0.8" />
                    {/* Fly-in waypoints */}
                    <circle cx={activeConfig.initial.x} cy={activeConfig.initial.y} r="8" fill="lime" />
                    {activeConfig.flightPath.map((pt, i) => (
                        <circle key={`in-${i}`} cx={pt.x} cy={pt.y} r="8" fill="lime" />
                    ))}

                    {/* Exit path (orange) */}
                    <path ref={exitPathRef} fill="none" stroke="orange" strokeWidth="3" strokeDasharray="10,6" opacity="0.8" />
                    {/* Exit waypoints */}
                    {activeConfig.exitPath.map((pt, i) => (
                        <circle key={`ex-${i}`} cx={pt.x} cy={pt.y} r="8" fill="orange" />
                    ))}
                </svg>
            )}
        </>
    );
}
