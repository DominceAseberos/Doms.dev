import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, User, Globe, Radio, Sparkles, Bot, LineChart, Layout } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AINodes({ className = '', style = {} }) {
    const containerRef = useRef(null);

    // Deterministically generate the complex neural network coordinates
    const network = useMemo(() => {
        const nodes = [];
        const lines = [];
        const xPositions = [150, 320, 480, 650]; // 4 distinct layers
        const colCounts = [4, 8, 8, 4];
        
        const leftLabels = [
            { label: 'RAW DATA', Icon: Database },
            { label: 'USER INPUT', Icon: User },
            { label: 'EXTERNAL APIs', Icon: Globe },
            { label: 'SENSORS', Icon: Radio },
        ];
        
        const rightLabels = [
            { label: 'PREDICTIONS', Icon: Sparkles },
            { label: 'AUTOMATION', Icon: Bot },
            { label: 'ANALYTICS', Icon: LineChart },
            { label: 'UI INSIGHTS', Icon: Layout },
        ];
        
        colCounts.forEach((count, colIndex) => {
            const ySpacing = 400 / (count + 1);
            for (let i = 0; i < count; i++) {
                // Add an organic curve to the layers so it looks like a network, not a strict grid
                const centerDist = Math.abs((count / 2) - i - 0.5);
                const xOffset = centerDist * 10 * (colIndex < 2 ? 1 : -1);
                
                let panelInfo = null;
                if (colIndex === 0) panelInfo = leftLabels[i];
                if (colIndex === 3) panelInfo = rightLabels[i];
                
                nodes.push({
                    id: `n_${colIndex}_${i}`,
                    col: colIndex,
                    x: xPositions[colIndex] + xOffset,
                    y: ySpacing * (i + 1),
                    r: count === 4 ? 0 : 4, // Outer layers have HTML panels instead of circles
                    panelInfo
                });
            }
        });

        // Connect adjacent layers (Dense Network)
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

        return { nodes, lines };
    }, []);

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });

            // 1. Initial pop-in of HTML panels
            tl.from('.ns-ai-panel-left', { x: -30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }, 0);
            tl.from('.ns-ai-panel-right', { x: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }, 0.2);

            // 2. Lines rapidly draw themselves
            tl.fromTo('.ns-ai-line', 
                { strokeDashoffset: 500, strokeDasharray: 500 },
                { strokeDashoffset: 0, duration: 1.5, ease: 'power3.inOut', stagger: { amount: 1.0, from: "start" } },
                0.5
            );

            // 3. Flowing data packets (repeats infinitely)
            tl.fromTo('.ns-ai-packet',
                { strokeDashoffset: 400 },
                { strokeDashoffset: 0, duration: 2.5, repeat: -1, ease: 'none', opacity: 1 },
                "-=0.5"
            );

            // 4. Subtle ambient glowing of inner nodes
            gsap.to('.ns-ai-inner-node', {
                scale: 1.25, opacity: 0.7, duration: 1.5, repeat: -1, yoyo: true, stagger: { amount: 2, from: 'random' }, ease: 'sine.inOut'
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={`ns-ai-nodes-container ${className}`} style={{ 
            width: '100%', 
            margin: 'clamp(2rem, 5vw, 6rem) 0',
            overflowX: 'auto', // Allows scrolling on mobile if it gets too cramped
            display: 'flex',
            justifyContent: 'center',
            ...style 
        }}>
            
            {/* Aspect Ratio Container acts as our absolute positioning coordinate system */}
            <div style={{ position: 'relative', width: '100%', minWidth: '700px', maxWidth: '1000px', aspectRatio: '2/1' }}>
                
                {/* 1. Background SVG Layer (Lines and Inner Nodes) */}
                <svg viewBox="0 0 800 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'visible' }}>
                    
                    {/* Base Neural Connections */}
                    {network.lines.map(line => (
                        <path 
                            key={line.id} 
                            className="ns-ai-line"
                            d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} 
                            stroke="#6366f1" 
                            strokeWidth="1.2" 
                            fill="none" 
                            opacity="0.25" 
                        />
                    ))}

                    {/* Glowing Data Packets (only on some lines to avoid chaos) */}
                    {network.lines.map((line, i) => {
                        if (i % 3 !== 0) return null;
                        return (
                            <path 
                                key={`packet_${line.id}`} 
                                className="ns-ai-packet"
                                d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} 
                                stroke="#a855f7" 
                                strokeWidth="2.5" 
                                fill="none" 
                                opacity="0" 
                                strokeDasharray="15 200"
                                style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }}
                            />
                        );
                    })}

                    {/* Glowing Inner Nodes */}
                    {network.nodes.filter(n => n.col === 1 || n.col === 2).map(node => (
                        <g key={node.id} className="ns-ai-inner-node" style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                            <circle cx={node.x} cy={node.y} r={node.r + 2} fill="#8b5cf6" opacity="0.8" style={{ filter: 'drop-shadow(0 0 10px #8b5cf6)' }} />
                            <circle cx={node.x} cy={node.y} r={node.r - 2} fill="#ffffff" />
                        </g>
                    ))}
                </svg>

                {/* 2. Foreground HTML Layer (Glassmorphism Panels) */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
                    
                    {/* Left Data Input Panels */}
                    {network.nodes.filter(n => n.col === 0).map((node) => {
                        const xPercent = (node.x / 800) * 100;
                        const yPercent = (node.y / 400) * 100;
                        const Icon = node.panelInfo.Icon;
                        return (
                            <div key={node.id} style={{
                                position: 'absolute', 
                                left: `${xPercent}%`, 
                                top: `${yPercent}%`, 
                                transform: 'translate(-100%, -50%)',
                                zIndex: 10
                            }}>
                                <div className="ns-ai-panel-left" style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'linear-gradient(90deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.6) 100%)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)', borderLeft: '3px solid #3b82f6',
                                    borderRadius: '4px', padding: '6px 12px', minWidth: '135px',
                                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                                    color: '#e2e8f0', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                    marginLeft: '-12px', // Offset slightly from the connection point
                                    position: 'relative'
                                }}>
                                    <Icon size={14} style={{ color: '#60a5fa' }} />
                                    <span>{node.panelInfo.label}</span>
                                    {/* Connection Dot */}
                                    <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', filter: 'drop-shadow(0 0 5px #3b82f6)' }} />
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Right Output Panels */}
                    {network.nodes.filter(n => n.col === 3).map((node) => {
                        const xPercent = (node.x / 800) * 100;
                        const yPercent = (node.y / 400) * 100;
                        const Icon = node.panelInfo.Icon;
                        return (
                            <div key={node.id} style={{
                                position: 'absolute', 
                                left: `${xPercent}%`, 
                                top: `${yPercent}%`, 
                                transform: 'translate(0%, -50%)',
                                zIndex: 10
                            }}>
                                <div className="ns-ai-panel-right" style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'linear-gradient(270deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.6) 100%)',
                                    border: '1px solid rgba(234, 179, 8, 0.3)', borderRight: '3px solid #eab308',
                                    borderRadius: '4px', padding: '6px 12px', minWidth: '135px',
                                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                                    color: '#e2e8f0', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                    marginLeft: '12px',
                                    position: 'relative'
                                }}>
                                    {/* Connection Dot */}
                                    <div style={{ position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#eab308', filter: 'drop-shadow(0 0 5px #eab308)' }} />
                                    <span>{node.panelInfo.label}</span>
                                    <Icon size={14} style={{ color: '#facc15', marginLeft: 'auto' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
