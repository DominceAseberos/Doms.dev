import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollTypewriter from '../ui/ScrollTypewriter';

gsap.registerPlugin(ScrollTrigger);

// ── Configuration for ScrollyTelling Timings & Spacing ──
const SCROLLY_CONFIG = {
    pinStart: 'center center',
    pinEnd: '+=250%',
    overlapMarginTop: '-5vh',
    slideOutStartY: -200,
    slideOutEndY: 0,
    animationStartTrigger: 'top 75%',
    animationEndTrigger: 'center center',
};

// Terminal file title shown in each scene's window chrome
const TERMINAL_TITLES = ['adrenaline.ts', 'endgame.ts'];

export default function ScrollyTellingSection({ sequences = [], children, sectionLabel }) {
    const sectionRef = useRef(null);
    const [triggerRefs] = useState(() => sequences.map(() => React.createRef()));

    // Scroll-scrubbed parallax: the terminal note flies in / lifts as you scroll
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || sequences.length === 0) return;

        const rows = section.querySelectorAll('.ns-scrolly-row');

        const ctx = gsap.context(() => {
            rows.forEach((row) => {
                const viz = row.querySelector('.ns-term-wrap');
                const text = row.querySelector('.ns-scrolly-text');

                if (text) gsap.set(text, { opacity: 0, y: 34 });

                ScrollTrigger.create({
                    trigger: row,
                    start: 'top 72%',
                    end: 'bottom 58%',
                    scrub: 0.7,
                    onUpdate: (self) => {
                        const p = self.progress;
                        if (text) gsap.set(text, { opacity: Math.min(1, p * 2.2), y: 34 - p * 34 });
                        if (viz) gsap.set(viz, { y: 70 - p * 90, scale: 0.9 + p * 0.1 });
                    },
                });
            });
        }, section);

        return () => ctx.revert();
    }, [sequences.length]);

    if (!sequences || sequences.length === 0) return null;

    return (
        <div ref={sectionRef} style={{ width: '100%' }}>
            {sectionLabel && (
                <p className="ui-sub-label ns-section-label ns-scrolly-section-label" suppressHydrationWarning>
                    <span style={{ color: 'var(--accent)' }}>$</span> {sectionLabel}
                </p>
            )}
            {sequences.map((scene, index) => {
                const Viz = scene.VizComponent;
                return (
                    <div
                        key={scene.id}
                        ref={triggerRefs[index]}
                        className="ns-scrollytelling-row ns-scrolly-row"
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center', width: '100%', minHeight: '90vh', justifyContent: 'center', position: 'relative' }}
                    >
                        {/* Left: typed story */}
                        <div className="ns-scrolly-text" style={{ flex: '1 1 380px', maxWidth: '620px', position: 'relative' }}>
                            <p className="ns-scrolly-prompt" suppressHydrationWarning>
                                <span className="ns-scrolly-cwd">~/domince</span> <span className="ns-scrolly-cmd">about</span>
                                <span className="ns-scrolly-caret" />
                            </p>
                            {scene.text.includes('|||') ? (
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <div className="part-1-text">
                                        <ScrollTypewriter text={scene.text.split('|||')[0]} highlights={scene.highlights} className="ns-lyrics-text ns-scrolly-monotext" customTriggerRef={triggerRefs[index]} />
                                    </div>
                                    <div className="part-2-text" style={{ marginTop: '1.25rem' }}>
                                        <ScrollTypewriter text={scene.text.split('|||')[1]} highlights={scene.highlights} className="ns-lyrics-text ns-scrolly-monotext" customTriggerRef={triggerRefs[index]} />
                                    </div>
                                </div>
                            ) : (
                                <ScrollTypewriter text={scene.text} highlights={scene.highlights} className="ns-lyrics-text ns-scrolly-monotext" customTriggerRef={triggerRefs[index]} />
                            )}
                        </div>

                        {/* Right: terminal chrome wrapping the viz */}
                        <div className="ns-term-wrap" style={{ flex: '1 1 400px', minWidth: '300px', position: 'relative' }}>
                            <div className="ns-term">
                                <div className="ns-term-bar">
                                    <span className="ns-term-dot" style={{ background: '#ff5f56' }} />
                                    <span className="ns-term-dot" style={{ background: '#ffbd2e' }} />
                                    <span className="ns-term-dot" style={{ background: '#27c93f' }} />
                                    <span className="ns-term-title">{TERMINAL_TITLES[index] || 'note.md'}</span>
                                </div>
                                <div className="ns-term-body">
                                    <Viz scrollTriggerRef={scene.vizNeedsTriggerRef ? triggerRefs[index] : undefined} scrollStart={SCROLLY_CONFIG.pinStart} scrollEnd={SCROLLY_CONFIG.pinEnd} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Render external children (like socials) here if passed */}
            {children}
        </div>
    );
}
