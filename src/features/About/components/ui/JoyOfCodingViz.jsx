import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

import { SHOW_PLANE_PATHS } from './planeDebugConfig';

// ─── Paper Folding clip-path Stages ────────────────────────────────────────
export const FOLD_STAGES = [
    'polygon(30% 0%, 70% 0%, 100% 0%, 100% 100%, 70% 100%, 30% 100%, 0% 100%, 0% 0%)',
    'polygon(30% 0%, 93% 12%, 76% 35%, 100% 100%, 70% 100%, 24% 75%, 0% 98%, 0% 0%)',
    'polygon(30% 0%, 93% 12%, 76% 35%, 62% 93%, 96% 50%, 24% 75%, 0% 98%, 16% 42%)',
    'polygon(50% 0%, 91% 32%, 70% 43%, 62% 93%, 96% 50%, 4% 48%, 37% 88%, 16% 33%)',
    'polygon(50% 0%, 91% 32%, 91% 51%, 41% 43%, 93% 81%, 65% 49%, 23% 55%, 16% 33%)',
    'polygon(50% 0%, 91% 32%, 91% 51%, 69% 51%, 53% 24%, 41% 52%, 23% 55%, 16% 33%)',
    'polygon(49% 0%, 79% 29%, 79% 72%, 52% 65%, 50% 20%, 50% 64%, 24% 73%, 23% 30%)',
    'polygon(50% 0%, 81% 29%, 90% 48%, 57% 49%, 52% 64%, 46% 49%, 14% 49%, 21% 29%)'
];

export const TerminalPlane = React.forwardRef(({ codeLinesRef, planeLinesRef, codeSnippet, style, clipPath }, ref) => (
    <div
        ref={ref}
        style={{
            width: '90%', height: '85%',
            backgroundColor: '#0d1117',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#c9d1d9',
            display: 'flex',
            flexDirection: 'column',
            clipPath: clipPath || FOLD_STAGES[0],
            transformOrigin: '50% 50%',
            willChange: 'clip-path, transform',
            pointerEvents: 'auto',
            ...style
        }}
    >
        {/* Terminal Header */}
        <div style={{
            height: '36px', backgroundColor: '#161b22',
            display: 'flex', alignItems: 'center',
            padding: '0 15px', gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0,
        }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#8b949e' }}>sys_resolver.js</div>
        </div>
        {/* Code Body */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden', padding: '20px' }}>
            <div ref={codeLinesRef} style={{ position: 'absolute', top: 0, left: '20px', right: '20px' }}>
                {[...codeSnippet, ...codeSnippet, ...codeSnippet].map((line, i) => {
                    const isError = line.includes('FAIL') || line.includes('throw') || line.includes('error');
                    const isSuccess = line.includes('SUCCESS');
                    return (
                        <div key={i} style={{
                            lineHeight: '1.6', whiteSpace: 'pre',
                            color: isError ? '#ff7b72' : isSuccess ? '#baff29' : '#c9d1d9',
                        }}>
                            <span style={{ color: '#6e7681', marginRight: '15px', userSelect: 'none' }}>{i + 1}</span>
                            {line}
                        </div>
                    );
                })}
            </div>
        </div>
        {/* Scanline Overlay */}
        <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
            backgroundSize: '100% 2px',
            pointerEvents: 'none',
            zIndex: 10,
        }} />

        {/* PAPER PLANE CREASES */}
        <svg
            ref={planeLinesRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0, zIndex: 100 }}
        >
            <line x1="50%" y1="0%" x2="46%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
            <line x1="50%" y1="0%" x2="57%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
            <line x1="50%" y1="0%" x2="52%" y2="64%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
        </svg>
    </div>
));

