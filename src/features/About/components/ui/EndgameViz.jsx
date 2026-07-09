import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function EndgameViz() {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const elementsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current || !cardRef.current) return;

        const ctx = gsap.context(() => {
            // Floating animation for the whole card
            gsap.to(cardRef.current, {
                y: -15,
                rotationX: 5,
                rotationY: -5,
                duration: 3,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });

            // Pulse the skeleton elements
            gsap.to(elementsRef.current, {
                opacity: 0.5,
                duration: 1.5,
                stagger: 0.2,
                yoyo: true,
                repeat: -1,
                ease: 'power1.inOut'
            });

            // Appear animation
            gsap.fromTo(cardRef.current,
                { opacity: 0, scale: 0.8, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out' }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
            <div ref={cardRef} style={{
                width: '260px', height: '340px', backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(186, 255, 41, 0.1)',
                transformStyle: 'preserve-3d'
            }}>
                {/* Header Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', transform: 'translateZ(20px)' }}>
                    <div ref={addToRefs} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#baff29', opacity: 0.8, boxShadow: '0 0 15px rgba(186, 255, 41, 0.5)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div ref={addToRefs} style={{ width: '80px', height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }} />
                        <div ref={addToRefs} style={{ width: '50px', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
                    </div>
                </div>

                {/* Main Graph/Hero */}
                <div style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '12px', marginTop: '10px', position: 'relative', overflow: 'hidden', transform: 'translateZ(30px)' }}>
                    {/* Glowing graph line */}
                    <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', position: 'absolute', bottom: '-10px' }}>
                        <path d="M0,50 L10,40 L30,45 L50,20 L70,30 L90,10 L100,15 L100,50 Z" fill="rgba(186, 255, 41, 0.1)" />
                        <path d="M0,50 L10,40 L30,45 L50,20 L70,30 L90,10 L100,15" fill="none" stroke="#baff29" strokeWidth="2" filter="drop-shadow(0 0 4px #baff29)" />
                        <circle cx="90" cy="10" r="3" fill="#fff" filter="drop-shadow(0 0 5px #fff)" />
                    </svg>
                </div>

                {/* Footer Items */}
                <div style={{ display: 'flex', gap: '10px', transform: 'translateZ(10px)' }}>
                    <div ref={addToRefs} style={{ flex: 1, height: '30px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <div ref={addToRefs} style={{ flex: 1, height: '30px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                </div>
            </div>
            
            {/* Background ambient glow */}
            <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(186, 255, 41, 0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1, pointerEvents: 'none' }} />
        </div>
    );
}
