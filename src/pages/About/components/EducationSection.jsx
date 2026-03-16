import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import umtcLogo from '../../../assets/umtc-logopng.webp';
import './EducationSection.css';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const EducationSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const headingRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Stagger fade-in for content children
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Parallax: heading rises as section enters viewport
            gsap.fromTo(
                headingRef.current,
                { y: 150 },
                {
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'top 20%',
                        scrub: 1.2,
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="education-section relative w-full min-h-screen bg-transparent flex items-center justify-center z-10 py-16">
            <div ref={contentRef} className="relative z-10 text-white px-6 md:px-16 w-full max-w-[1400px] flex flex-col items-start">
                <h2
                    ref={headingRef}
                    className="font-bold uppercase tracking-tight text-[var(--accent)]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 8vw, 8rem)", lineHeight: 1.1 }}
                >
                    <span className="es-heading-name">Educational</span> Background
                </h2>
                <p className="ui-sub-label md:text-sm mb-10 leading-relaxed text-left">
                    Academic Foundation
                </p>

                <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(280px,560px)_1fr] gap-8 lg:gap-14 items-center">
                    <div className="es-logo-card w-full rounded-3xl p-5 md:p-6">
                        <img
                            src={umtcLogo}
                            alt="University of Mindanao Tagum City"
                            className="es-logo-img w-full rounded-xl"
                        />
                    </div>

                    <div className="w-full flex flex-col items-start justify-center text-left">
                        <div className="space-y-4 md:space-y-5 max-w-2xl">
                            <h3 className="es-institution-name text-2xl md:text-4xl font-bold tracking-tight">
                                University of Mindanao Tagum City
                            </h3>
                            <p className="es-degree-text text-sm md:text-base uppercase tracking-[0.12em] font-medium">
                                Bachelor of Science in Computer Science
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
