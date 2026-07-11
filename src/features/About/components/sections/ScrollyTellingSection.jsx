import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollTypewriter from '../ui/ScrollTypewriter';

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

export default function ScrollyTellingSection({ sequences = [], children }) {
    // Create refs for each scene dynamically
    const [triggerRefs] = useState(() => sequences.map(() => React.createRef()));

    const { pinStart, pinEnd } = SCROLLY_CONFIG;

    useEffect(() => {
        const ctx = gsap.context(() => {
            triggerRefs.forEach((ref, index) => {
                if (ref.current) {
                    const vizContainer = ref.current.querySelector('.ns-viz-container');

                    ScrollTrigger.create({
                        trigger: ref.current,
                        pin: true,
                        start: pinStart,
                        end: index === 1 ? "+=4000px" : pinEnd,
                        refreshPriority: 100 - index, // Ensure pins are calculated top-down BEFORE children!
                    });

                    // 3D Z-Axis Tunnel Text Animation for subsequent rows (Index 2 and 3)
                    const textContainer = ref.current.querySelector('.ns-text-container');
                    
                    // index 0 is AnimatedGlobe, index 1 is JoyOfCoding (Paper Plane).
                    // We only want the 3D tunnel for index 2 and above!
                    if (index > 1 && textContainer) {
                        // Apply perspective to the parent row so Z-transforms look 3D
                        gsap.set(ref.current, { perspective: 1200 });
                        
                        // We use a timeline to create an intermediate state where the text is perfectly 
                        // readable before it scales up massively and flies past the screen.
                        const textTl = gsap.timeline({
                            scrollTrigger: {
                                trigger: ref.current,
                                start: "top 90%",
                                end: "+=1800px", // Massive scrub duration to feel like a tunnel
                                scrub: 1.5
                            }
                        });
                        
                        // Sequence: Deep Distance -> 3D Wall Perspective -> Fly past camera
                        textTl.fromTo(textContainer,
                            { 
                                z: -3000, 
                                rotateY: -55, 
                                opacity: 0, 
                                x: '10vw',
                                transformOrigin: "left center" 
                            },
                            { 
                                z: 0, 
                                rotateY: -40, 
                                opacity: 1, 
                                x: '0vw',
                                duration: 0.4, 
                                ease: 'power2.out' 
                            }
                        )
                        .to(textContainer, { z: 0, duration: 0.2 }) // Pause to read
                        .to(textContainer, { 
                            z: 1200, 
                            rotateY: -30,
                            opacity: 0, 
                            x: '-20vw',
                            duration: 0.4, 
                            ease: 'power2.in' 
                        });
                    } else if (index === 1 && textContainer) {
                        // Original slide-out animation for the 2nd row (Paper Plane text)
                        gsap.fromTo(textContainer,
                            { y: SCROLLY_CONFIG.slideOutStartY, x: 0, opacity: 0 },
                            {
                                y: SCROLLY_CONFIG.slideOutEndY,
                                x: 0,
                                opacity: 1,
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: ref.current,
                                    start: SCROLLY_CONFIG.animationStartTrigger,
                                    end: SCROLLY_CONFIG.animationEndTrigger,
                                    scrub: 1
                                }
                            }
                        );
                    }
                }
            });
        });
        return () => ctx.revert();
    }, [triggerRefs]);

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
                            marginBottom: '0',
                            marginTop: index > 0 ? SCROLLY_CONFIG.overlapMarginTop : '0',
                            position: 'relative',
                            zIndex: index === 0 ? 10 : sequences.length - index
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
                            {scene.text.includes('|||') ? (
                                <div style={{ position: 'relative', width: '100%', perspective: '1200px' }}>
                                    <div className="part-1-text">
                                        <ScrollTypewriter
                                            text={scene.text.split('|||')[0]}
                                            highlights={scene.highlights}
                                            className="ns-lyrics-text"
                                            style={{ margin: 0, textAlign: 'left', width: '100%' }}
                                            scrollStart={SCROLLY_CONFIG.animationStartTrigger}
                                            scrollEnd={SCROLLY_CONFIG.animationEndTrigger}
                                            customTriggerRef={triggerRefs[index]}
                                            typeSpeedMultiplier={1.2}
                                        />
                                    </div>
                                    {/* part-2-text removed so we can focus on animating the plane first! */}
                                </div>
                            ) : (
                                <ScrollTypewriter
                                    text={scene.text}
                                    highlights={scene.highlights}
                                    className="ns-lyrics-text"
                                    style={{ margin: 0, textAlign: 'left', width: '100%' }}
                                    scrollStart={index === 0 ? pinStart : SCROLLY_CONFIG.animationStartTrigger}
                                    scrollEnd={index === 0 ? pinEnd : SCROLLY_CONFIG.animationEndTrigger}
                                    customTriggerRef={triggerRefs[index]}
                                    typeSpeedMultiplier={index === 0 ? 2.5 : 1.2}
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
                                opacity: 1
                            }}
                        >
                            <div style={{ width: '100%', height: '500px', position: 'relative' }}>
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
