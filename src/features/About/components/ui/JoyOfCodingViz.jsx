import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import PlaneSprayEffect from './PlaneSprayEffect';

// No image imports needed! We use pure CSS clip-path for the plane.

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ── PLANE FLIGHT CONFIG ── Edit these freely! ──
export const PLANE_FLIGHT = {
    keyframes: [
        { x: 0, y: 0, scale: 1, rotateZ: -25, duration: 0.1 }, // til right
        { x: -350, y: 0, scale: 0.8, rotateZ: -25, duration: 0.3 }, // Bank right + climb
        { x: -350, y: 0, scale: 0.8, rotateZ: 0, duration: 0.3 }, // Bank right + climb
        { x: -350, y: -150, scale: 0.2, rotateZ: 55, duration: 0.3 },
        { x: -350, y: -200, scale: 0.2, rotateZ: 80, duration: 0.4 },
        { x: 1050, y: -200, scale: 0.2, rotateZ: 80, duration: 0.6 },
        // Fly into distance
    ]
};

// Generate a perfectly smooth curved path using the Midpoint Quadratic Bezier trick
const generateSmoothPath = (keyframes) => {
    const pts = [{ x: 0, y: 0 }, ...keyframes];
    let d = `M ${pts[0].x},${pts[0].y} `;
    for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        d += `Q ${pts[i].x},${pts[i].y} ${xc},${yc} `;
    }
    d += `L ${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;
    return d;
};

const FLIGHT_PATH_DATA = generateSmoothPath(PLANE_FLIGHT.keyframes);

// ─── Paper Folding clip-path Stages ────────────────────────────────────────
// Using the 8-point polygons from the user!
const FOLD_STAGES = [
    'polygon(30% 0%, 70% 0%, 100% 0%, 100% 100%, 70% 100%, 30% 100%, 0% 100%, 0% 0%)',
    'polygon(30% 0%, 93% 12%, 76% 35%, 100% 100%, 70% 100%, 24% 75%, 0% 98%, 0% 0%)',
    'polygon(30% 0%, 93% 12%, 76% 35%, 62% 93%, 96% 50%, 24% 75%, 0% 98%, 16% 42%)',
    'polygon(50% 0%, 91% 32%, 70% 43%, 62% 93%, 96% 50%, 4% 48%, 37% 88%, 16% 33%)',
    'polygon(50% 0%, 91% 32%, 91% 51%, 41% 43%, 93% 81%, 65% 49%, 23% 55%, 16% 33%)',
    'polygon(50% 0%, 91% 32%, 91% 51%, 69% 51%, 53% 24%, 41% 52%, 23% 55%, 16% 33%)',
    'polygon(49% 0%, 79% 29%, 79% 72%, 52% 65%, 50% 20%, 50% 64%, 24% 73%, 23% 30%)',
    'polygon(50% 0%, 81% 29%, 90% 48%, 57% 49%, 52% 64%, 46% 49%, 14% 49%, 21% 29%)'
];

export default function JoyOfCodingViz() {
    const containerRef = useRef(null);
    const terminalRef = useRef(null);
    const codeLinesRef = useRef(null);
    const planeLinesRef = useRef(null);

    // Animations stripped for layout extraction

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

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                perspective: '1200px',
                perspectiveOrigin: '50% 50%',
                position: 'relative',
                pointerEvents: 'none', // Let user click things underneath
                zIndex: 5,
            }}
        >
            {/* ── LIQUID SPRAY TRAIL ── */}
            <PlaneSprayEffect planeRef={terminalRef} active={true} />

            {/* ── Terminal (folds and disappears) ── */}
            <div
                ref={terminalRef}
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
                    clipPath: FOLD_STAGES[0],
                    transformOrigin: '50% 50%',
                    willChange: 'clip-path, transform',
                    pointerEvents: 'auto', // Re-enable pointer events for the terminal itself
                }}
            >
                {/* --- 3D Terminal / Paper Plane --- */}
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

                {/* ── PAPER PLANE CREASES (Fades in after fold) ── */}
                <svg
                    ref={planeLinesRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0, zIndex: 100 }}
                >
                    {/* Left wing crease */}
                    <line x1="50%" y1="0%" x2="46%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    {/* Right wing crease */}
                    <line x1="50%" y1="0%" x2="57%" y2="49%" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    {/* Center fold down to the tail */}
                    <line x1="50%" y1="0%" x2="52%" y2="64%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
}
