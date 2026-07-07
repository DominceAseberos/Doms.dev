import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useThemeStore from '../../../../store/useThemeStore';

import desktopSquiggle1 from '../../../../assets/contact-curved-top-right-to-botton.svg?url';
import desktopSquiggle2 from '../../../../assets/contact-curved-bottom-left-to-botton.svg?url';
import mobileSquiggle1 from '../../../../assets/mobie-view-svg-flow/top-right.svg?url';
import mobileSquiggle2 from '../../../../assets/mobie-view-svg-flow/bottom-left.svg?url';

gsap.registerPlugin(ScrollTrigger);

// ── CONFIGURATION FOR CONTACT SQUIGGLES ────────────────────────
export const SQUIGGLE_CONFIG = {
    // ── SCROLL TRIGGER CONFIG ──
    scrollAnimation: {
        start: 'top 95%', // Starts as soon as the top of the contact section becomes visible
        end: 'top 20%',   // Finishes when the top of the contact section is near the top of the screen
        toggleActions: 'play none none reverse',
        scrub: false // Disabled scrub to prevent flickering
    },
    desktop: {
        opacity: 1.0,
        svg1: {
            top: `-2vh`,
            right: '-15vw',
            bottom: 'auto',
            left: `auto`,
            width: '55vw',
            minWidth: 'auto',
            duration: 4,
            delay: 0 // Starts immediately (at 0)
        },
        svg2: {
            top: `auto`,
            right: 'auto',
            bottom: '-50vh',
            left: `0`,
            width: '40vw',
            minWidth: 'auto',
            duration: 4,
            delay: 1 // Starts at 4 (right after svg1 finishes)
        }
    },
    mobile: {
        // Top Right Squiggle
        svg1: {
            opacity: 1.0,
            top: '15%',
            right: '-5%',
            bottom: 'auto',
            left: 'auto',
            width: '55vw',
            minWidth: '0px',
            duration: 4,
            delay: 0
        },
        // Bottom Left Squiggle
        svg2: {
            opacity: 1.0,
            top: 'auto',
            right: 'auto',
            bottom: '-50vh',
            left: '-5%',
            width: '85vw',
            minWidth: '0px',
            duration: 4,
            delay: 4
        }
    }
};

export default function ContactSquiggles() {
    const containerRef = useRef(null);
    const svg1Ref = useRef(null);
    const svg2Ref = useRef(null);
    const theme = useThemeStore((state) => state.theme);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        let ctx;
        const timer = setTimeout(() => {
            ctx = gsap.context(() => {
                const maskObj1 = { size: 0 };
                const maskObj2 = { size: 0 };

                const updateMask1 = () => {
                    const val = maskObj1.size;
                    gsap.set(svg1Ref.current, {
                        WebkitMaskImage: `radial-gradient(circle at 100% 0%, transparent calc(${val}% - 45%), black calc(${val}% - 5%), transparent ${val}%)`,
                        maskImage: `radial-gradient(circle at 100% 0%, transparent calc(${val}% - 45%), black calc(${val}% - 5%), transparent ${val}%)`
                    });
                };

                const updateMask2 = () => {
                    const val = maskObj2.size;
                    gsap.set(svg2Ref.current, {
                        WebkitMaskImage: `radial-gradient(circle at 0% 100%, transparent calc(${val}% - 45%), black calc(${val}% - 5%), transparent ${val}%)`,
                        maskImage: `radial-gradient(circle at 0% 100%, transparent calc(${val}% - 45%), black calc(${val}% - 5%), transparent ${val}%)`
                    });
                };

                updateMask1();
                updateMask2();

                gsap.set([svg1Ref.current, svg2Ref.current], { clipPath: 'none' });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: SQUIGGLE_CONFIG.scrollAnimation.start,
                        ...(SQUIGGLE_CONFIG.scrollAnimation.scrub !== false
                            ? { scrub: SQUIGGLE_CONFIG.scrollAnimation.scrub, end: SQUIGGLE_CONFIG.scrollAnimation.end }
                            : { toggleActions: SQUIGGLE_CONFIG.scrollAnimation.toggleActions })
                    }
                });

                const isMob = window.innerWidth <= 768;
                const config1 = isMob ? SQUIGGLE_CONFIG.mobile.svg1 : SQUIGGLE_CONFIG.desktop.svg1;
                const config2 = isMob ? SQUIGGLE_CONFIG.mobile.svg2 : SQUIGGLE_CONFIG.desktop.svg2;

                tl.to(maskObj1, {
                    size: 200,
                    duration: config1.duration,
                    ease: 'power2.inOut',
                    onUpdate: updateMask1
                }, config1.delay);

                tl.to(maskObj2, {
                    size: 180,
                    duration: config2.duration,
                    ease: 'power2.inOut',
                    onUpdate: updateMask2
                }, config2.delay);
            }, containerRef);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, []);

    const squiggleFilter = theme === 'dark' ? 'invert(1)' : 'none';
    const config1 = isMobile ? SQUIGGLE_CONFIG.mobile.svg1 : SQUIGGLE_CONFIG.desktop.svg1;
    const config2 = isMobile ? SQUIGGLE_CONFIG.mobile.svg2 : SQUIGGLE_CONFIG.desktop.svg2;
    const activeOpacity1 = isMobile ? SQUIGGLE_CONFIG.mobile.svg1.opacity : SQUIGGLE_CONFIG.desktop.opacity;
    const activeOpacity2 = isMobile ? SQUIGGLE_CONFIG.mobile.svg2.opacity : SQUIGGLE_CONFIG.desktop.opacity;

    return (
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflowX: 'clip', zIndex: 0, color: 'var(--ns-body-color, #1a1a1a)' }}>

            <div ref={svg1Ref} className="ns-squiggle ns-squiggle-1" style={{
                position: "absolute",
                top: config1.top,
                right: config1.right,
                bottom: config1.bottom,
                left: config1.left,
                width: config1.width,
                height: isMobile ? 'auto' : '100%',
                opacity: activeOpacity1,
                pointerEvents: "none",
                minWidth: config1.minWidth,
                filter: squiggleFilter
            }}>
                <picture>
                    <source media="(max-width: 768px)" srcSet={mobileSquiggle1} />
                    <img src={desktopSquiggle1} alt="" style={{ width: '100%', height: isMobile ? 'auto' : '100%', display: 'block' }} />
                </picture>
            </div>

            <div ref={svg2Ref} className="ns-squiggle ns-squiggle-2" style={{
                position: "absolute",
                top: config2.top,
                right: config2.right,
                bottom: config2.bottom,
                left: config2.left,
                width: config2.width,
                height: isMobile ? 'auto' : '100%',
                opacity: activeOpacity2,
                pointerEvents: "none",
                minWidth: config2.minWidth,
                filter: squiggleFilter
            }}>
                <picture>
                    <source media="(max-width: 768px)" srcSet={mobileSquiggle2} />
                    <img src={desktopSquiggle2} alt="" style={{ width: '100%', height: isMobile ? 'auto' : '100%', display: 'block' }} />
                </picture>
            </div>
        </div>
    );
}
