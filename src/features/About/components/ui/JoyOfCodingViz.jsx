import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TerminalPlane = React.forwardRef(({ codeLinesRef, codeSnippet, style }, ref) => (
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
            transformOrigin: '50% 50%',
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
    </div>
));

export default function JoyOfCodingViz({ scrollTriggerRef, scrollStart, scrollEnd }) {
    const containerRef = useRef(null);
    const terminalRef = useRef(null);
    const codeLinesRef = useRef(null);

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
            if (!containerRef.current || !terminalRef.current || !codeLinesRef.current) return;

            // Clean up duplicates
            const triggers = ScrollTrigger.getAll().filter(t => t.vars.id === 'terminalTimeline');
            triggers.forEach(t => t.kill());

            const sectionEl = scrollTriggerRef?.current?.closest('.ns-scrollytelling-row') || scrollTriggerRef?.current || containerRef.current;

            // Initial State
            gsap.set(terminalRef.current, { scale: 0.9, opacity: 0 });
            gsap.set(codeLinesRef.current, { opacity: 0, y: 20 });

            // Main Pinned Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'terminalTimeline',
                    trigger: sectionEl,
                    start: scrollStart || "top top",
                    end: scrollEnd || "+=150%",
                    pin: true,
                    scrub: 1.5,
                    anticipatePin: 1,
                }
            });

            // Fade in and scale up terminal
            tl.to(terminalRef.current, {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            }, 0);

            // Fade in code
            tl.to(codeLinesRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power2.out'
            }, 0.5);

            // Keep it visible for the rest of the scroll
            tl.to({}, { duration: 1 });
            
        }, containerRef);

        return () => ctx.revert();
    }, [scrollTriggerRef, scrollStart, scrollEnd]);

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
            <TerminalPlane 
                ref={terminalRef} 
                codeLinesRef={codeLinesRef} 
                codeSnippet={codeSnippet} 
            />
        </div>
    );
}
