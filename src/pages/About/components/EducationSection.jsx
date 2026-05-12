import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import umtcLogo from '../../../assets/umtc-logopng.webp';
import { fetchAboutData } from '../../../shared/aboutService';
import aboutDataDefault from '../../../data/aboutData.json';
import './EducationSection.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const EducationSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const headingRef = useRef(null);

    const [education, setEducation] = useState(
        () => aboutDataDefault.education || []
    );

    useEffect(() => {
        fetchAboutData()
            .then(d => setEducation(d.education || []))
            .catch(() => {});
    }, []);

    useLayoutEffect(() => {
        if (!contentRef.current || !headingRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
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
                    },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    if (!education.length) return null;

    return (
        <section ref={sectionRef} className="education-section relative w-full bg-transparent flex items-center justify-center z-10 py-16">
            <div ref={contentRef} className="relative z-10 text-white px-6 md:px-16 w-full max-w-[1400px] flex flex-col items-start gap-10">

                <div>
                    <h2
                        ref={headingRef}
                        className="font-bold uppercase tracking-tight text-[var(--accent)]"
                        style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', lineHeight: 1.15 }}
                    >
                        <span className="es-heading-name">Educational</span> Background
                    </h2>
                    <p className="ui-sub-label mt-1">Academic Foundation</p>
                </div>

                {education.map((entry, i) => (
                    <div key={i} className="w-full grid grid-cols-1 lg:grid-cols-[minmax(280px,480px)_1fr] gap-8 lg:gap-14 items-center">
                        {/* Logo / visual */}
                        <div className="es-logo-card w-full rounded-3xl p-5 md:p-6">
                            <img
                                src={umtcLogo}
                                alt={entry.institution}
                                className="es-logo-img w-full rounded-xl"
                            />
                        </div>

                        {/* Info */}
                        <div className="w-full flex flex-col items-start justify-center text-left">
                            <div className="space-y-3 max-w-2xl">
                                <h3 className="es-institution-name text-lg md:text-2xl font-bold tracking-tight">
                                    {entry.institution}
                                </h3>
                                <p className="es-degree-text text-xs uppercase tracking-[0.12em] font-medium">
                                    {entry.degree}
                                </p>
                                {entry.period && (
                                    <p className="ui-sub-label text-[10px]">{entry.period}</p>
                                )}
                                {(entry.skills || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {entry.skills.map((skill) => (
                                            <span key={skill} className="ui-pill px-3 py-1 rounded-full text-[10px] md:text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EducationSection;
