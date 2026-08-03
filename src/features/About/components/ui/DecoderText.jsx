import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScramble } from 'use-scramble';

gsap.registerPlugin(ScrollTrigger);

// Sub-component for individual chunks of text to scramble
const ScrambleChunk = ({ text, isHighlight, playSignal }) => {
    const { ref, replay } = useScramble({
        text,
        speed: 0.6,
        tick: 1,
        step: 1,
        scramble: 6,
        seed: 0,
        playOnMount: false,
    });

    useEffect(() => {
        if (playSignal > 0) {
            replay();
        }
    }, [playSignal, replay]);

    if (isHighlight) {
        return (
            <span 
                ref={ref} 
                style={{ 
                    color: 'var(--accent)', 
                    textShadow: '0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)', 
                    fontWeight: 700 
                }} 
            />
        );
    }
    return <span ref={ref} />;
};

export default function DecoderText({ text = '', highlights = [], className = '', style = {}, scrollStart = 'top 85%', scrollEnd = 'bottom 45%', customTriggerRef, typeSpeedMultiplier = 1, externalProgress }) {
    const containerRef = useRef(null);
    const [playSignal, setPlaySignal] = useState(0);

    // Split text into highlighted and normal chunks
    const chunks = [];
    if (highlights.length > 0) {
        // Create regex to match any of the highlight words
        const escapedHl = highlights.map(h => h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
        const regex = new RegExp(`\\b(${escapedHl.join('|')})\\b`, 'gi');
        
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                chunks.push({ text: text.substring(lastIndex, match.index), isHighlight: false });
            }
            chunks.push({ text: match[0], isHighlight: true });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            chunks.push({ text: text.substring(lastIndex), isHighlight: false });
        }
    } else {
        chunks.push({ text, isHighlight: false });
    }

    useEffect(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const targetEl = customTriggerRef?.current || containerRef.current;
        if (!targetEl) return;

        const ctx = gsap.context(() => {
            const rowEl = targetEl.closest('.ns-scrollytelling-row');
            const isSelfPinned = rowEl === targetEl;

            ScrollTrigger.create({
                trigger: targetEl,
                pinnedContainer: isSelfPinned ? undefined : rowEl,
                start: scrollStart,
                onEnter: () => setPlaySignal(p => p + 1),
                onEnterBack: () => setPlaySignal(p => p + 1), // Replay if they scroll up to it again
            });
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [scrollStart, customTriggerRef]);

    return (
        <div ref={containerRef} className={className} style={{ ...style, whiteSpace: 'pre-wrap' }}>
            {chunks.map((chunk, i) => (
                <ScrambleChunk key={i} text={chunk.text} isHighlight={chunk.isHighlight} playSignal={playSignal} />
            ))}
        </div>
    );
}
