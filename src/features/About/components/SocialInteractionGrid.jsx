import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MousePointer2, Grid } from 'lucide-react';
import { FaLinkedinIn, FaXTwitter, FaThreads, FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa6';

const getSocialIcon = (label) => {
    const l = label.toLowerCase();
    if (l === 'linkedin') return <FaLinkedinIn />;
    if (l === 'x' || l === 'twitter') return <FaXTwitter />;
    if (l === 'threads') return <FaThreads />;
    if (l === 'instagram') return <FaInstagram />;
    if (l === 'facebook') return <FaFacebookF />;
    if (l === 'email') return <FaEnvelope />;
    return <span className="ns-arrow">↗</span>;
};

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const SocialInteractionGrid = ({ socials }) => {
    const containerRef = useRef(null);
    const menuIconRef = useRef(null);
    const cursorRef = useRef(null);
    const iconsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                once: true
            }
        });

        // 1. Cursor swoops in
        tl.fromTo(cursorRef.current, 
            { x: 100, y: 100, opacity: 0, rotation: -20 },
            { x: 15, y: 15, opacity: 1, rotation: 0, duration: 0.8, ease: "power3.out" }
        )
        // 2. Hover state on menu
        .to(menuIconRef.current, { scale: 1.15, duration: 0.2 }, "-=0.2")
        // 3. Click down
        .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
        .to(menuIconRef.current, { scale: 0.9, duration: 0.1 }, "<")
        // 4. Click up
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        // 5. Expand & Explode grid
        .to(menuIconRef.current, { scale: 0, opacity: 0, duration: 0.3 }, "<")
        .to(iconsRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            stagger: {
                amount: 0.4,
                from: "center"
            },
            ease: "back.out(2)",
            duration: 0.6
        }, "<")
        // 6. Cursor leaves
        .to(cursorRef.current, {
            x: 100,
            y: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in"
        }, "-=0.3")
        .set(cursorRef.current, { display: 'none' });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ 
            position: 'relative', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem', 
            width: '100%',
            maxWidth: '240px'
        }}>
            {/* The Initial Menu Button */}
            <div 
                ref={menuIconRef}
                style={{ 
                    position: 'absolute', 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--ns-link-color)',
                    width: '60px', height: '60px',
                    background: 'var(--bg-card, rgba(20,20,20,0.5))',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    borderRadius: '16px',
                    zIndex: 10
                }}
            >
                <Grid size={28} />
            </div>

            {/* Simulated Cursor */}
            <div 
                ref={cursorRef}
                style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50,
                    pointerEvents: 'none',
                    color: 'var(--accent-color, #3B82F6)',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                }}
            >
                <MousePointer2 size={32} fill="var(--accent-color, #3B82F6)" />
            </div>

            {/* The Actual Social Icons */}
            {socials.map((link, idx) => (
                <a 
                    key={link.label} 
                    href={link.href}
                    target={link.external ? '_blank' : '_self'}
                    rel={link.external ? 'noopener noreferrer' : ''}
                    className="ns-social-link" 
                    title={link.label}
                    ref={el => iconsRef.current[idx] = el}
                    style={{ 
                        fontSize: '1.5rem', 
                        color: 'var(--ns-link-color)', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-card, rgba(20,20,20,0.5))',
                        border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                        borderRadius: '16px',
                        aspectRatio: '1',
                        opacity: 0,
                        transform: 'scale(0)' 
                    }}
                    onMouseEnter={(e) => { 
                        gsap.to(e.currentTarget, {
                            y: -6,
                            scale: 1.1,
                            rotation: (Math.random() - 0.5) * 10,
                            color: 'var(--accent-color)',
                            borderColor: 'var(--accent-color)',
                            duration: 0.35,
                            ease: 'back.out(3)'
                        });
                    }}
                    onMouseLeave={(e) => { 
                        gsap.to(e.currentTarget, {
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            color: 'var(--ns-link-color)',
                            borderColor: 'var(--border-color, rgba(255,255,255,0.1))',
                            duration: 0.7,
                            ease: 'elastic.out(1, 0.3)'
                        });
                    }}
                >
                    {getSocialIcon(link.label)}
                </a>
            ))}
        </div>
    );
};

export default SocialInteractionGrid;
