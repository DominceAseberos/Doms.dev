import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DecoderText from '../ui/DecoderText';

gsap.registerPlugin(ScrollTrigger);

// ── Configuration for ScrollyTelling Timings & Spacing ──
export const SCROLLY_CONFIG = {
    // 1st Sequence Pinning
    pinStart: "center center",
    pinEnd: "+=250%",

    // Subsequent Sequences (2nd, 3rd, etc.) Spacing & Timings
    overlapMarginTop: "-5vh", // Pulls the sequence up under the previous one
    slideOutStartY: -200,      // Starts physically higher (hidden behind the black box)
    slideOutEndY: 0,           // Drops down to normal position

    // Triggers for when the subsequent sequences emerge from the black box
    animationStartTrigger: "top 75%",     // When to start dropping down & typing
    animationEndTrigger: "center center", // When it finishes dropping down & typing
};

export default function ScrollyTellingSection({ sequences = [], children, sectionLabel }) {
    // Create refs for each scene dynamically
    const [triggerRefs] = useState(() => sequences.map(() => React.createRef()));

    const { pinStart, pinEnd } = SCROLLY_CONFIG;

    useEffect(() => {
        // All GSAP timeline animations, pins, and triggers have been stripped out
        // to allow for easy layout extraction and design.
    }, [triggerRefs]);

    const renderStaticText = (text, highlights) => {
        if (!text) return null;
        let htmlContent = text;
        if (highlights && highlights.length > 0) {
            highlights.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                htmlContent = htmlContent.replace(regex, `<span class="ns-highlight-word">${word}</span>`);
            });
        }
        return <span className="ns-lyrics-text" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    if (!sequences || sequences.length === 0) return null;

    return (
        <div style={{ width: '100%', paddingBottom: '15vh' }}>
            {sequences.map((scene, index) => {
                const Viz = scene.VizComponent;
                return (
                    <div
                        key={scene.id}
                        ref={triggerRefs[index]}
                        className="ns-scrollytelling-row"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '100%',
                            gap: index === 0 ? '4rem' : '2rem',
                            alignItems: 'center',
                            alignContent: 'center',
                            minHeight: '100vh',
                            justifyContent: 'center',
                            marginBottom: index === 0 ? '0' : '10vh',
                            marginTop: index === 0 ? '0' : '10vh',
                            position: 'relative',
                            // Ensure subsequent rows (like Row 2) render ON TOP of previous rows (like Row 1)
                            // so the JoyOfCoding plane can fly over the AnimatedGlobe map!
                            zIndex: 10 + (index * 10) 
                        }}
                    >
                        {/* Left Column (Text) */}
                        <div
                            className="ns-text-container"
                            style={{
                                flex: index === 0 ? '1 1 400px' : '1 1 100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                maxWidth: index === 0 ? '600px' : '1000px',
                                position: 'relative' // For absolute stacking of replaced text
                            }}
                        >
                            {/* Section label (e.g. "About") — only on the first row */}
                            {index === 0 && sectionLabel && (
                                <p className="ui-sub-label ns-section-label" style={{ marginBottom: '1rem' }}>{sectionLabel}</p>
                            )}
                            {scene.text.includes('|||') ? (
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <div className="part-1-text">
                                        <DecoderText 
                                            text={scene.text.split('|||')[0]} 
                                            highlights={scene.highlights}
                                            className="ns-lyrics-text"
                                            customTriggerRef={triggerRefs[index]}
                                        />
                                    </div>
                                    <div className="part-2-text" style={{ marginTop: '1.5rem' }}>
                                        <DecoderText 
                                            text={scene.text.split('|||')[1]} 
                                            highlights={scene.highlights}
                                            className="ns-lyrics-text"
                                            customTriggerRef={triggerRefs[index]}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <DecoderText 
                                    text={scene.text} 
                                    highlights={scene.highlights}
                                    className="ns-lyrics-text"
                                    customTriggerRef={triggerRefs[index]}
                                />
                            )}
                        </div>

                        {/* Right Column (Visualization) */}
                        <div
                            className="ns-viz-container"
                            style={{
                                flex: '1 1 400px',
                                minWidth: '300px',
                                display: 'flex',
                                justifyContent: 'center',
                                opacity: 1,
                                overflow: 'visible', // Let the plane fly outside this box
                            }}
                        >
                            <div style={{ width: '100%', height: '500px', position: 'relative' }} className="ns-viz-container">
                                <Viz
                                    scrollTriggerRef={scene.vizNeedsTriggerRef ? triggerRefs[index] : undefined}
                                    scrollStart={pinStart}
                                    scrollEnd={pinEnd}
                                />
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
