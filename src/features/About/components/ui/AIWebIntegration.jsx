import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AIWebIntegration({ className = '', style = {} }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    once: true
                }
            });

            // 1. Draw connecting lines flowing into the web app
            tl.fromTo('.ns-web-line', 
                { strokeDashoffset: 350, strokeDasharray: 350 },
                { strokeDashoffset: 0, duration: 1.5, ease: 'power3.out', stagger: 0.1 }
            );

            // 2. Flowing AI data packets shooting into the center
            gsap.fromTo('.ns-web-packet',
                { strokeDashoffset: 350 },
                {
                    strokeDashoffset: 0,
                    duration: 1.8,
                    repeat: -1,
                    ease: 'none',
                    opacity: 1,
                    stagger: { amount: 2, from: "random" }
                }
            );

            // 3. Central Web App pulsates with AI energy
            gsap.to('.ns-web-core', {
                boxShadow: '0 0 40px rgba(195, 255, 54, 0.15)',
                borderColor: 'rgba(195, 255, 54, 0.5)',
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Lines connecting outer nodes to the central web app (multiple ports)
    const lines = [
        // Left side nodes
        { id: 1, x1: 50, y1: 50, x2: 300, y2: 110 },
        { id: 2, x1: 20, y1: 150, x2: 300, y2: 150 },
        { id: 3, x1: 50, y1: 250, x2: 300, y2: 190 },
        // Right side nodes
        { id: 4, x1: 750, y1: 50, x2: 500, y2: 110 },
        { id: 5, x1: 780, y1: 150, x2: 500, y2: 150 },
        { id: 6, x1: 750, y1: 250, x2: 500, y2: 190 },
    ];

    return (
        <div ref={containerRef} className={`ns-ai-web-integration ${className}`} style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%', 
            margin: '4rem 0',
            position: 'relative',
            height: '300px',
            ...style 
        }}>
            
            {/* SVG Network Lines */}
            <svg width="800" height="300" viewBox="0 0 800 300" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1, overflow: 'visible' }}>
                
                {/* Base Connection Lines */}
                {lines.map(line => (
                    <path 
                        key={line.id} 
                        className="ns-web-line"
                        d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        fill="none" 
                        opacity="0.25" 
                    />
                ))}

                {/* Flowing Data Packets (Thick Electric Lines) */}
                {lines.map(line => (
                    <path 
                        key={`packet_${line.id}`} 
                        className="ns-web-packet"
                        d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} 
                        stroke="#8b5cf6" 
                        strokeWidth="3.5" 
                        fill="none" 
                        opacity="0" 
                        strokeDasharray="20 200"
                    />
                ))}

                {/* Outer Origin Nodes */}
                {lines.map(line => (
                    <g key={`node_${line.id}`}>
                        <circle 
                            cx={line.x1}
                            cy={line.y1}
                            r="6"
                            fill="currentColor"
                        />
                        <circle 
                            cx={line.x1}
                            cy={line.y1}
                            r="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            opacity="0.2"
                        />
                    </g>
                ))}
            </svg>

            {/* Central Web App Representation */}
            <div className="ns-web-core" style={{
                position: 'relative',
                zIndex: 2,
                width: '200px',
                height: '120px',
                backgroundColor: 'var(--background)',
                border: '2px solid currentColor',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Browser Header / Toolbar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.2 }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.2 }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', opacity: 0.2 }} />
                    </div>
                </div>

                {/* UI Content Area */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'currentColor', opacity: 0.6, letterSpacing: '3px' }}>
                        WEB APP
                    </div>
                    {/* Simulated loading bar / AI processing */}
                    <div style={{ display: 'flex', gap: '4px', width: '60%' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: 'var(--accent)', opacity: 0.8 }} />
                        <div style={{ width: '15px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--accent)', opacity: 0.3 }} />
                    </div>
                </div>
            </div>

        </div>
    );
}
