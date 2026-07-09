import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollTypewriter from '../ui/ScrollTypewriter';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollyTellingSection({ sequences = [], children }) {
    const containerRef = useRef(null);
    
    // Create an array of refs dynamically based on the number of scenes
    // We use useState to avoid recreating the refs on every render, mapped by length
    const [triggerRefs] = useState(() => sequences.map(() => React.createRef()));

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const triggers = gsap.utils.toArray('.scene-trigger');
            const vizs = gsap.utils.toArray('.scene-viz');
            const texts = gsap.utils.toArray('.scene-text');

            if (triggers.length === 0 || vizs.length === 0) return;

            triggers.forEach((trigger, i) => {
                ScrollTrigger.create({
                    trigger: trigger,
                    start: 'top 50%',
                    end: 'bottom 50%',
                    onEnter: () => {
                        vizs.forEach((v, index) => {
                            gsap.to(v, { opacity: index === i ? 1 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });
                        });
                        texts.forEach((t, index) => {
                            gsap.to(t, { opacity: index === i ? 1 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto', pointerEvents: index === i ? 'auto' : 'none' });
                        });
                    },
                    onEnterBack: () => {
                        vizs.forEach((v, index) => {
                            gsap.to(v, { opacity: index === i ? 1 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });
                        });
                        texts.forEach((t, index) => {
                            gsap.to(t, { opacity: index === i ? 1 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto', pointerEvents: index === i ? 'auto' : 'none' });
                        });
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [sequences.length]);

    if (!sequences || sequences.length === 0) return null;

    return (
        <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '2rem', position: 'relative', minHeight: `${sequences.length * 120}vh` }}>
            
            {/* Invisible Scroll Triggers Track */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
                {sequences.map((_, index) => (
                    <div key={`trigger-${index}`} ref={triggerRefs[index]} className="scene-trigger" style={{ height: '120vh', width: '100%' }} />
                ))}
            </div>

            {/* Left Column (Sticky Scrollytelling Text) */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '700px' }}>
                <div style={{ position: 'sticky', top: '15vh', height: '70vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="ns-about-main" style={{ width: '100%', position: 'relative', height: '100%' }}>
                        
                        {sequences.map((scene, index) => (
                            <div key={scene.id} className="scene-text" style={{ position: 'absolute', top: '20%', left: 0, width: '100%', opacity: index === 0 ? 1 : 0 }}>
                                <ScrollTypewriter
                                    text={scene.text}
                                    highlights={scene.highlights}
                                    className="ns-lyrics-text"
                                    style={{ margin: 0, textAlign: 'left', width: '100%' }}
                                    scrollStart="top 80%"
                                    scrollEnd="center 40%"
                                    customTriggerRef={triggerRefs[index]}
                                />
                            </div>
                        ))}
                        
                    </div>
                    
                    {/* Render external children (like socials) here */}
                    {children}
                </div>
            </div>

            {/* Right Column (Sticky Visualizations) */}
            <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
                <div style={{ position: 'sticky', top: '15vh', height: '70vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {sequences.map((scene, index) => {
                        const Viz = scene.VizComponent;
                        return (
                            <div key={scene.id} className="scene-viz" style={{ position: 'absolute', width: '100%', height: '100%', opacity: index === 0 ? 1 : 0, zIndex: sequences.length - index, transition: 'opacity 0.6s ease', pointerEvents: index === 0 ? 'auto' : 'none' }}>
                                <Viz scrollTriggerRef={scene.vizNeedsTriggerRef ? triggerRefs[index] : undefined} />
                            </div>
                        );
                    })}

                </div>
            </div>
            
        </div>
    );
}
