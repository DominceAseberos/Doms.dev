import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function LyricsScrubText({ text, highlights = [], className = '', style = {} }) {
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current || typeof window === 'undefined') return;

        const ctx = gsap.context(() => {
            const words = gsap.utils.toArray('.lyric-word', textRef.current);
            gsap.set(words, { opacity: 0.15 });

            gsap.to(words, {
                opacity: 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                    end: 'bottom 45%',
                    scrub: 0.5,
                }
            });
        }, textRef);

        return () => ctx.revert();
    }, [text]);

    return (
        <p ref={textRef} className={`ns-lyrics-text ${className}`} style={style} suppressHydrationWarning>
            {text.split(' ').map((word, i) => {
                const cleanWord = word.replace(/[.,!?]/g, '');
                const isHighlight = highlights.some(h => h.toLowerCase() === cleanWord.toLowerCase());
                return (
                    <span key={i} className="lyric-word" style={{
                        marginRight: '0.25em',
                        display: 'inline-block',
                        willChange: 'opacity',
                        color: isHighlight ? 'var(--accent)' : 'inherit',
                        textShadow: isHighlight ? '0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)' : 'none'
                    }}>
                        {word}
                    </span>
                );
            })}
        </p>
    );
}
