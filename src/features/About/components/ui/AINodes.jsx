import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AINodes({ className = '', style = {} }) {
    const containerRef = useRef(null);

    // Deterministically generate the complex neural network
    const network = useMemo(() => {
        const nodes = [];
        const lines = [];
        const xPositions = [150, 320, 480, 650];
        const colCounts = [4, 8, 8, 4];
        
        const leftLabels = ['RAW DATA', 'USER INPUT', 'EXTERNAL APIS', 'SENSORS'];
        const rightLabels = ['PREDICTIONS', 'AUTOMATION', 'ANALYTICS', 'UI INSIGHTS'];
        
        colCounts.forEach((count, colIndex) => {
            const ySpacing = 360 / (count + 1);
            for (let i = 0; i < count; i++) {
                // Add an organic curve to the layers
                const centerDist = Math.abs((count / 2) - i - 0.5);
                const xOffset = centerDist * 10 * (colIndex < 2 ? 1 : -1);
                
                let label = '';
                if (colIndex === 0) label = leftLabels[i];
                if (colIndex === 3) label = rightLabels[i];
                
                nodes.push({
                    id: `n_${colIndex}_${i}`,
                    col: colIndex,
                    x: xPositions[colIndex] + xOffset,
                    y: 20 + ySpacing * (i + 1),
                    r: count === 4 ? 6 : 4, // Outer layers have slightly larger nodes
                    label
                });
            }
        });

        // Connect adjacent layers
        nodes.forEach(n1 => {
            nodes.forEach(n2 => {
                if (n2.col === n1.col + 1) {
                    lines.push({
                        id: `l_${n1.id}_${n2.id}`,
                        x1: n1.x,
                        y1: n1.y,
                        x2: n2.x,
                        y2: n2.y
                    });
                }
            });
        });

        // Generate ambient background bubbles
        const bubbles = Array.from({ length: 25 }).map((_, i) => {
            // Deterministic pseudo-randomness for stable SSR
            const rand1 = (i * 13) % 100;
            const rand2 = (i * 27) % 100;
            const rand3 = (i * 7) % 100;
            return {
                id: `b_${i}`,
                x: rand1,
                y: rand2,
                size: 2 + (rand3 % 6),
                delay: (rand1 % 10) * 0.5,
                duration: 4 + (rand2 % 5)
            };
        });

        return { nodes, lines, bubbles };
    }, []);

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });

            // 1. Lines rapidly draw themselves (massive stagger)
            tl.fromTo('.ns-ai-line', 
                { strokeDashoffset: 500, strokeDasharray: 500 },
                { 
                    strokeDashoffset: 0, 
                    duration: 1.5, 
                    ease: 'power3.inOut', 
                    stagger: { amount: 1.5, from: "start" } 
                }
            );

            // 2. Data packets flowing through the network
            // We use a continuous linear animation on the offset so it loops perfectly.
            tl.fromTo('.ns-ai-packet',
                { strokeDashoffset: 400 },
                {
                    strokeDashoffset: 0,
                    duration: 3,
                    repeat: -1,
                    ease: 'none',
                    opacity: 1 // Fades in when it triggers
                }, "-=1.0"
            );

            // 3. Ambient Bubbles Float continuously
            gsap.to('.ns-ai-bubble', {
                y: '-=40',
                x: '+=20',
                opacity: 0,
                duration: (i, el) => parseFloat(el.dataset.dur),
                repeat: -1,
                yoyo: false,
                ease: 'none',
                stagger: (i, el) => parseFloat(el.dataset.delay)
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`ns-ai-nodes-container ${className}`} style={{ 
            position: 'relative',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%', 
            margin: 'clamp(0.5rem, 5vw, 6rem) 0',
            ...style 
        }}>
            
            {/* Ambient Floating Bubbles */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
                {network.bubbles.map(b => (
                    <div 
                        key={b.id} 
                        className="ns-ai-bubble"
                        data-dur={b.duration}
                        data-delay={b.delay}
                        style={{
                            position: 'absolute',
                            left: `${b.x}%`,
                            top: `${b.y + 20}%`, // Start slightly lower so they can drift up
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            borderRadius: '50%',
                            backgroundColor: 'currentColor',
                            opacity: 0.1,
                            filter: 'blur(1px)'
                        }} 
                    />
                ))}
            </div>

            {/* Neural Network SVG */}
            <svg width="100%" viewBox="0 0 800 400" style={{ maxWidth: '800px', height: 'auto', overflow: 'visible', position: 'relative', zIndex: 2 }}>
                
                {/* 1. Base Connections */}
                {network.lines.map(line => (
                    <path 
                        key={line.id} 
                        className="ns-ai-line"
                        d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} 
                        stroke="currentColor" 
                        strokeWidth="1.2" 
                        fill="none" 
                        opacity="0.25" 
                    />
                ))}

                {/* 2. Flowing Data Packets */}
                {network.lines.map((line, i) => {
                    // Only animate packets on ~40% of the lines to keep it performant and elegant
                    if (i % 2 === 0) return null;
                    return (
                        <path 
                            key={`packet_${line.id}`} 
                            className="ns-ai-packet"
                            d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} 
                            stroke="#8b5cf6" 
                            strokeWidth="2.5" 
                            fill="none" 
                            opacity="0" 
                            strokeDasharray="12 200"
                        />
                    );
                })}

                {/* 3. Neural Nodes */}
                {network.nodes.map(node => (
                    <circle 
                        key={node.id}
                        className="ns-ai-node"
                        cx={node.x} 
                        cy={node.y} 
                        r={node.r} 
                        fill="currentColor" 
                    />
                ))}
                
                {/* 4. Ambient Layer Halos (Outer Rings for aesthetics) */}
                {network.nodes.map(node => (
                    // Only add rings to outer layer nodes
                    (node.col === 0 || node.col === 3) && (
                        <circle 
                            key={`halo_${node.id}`}
                            className="ns-ai-node"
                            cx={node.x} 
                            cy={node.y} 
                            r={node.r + 8} 
                            fill="none" 
                            stroke="currentColor"
                            strokeWidth="0.5"
                            opacity="0.2"
                        />
                    )
                ))}

                {/* 5. Outer Node Labels */}
                {network.nodes.map(node => {
                    if (!node.label) return null;
                    const isLeft = node.col === 0;
                    return (
                        <text
                            key={`label_${node.id}`}
                            x={isLeft ? node.x - 24 : node.x + 24}
                            y={node.y + 3}
                            textAnchor={isLeft ? "end" : "start"}
                            fill="currentColor"
                            fontSize="9"
                            fontWeight="700"
                            opacity="0.65"
                            letterSpacing="1.5px"
                        >
                            {node.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