export default function JoyOfCodingViz({ scrollTriggerRef, scrollStart, scrollEnd }) {
    const containerRef = useRef(null);
    const terminalRef = useRef(null);
    const codeLinesRef = useRef(null);
    const planeLinesRef = useRef(null);
    const pathSvgRef = useRef(null);
    const [flightPathStr, setFlightPathStr] = useState(null);

    const codeSnippet = `
function resolveDependency(graph, node) {
  if (node.visited) return SUCCESS;
  try {
    const edges = graph.getEdges(node);
    for (let i=0; i<edges.length; i++) {
       if (!resolveDependency(graph, edges[i])) {
          throw new Error("Cyclic dependency detected");
       }
    }
  } catch (e) {
    // FAIL: Retry logic initiated
    console.error(e.message);
    return FAIL;
  }
  return SUCCESS;
}`.trim().split('\n');

    useEffect(() => {
        let ctx = gsap.context(() => {
            if (!containerRef.current || !terminalRef.current || !planeLinesRef.current || !codeLinesRef.current) return;

            // Clean up duplicates
            const triggers = ScrollTrigger.getAll().filter(t => t.vars.id === 'terminalTimeline');
            triggers.forEach(t => t.kill());

            const sectionEl = scrollTriggerRef?.current?.closest('.ns-scrollytelling-row') || scrollTriggerRef?.current || containerRef.current;

            // ── SCROLL PLANE CONFIG ──
            const SCROLL_PLANE_CONFIG = {
                initial: { x: 900, y: -500, scale: 0.15, rotation: 45 },
                flightPath: [
                    { x: 400, y: -300 },
                    { x: -200, y: 100 },
                    { x: 0, y: 0 },
                ],
                scrollPerPoint: 80,
                scrollForMorph: 120, // Wait, morphing 7 stages takes more time, let's use 150
            };

            const numPoints = SCROLL_PLANE_CONFIG.flightPath.length;
            const pinDistance = (numPoints * SCROLL_PLANE_CONFIG.scrollPerPoint) + 150;

            const fullPath = [
                { x: SCROLL_PLANE_CONFIG.initial.x, y: SCROLL_PLANE_CONFIG.initial.y },
                ...SCROLL_PLANE_CONFIG.flightPath
            ];
            const rawPath = MotionPathPlugin.arrayToRawPath(fullPath, { curviness: 1.5 });
            setFlightPathStr(MotionPathPlugin.rawPathToString(rawPath));

            // 1. Initial State
            gsap.set(terminalRef.current, {
                clipPath: FOLD_STAGES[7],
                scale: SCROLL_PLANE_CONFIG.initial.scale,
                x: SCROLL_PLANE_CONFIG.initial.x,
                y: SCROLL_PLANE_CONFIG.initial.y,
                rotation: SCROLL_PLANE_CONFIG.initial.rotation,
                // Removed opacity: 0 so it exists in the DOM immediately (it's off-screen anyway)
            });
            gsap.set(planeLinesRef.current, { opacity: 1 });
            gsap.set(codeLinesRef.current, { opacity: 0 });

            // 2. Main Pinned Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'terminalTimeline',
                    trigger: sectionEl,
                    start: "top top",
                    end: `+=${pinDistance}%`,
                    pin: true,
                    scrub: 1.5,
                    anticipatePin: 1,
                }
            });

            // Phase 1: Fly in
            tl.to(terminalRef.current, {
                motionPath: {
                    path: SCROLL_PLANE_CONFIG.flightPath,
                    curviness: 1.5,
                    autoRotate: 90
                },
                ease: 'power2.out',
                duration: numPoints, // 3 units of time
            }, 0);

            // Phase 2: Morph and Scale
            // Scale up to full size smoothly and straighten out the landing angle
            tl.to(terminalRef.current, {
                scale: 1,
                rotation: 0, // Smoothly rotate to upright (0) while unfolding
                duration: 7, // Match the 7 clip-path stages
                ease: "power2.out"
            }, ">");

            // Sequence through the reversed fold stages to "unfold"
            const reversedFolds = [...FOLD_STAGES].reverse();
            reversedFolds.slice(1).forEach((stage, index) => {
                // The first stage starts at the same time as the scale, the rest follow sequentially
                const position = index === 0 ? "<" : ">";
                tl.to(terminalRef.current, {
                    clipPath: stage,
                    duration: 1,
                    ease: "none"
                }, position);
            });

            // Fade out creases as it unfolds (starts at the same time as Phase 2)
            tl.to(planeLinesRef.current, {
                opacity: 0,
                duration: 3
            }, "-=7"); // 7 seconds before the end of the timeline (which is when Phase 2 starts)

            // Fade in code once unfolded
            tl.to(codeLinesRef.current, {
                opacity: 1,
                duration: 2
            }, "-=2"); // Start 2 seconds before the end of the timeline
            
        }, containerRef);

        return () => ctx.revert();
    }, [scrollTriggerRef]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                perspective: '1200px',
                perspectiveOrigin: '50% 50%',
            }}
        >
            {/* ── CONNECTION PATH SVG ── */}
            {(SHOW_PLANE_PATHS && flightPathStr) && (
                <svg
                    ref={pathSvgRef}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 1,
                        height: 1,
                        overflow: 'visible',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                >
                    <path
                        d={flightPathStr}
                        fill="none"
                        stroke="#e800ff"
                        strokeWidth="2"
                        strokeDasharray="5, 5"
                        opacity={0.5}
                    />
                </svg>
            )}

            {/* ── Terminal (folds and disappears) ── */}
            <TerminalPlane 
                ref={terminalRef} 
                codeLinesRef={codeLinesRef} 
                planeLinesRef={planeLinesRef} 
                codeSnippet={codeSnippet} 
            />
        </div>
    );
}
