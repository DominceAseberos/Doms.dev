import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const Badge = ({ text, delay }) => {
    const badgeRef = useRef(null);
    const textRef = useRef(null);
    
    useEffect(() => {
        if (!badgeRef.current || !textRef.current) return;
        
        let interval;
        const targetText = text;
        
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: badgeRef.current,
                start: 'top 85%',
                onEnter: () => {
                    // Fade in the badge
                    gsap.to(badgeRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power3.out',
                        delay: delay
                    });
                    
                    // Decode effect
                    setTimeout(() => {
                        let iteration = 0;
                        clearInterval(interval);
                        interval = setInterval(() => {
                            textRef.current.innerText = targetText
                                .split('')
                                .map((letter, index) => {
                                    if(index < iteration) {
                                        return targetText[index];
                                    }
                                    return chars[Math.floor(Math.random() * chars.length)];
                                })
                                .join('');
                                
                            if(iteration >= targetText.length){
                                clearInterval(interval);
                            }
                            iteration += 1 / 3; 
                        }, 30);
                    }, delay * 1000 + 200); // Start decoding slightly after fading in
                },
                once: true
            });
        }, badgeRef);
        
        return () => {
            ctx.revert();
            clearInterval(interval);
        };
    }, [text, delay]);

    return (
        <div ref={badgeRef} style={{
            opacity: 0,
            transform: 'translateY(20px)',
            background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <span ref={textRef} style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--accent)',
                textShadow: '0 0 10px color-mix(in srgb, var(--accent) 30%, transparent)'
            }}>
                {/* Initial encrypted state */}
                {Array(text.length).fill('0').join('')}
            </span>
        </div>
    );
};

export default function IdentityBadges({ className = '', style = {} }) {
    return (
        <div className={`ns-identity-badges ${className}`} style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            margin: '2rem 0',
            ...style 
        }}>
            <Badge text="[ UM TAGUM COLLEGE ]" delay={0} />
            <Badge text="[ AI SPECIALIST ]" delay={0.2} />
        </div>
    );
}
