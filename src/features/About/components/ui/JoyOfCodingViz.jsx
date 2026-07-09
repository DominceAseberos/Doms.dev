import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function JoyOfCodingViz() {
    const containerRef = useRef(null);
    const codeLinesRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !codeLinesRef.current) return;

        // Animate the container appearing
        gsap.fromTo(containerRef.current, 
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Frantic code scrolling animation
        const ctx = gsap.context(() => {
            gsap.to(codeLinesRef.current, {
                y: '-50%',
                duration: 4,
                ease: 'none',
                repeat: -1
            });
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
}
    `.trim().split('\n');

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '80%', height: '300px', backgroundColor: '#0d1117', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontFamily: 'monospace', fontSize: '13px', color: '#c9d1d9'
            }}>
                {/* Terminal Header */}
                <div style={{ height: '30px', backgroundColor: '#161b22', display: 'flex', alignItems: 'center', padding: '0 15px', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                    <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#8b949e' }}>sys_resolver.js</div>
                </div>

                {/* Code Body */}
                <div style={{ position: 'relative', height: '270px', overflow: 'hidden', padding: '15px' }}>
                    <div ref={codeLinesRef} style={{ position: 'absolute', top: 0, left: '15px', right: '15px' }}>
                        {/* Repeat snippet twice for seamless loop */}
                        {[...codeSnippet, ...codeSnippet, ...codeSnippet].map((line, i) => {
                            const isError = line.includes('FAIL') || line.includes('throw') || line.includes('error');
                            const isSuccess = line.includes('SUCCESS');
                            return (
                                <div key={i} style={{ 
                                    lineHeight: '1.5', whiteSpace: 'pre',
                                    color: isError ? '#ff7b72' : isSuccess ? '#baff29' : '#c9d1d9',
                                    opacity: Math.random() > 0.8 ? 0.7 : 1 // slight flickering
                                }}>
                                    <span style={{ color: '#6e7681', marginRight: '15px', userSelect: 'none' }}>{i + 1}</span>
                                    {line}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Glitch Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%', pointerEvents: 'none', zIndex: 10
                }} />
            </div>
        </div>
    );
}
