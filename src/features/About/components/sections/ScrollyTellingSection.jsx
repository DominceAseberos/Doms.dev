import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollTypewriter from '../ui/ScrollTypewriter';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollyTellingSection({ sequences = [], children }) {
    // Create refs for each scene dynamically
    const [triggerRefs] = useState(() => sequences.map(() => React.createRef()));

    const pinStart = "center center";
    const pinEnd = "+=250%";

    useEffect(() => {
        const ctx = gsap.context(() => {
            triggerRefs.forEach((ref, index) => {
                if (ref.current) {
                    const vizContainer = ref.current.querySelector('.ns-viz-container');
                    
                    ScrollTrigger.create({
                        trigger: ref.current,
                        pin: true,
                        start: pinStart,
                        end: pinEnd,
                        refreshPriority: 100 - index, // Ensure pins are calculated top-down BEFORE children!
                        onEnter: () => {
                            if (index > 0 && vizContainer) {
                                gsap.to(vizContainer, { opacity: 1, duration: 0.8, ease: 'power2.out' });
                            }
                        },
                        onLeaveBack: () => {
                            if (index > 0 && vizContainer) {
                                gsap.to(vizContainer, { opacity: 0, duration: 0.5, ease: 'power2.in' });
                            }
                        }
                    });

                    // Text slide-out animation for subsequent rows
                    const textContainer = ref.current.querySelector('.ns-text-container');
                    if (index > 0 && textContainer) {
                        gsap.fromTo(textContainer, 
                            { y: -50, x: 100, opacity: 0 },
                            { 
                                y: 0, 
                                x: 0,
                                opacity: 1, 
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: ref.current,
                                    start: 'top 100%', 
                                    end: 'center center',
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
                            gap: '4rem', 
                            alignItems: 'center',
                            minHeight: '100vh',
                            justifyContent: 'center',
                            marginBottom: '0',
                            marginTop: '0',
                            position: 'relative',
                            zIndex: index === 0 ? 10 : sequences.length - index
                        }}
                    >
                        {/* Left Column (Text) */}
                        <div 
                            className="ns-text-container"
                            style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '600px' }}
                        >
                            <ScrollTypewriter
                                text={scene.text}
                                highlights={scene.highlights}
                                className="ns-lyrics-text"
                                style={{ margin: 0, textAlign: 'left', width: '100%' }}
                                scrollStart={index === 0 ? pinStart : "top 70%"}
                                scrollEnd={pinEnd}
                                customTriggerRef={triggerRefs[index]}
                                typeSpeedMultiplier={index === 0 ? 2.5 : 1.2}
                            />
                        </div>

                        {/* Right Column (Visualization) */}
                        <div 
                            className="ns-viz-container"
                            style={{ 
                                flex: '1 1 400px', 
                                minWidth: '300px', 
                                display: 'flex', 
                                justifyContent: 'center',
                                opacity: index === 0 ? 1 : 0
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
