import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import umtcLogo from '../../../assets/umtc-logopng.webp';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const EducationSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
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
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen bg-transparent flex items-center justify-center z-10 py-16">
            <div ref={contentRef} className="relative z-10 text-center text-white px-6 w-full max-w-5xl flex flex-col items-center">
                <h2
                    className="font-black uppercase tracking-tighter mb-6 text-[#c8ff3e] drop-shadow-[0_0_20px_rgba(200,255,62,0.3)] leading-[1] text-center mx-auto"
                    style={{ fontSize: 'clamp(1.5rem, 5.5vw, 6rem)' }}
                >
                    Educational Background
                </h2>
                <p className="font-mono text-[10px] md:text-sm text-white/30 uppercase tracking-[0.4em] mb-10 max-w-4xl mx-auto font-bold leading-relaxed text-center">
                    Academic Foundation
                </p>

                <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8">
                    <img
                        src={umtcLogo}
                        alt="University of Mindanao Tagum City"
                        className="w-full max-w-[560px] mx-auto rounded-xl border border-white/10"
                    />

                    <div className="mt-8 space-y-4 text-center">
                        <h3 className="text-2xl md:text-4xl font-bold text-[#f2ede6] tracking-tight">
                            University of Mindanao Tagum City
                        </h3>
                        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-white/50">
                            Bachelor of Science in Computer Science
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
