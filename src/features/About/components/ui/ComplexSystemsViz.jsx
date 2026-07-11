import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export default function ComplexSystemsViz() {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const nodes = svgRef.current.querySelectorAll('.sys-node');
        const lines = svgRef.current.querySelectorAll('.sys-line');

        const ctx = gsap.context(() => {
            // Intro animation
            gsap.fromTo(nodes, 
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
            );

            gsap.fromTo(lines,
                { strokeDasharray: 200, strokeDashoffset: 200, opacity: 0 },
                { strokeDashoffset: 0, opacity: 0.5, duration: 1.5, stagger: 0.05, ease: 'power2.out' }
            );

            // Floating animation
            nodes.forEach(node => {
                gsap.to(node, {
                    y: `+=${Math.random() * 15 - 7.5}`,
                    x: `+=${Math.random() * 15 - 7.5}`,
                    duration: 2 + Math.random() * 2,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut'
                });
            });

            // Data packets traveling along lines
            lines.forEach((line, i) => {
                const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                packet.setAttribute('r', '3');
                packet.setAttribute('fill', '#baff29');
                packet.style.opacity = '0';
                svgRef.current.appendChild(packet);

                const length = line.getTotalLength ? line.getTotalLength() : 200;

                gsap.to(packet, {
                    duration: 1.5 + Math.random(),
                    repeat: -1,
                    delay: Math.random() * 2,
                    ease: 'none',
                    onStart: () => { packet.style.opacity = '1'; },
                    motionPath: {
                        path: line,
                        align: line,
                        alignOrigin: [0.5, 0.5]
                    }
                });
            });
        }, svgRef);

        return () => ctx.revert();
    }, []);

    // Generate random nodes and lines
    const numNodes = 12;
    const nodes = Array.from({ length: numNodes }).map((_, i) => ({
        id: i,
        x: 100 + Math.random() * 300,
        y: 50 + Math.random() * 300,
        r: 10 + Math.random() * 15
    }));

    const lines = [];
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            if (Math.random() > 0.7) { // 30% chance to connect
                lines.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y });
            }
        }
    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg ref={svgRef} viewBox="0 0 500 400" style={{ width: '80%', height: 'auto', maxWidth: '500px', overflow: 'visible' }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {lines.map((line, i) => (
                    <path key={`line-${i}`} className="sys-line" d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`} stroke="var(--gray)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                ))}

                {nodes.map(node => (
                    <g key={`node-${node.id}`} className="sys-node" transform={`translate(${node.x}, ${node.y})`}>
                        <circle r={node.r} fill="#1a1a1a" stroke="#baff29" strokeWidth="2" filter="url(#glow)" />
                        <circle r={node.r / 3} fill="#baff29" opacity="0.8" />
                    </g>
                ))}
            </svg>
        </div>
    );
}
