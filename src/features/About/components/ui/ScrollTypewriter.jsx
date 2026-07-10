import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTypewriter({ text = '', highlights = [], className = '', style = {}, scrollStart = 'top 85%', scrollEnd = 'bottom 45%', customTriggerRef, typeSpeedMultiplier = 1 }) {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const targetEl = customTriggerRef?.current || containerRef.current;
        if (!targetEl) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: targetEl,
                start: scrollStart,
                end: scrollEnd,
                scrub: true,
                onUpdate: (self) => {
                    setProgress(self.progress);
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [scrollStart, scrollEnd, customTriggerRef]);

    const typingProgress = Math.min(1, progress * typeSpeedMultiplier);
    const charCount = Math.floor(typingProgress * text.length);
    const visibleText = text.slice(0, charCount);
    
    // Highlight logic
    const getHighlightedHTML = (str, hl) => {
        if (!str) return '';
        let result = str;
        hl.forEach(h => {
            const escapedH = h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b(${escapedH})\\b`, 'gi');
            result = result.replace(regex, `<span style="color: var(--accent); text-shadow: 0 0 20px color-mix(in srgb, var(--accent) 30%, transparent); font-weight: 700;">$1</span>`);
        });
        return result;
    };

    const htmlContent = getHighlightedHTML(visibleText, highlights);
    const ghostHtmlContent = getHighlightedHTML(text, highlights);

    return (
        <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
            {/* Invisible ghost text to perfectly reserve the required layout height */}
            <div 
                style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none', color: 'transparent' }}
                dangerouslySetInnerHTML={{ __html: ghostHtmlContent }}
            />
            
            {/* Visible sliced text absolutely positioned over the ghost text */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <span style={{ 
                    fontWeight: 700,
                    color: 'var(--accent)',
                    animation: 'st-blink 1s step-end infinite',
                    marginLeft: '2px'
                }}>|</span>
            </div>
            
            <style>{`
                @keyframes st-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
}
