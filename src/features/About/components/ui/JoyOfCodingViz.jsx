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

    useEffect(() => {
        if (!containerRef.current || !terminalRef.current || !codeLinesRef.current) return;

        const ctx = gsap.context(() => {
            // ── Master Timeline: scroll-scrubbed through the full sequence ──
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    pinnedContainer: containerRef.current.closest('.ns-scrollytelling-row'),
                    start: 'top 85%',
                    end: '+=4000px', // Matches the extended row pin duration
                    scrub: 1.5,
                }
            });

            // DECOUPLED: infinite code scroll — stored so folding can pause it
            const codeTween = gsap.to(codeLinesRef.current, {
                y: '-50%',
                duration: 4,
                ease: 'none',
                repeat: -1,
            });

            // Step A: 3D unfold into view from twisted starting position
            tl.fromTo(terminalRef.current,
                {
                    opacity: 0,
                    rotateX: -55,
                    rotateY: 40,
                    rotateZ: -12,
                    z: -600,
                    y: 180,
                    scale: 0.45,
                    clipPath: FOLD_STAGES[0],
                },
                {
                    opacity: 1,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    z: 0,
                    y: 0,
                    scale: 1,
                    clipPath: FOLD_STAGES[0],
                    ease: 'power2.out',
                    duration: 1,
                }
            );

            // Step B: Pause — let user read the code (code scroll is running)
            // Increased to 5.0 so there is a long delay before it starts morphing, 
            // ensuring it is safely in the center of the screen before the fold begins.
            tl.to(terminalRef.current, { duration: 5.0 });

            // Step C: Step-by-step paper folding
            // Fade out the code text inside the terminal immediately as it starts folding
            tl.to(codeLinesRef.current, { opacity: 0, duration: 0.4 }, "foldStart");

            FOLD_STAGES.slice(1).forEach((stage, i) => {
                tl.to(
                    terminalRef.current,
                    {
                        clipPath: stage,
                        ease: 'power2.inOut',
                        duration: 0.2, // Quick snappy folds
                        // On the very FIRST fold step, pause the code scroll
                        onStart: i === 0 ? () => codeTween.pause() : undefined,
                        // If user scrolls BACK past this point, resume it
                        onReverseComplete: i === 0 ? () => codeTween.resume() : undefined,
                    },
                    `foldStart+=${i * 0.2}`
                );
            });

            // Instantly after the last fold locks into place, fade in the 3D paper crease lines!
            tl.to(planeLinesRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power1.inOut'
            });

            // Step E: Fade out the old text, and fade in the 3D text wall!
            const row = containerRef.current.closest('.ns-scrollytelling-row');
            if (row) {
                const part1 = row.querySelector('.part-1-text');
                const part2 = row.querySelector('.part-2-text');

                tl.to(part1, {
                    y: '-=150',      // Move it up 150px
                    opacity: 0,      // Fade it out
                    duration: 1.2,
                    ease: 'power2.inOut',
                }, "<0.2");
            }

            tl.add("hoverStart");

            tl.to(terminalRef.current, {
                motionPath: {
                    path: FLIGHT_PATH_DATA,
                    alignOrigin: [0.5, 0.5]
                },
                duration: 20,
                ease: 'sine.inOut',
                onUpdate: function() {
                    if (terminalRef.current) {
                        terminalRef.current.dataset.progress = this.progress();
                    }
                }
            }, 'hoverStart');

            // Scale / rotation keyframes run in parallel
            tl.to(terminalRef.current, {
                keyframes: PLANE_FLIGHT.keyframes.map(k => ({ scale: k.scale, rotateZ: k.rotateZ, duration: k.duration })),
                duration: 20,
                ease: 'sine.inOut',
            }, 'hoverStart');

        }, containerRef);

        return () => ctx.revert();
    }, []);

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
