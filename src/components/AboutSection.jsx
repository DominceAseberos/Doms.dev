import React, { useRef, useLayoutEffect, forwardRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DisplayName from './DisplayName';
import ProfileMorphCard from './ProfileMorphCard';
import humanPortrait from '../assets/human-cutout.png';
import animePortrait from '../assets/anime-cutout.png';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const AboutSection = forwardRef((props, ref) => {
    const location = useLocation();
    const isAboutPage = location.pathname === '/about';
    const sectionRef = useRef(null);
    const stripesRef = useRef([]);
    const headerRef = useRef(null);
    const textRef = useRef(null);
    const cardRef = useRef(null);

    const stripeCount = 20;

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1500",
                    pin: true,
                    scrub: 1,
                }
            });

            gsap.set(headerRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)" });
            gsap.set(textRef.current, { opacity: 0, y: 30 });
            if (cardRef.current) gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.92 });

            tl.to(stripesRef.current, {
                xPercent: (i) => i % 2 === 0 ? 100 : -100,
                ease: "power2.inOut",
                stagger: {
                    amount: 0.6,
                    from: "center"
                }
            })
                .to(headerRef.current, {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.2")
                .to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.6")
                .to(cardRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.1,
                    ease: "power2.out"
                }, "-=0.8");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToStripes = (el) => {
        if (el && !stripesRef.current.includes(el)) {
            stripesRef.current.push(el);
        }
    };

    return (
        <section
            id="about-hero"
            ref={(el) => { sectionRef.current = el; if (ref) ref.current = el; }}
            className={`relative w-full bg-transparent flex z-10 ${isAboutPage ? 'pt-14 pb-4 sm:pt-16 sm:pb-6 items-start justify-start' : 'py-24 sm:py-32 min-h-screen items-center justify-center'}`}
            style={isAboutPage ? { minHeight: 'calc(100vh - 240px)' } : {}}
        >
            <div className="absolute inset-x-0 top-0 z-20 pointer-events-none flex flex-col overflow-hidden" style={{ height: '100vh' }}>
                {Array.from({ length: stripeCount }).map((_, i) => (
                    <div
                        key={i}
                        ref={addToStripes}
                        className="w-full bg-[#505255]"
                        style={{ height: `${100 / stripeCount}%` }}
                    />
                ))}
            </div>

            <div className={`w-full relative z-10 ${isAboutPage ? 'max-w-[1400px] mx-auto px-6 md:px-16' : 'max-w-5xl px-6'}`}>
                {isAboutPage ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center mt-10 sm:mt-14">
                        {/* Left column: name + bio + tags */}
                        <div ref={headerRef} className="flex flex-col gap-10">
                            <DisplayName
                                as="h2"
                                staticMode
                                className="about-name-compact"
                            />
                            <div ref={textRef} className="flex flex-col gap-8">
                                <div className="space-y-6 ui-body-copy text-base sm:text-lg md:text-xl">
                                    <p>
                                        I'm Domince Aseberos, and I build interactive web experiences powered by GSAP, React, and modern frontend architecture. I focus on smooth motion, clean UI systems, and performance-first implementation.
                                    </p>
                                    <p>
                                        Beyond frontend motion work, I also build full-stack applications and design custom SVG assets to match each product's visual identity. From concept to deployment, I create end-to-end digital products that look sharp and feel alive.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:gap-4">
                                    {['Creative Dev', 'React', 'GSAP', 'Next.js', 'UI Architect'].map((tag) => (
                                        <span key={tag} className="ui-pill px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 backdrop-blur-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <a
                                        href="/resume.pdf"
                                        download
                                        className="inline-flex items-center justify-center font-bold text-xs sm:text-sm uppercase tracking-[0.18em] text-[#0c0c0c] bg-[#c8ff3e] px-6 sm:px-8 py-3.5 rounded-full hover:bg-white hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(200,255,62,0.24)] hover:shadow-[0_0_36px_rgba(255,255,255,0.22)]"
                                    >
                                        Download Resume
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Right column: profile card */}
                        <div ref={cardRef} className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] aspect-[3/4] flex-shrink-0 mx-auto lg:mx-0">
                            <ProfileMorphCard
                                realSrc={humanPortrait}
                                animeSrc={animePortrait}
                                alt="Domince portrait"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 items-center">
                        <div ref={headerRef} className="w-full">
                            <h2
                                className="font-black uppercase tracking-tighter text-white leading-[1] text-center"
                                style={{ fontSize: 'clamp(1.5rem, 5.5vw, 6rem)' }}
                            >
                                Built with{' '}
                                <span className="text-[#c8ff3e] drop-shadow-[0_0_20px_rgba(200,255,62,0.3)]">
                                    Motion + Code.
                                </span>
                            </h2>
                        </div>
                        <div ref={textRef} className="w-full max-w-3xl flex flex-col items-center">
                            <div className="space-y-6 ui-body-copy text-base sm:text-lg md:text-xl text-center">
                                <p>
                                    I'm Domince Aseberos, and I build interactive web experiences powered by GSAP, React, and modern frontend architecture. I focus on smooth motion, clean UI systems, and performance-first implementation.
                                </p>
                                <p>
                                    Beyond frontend motion work, I also build full-stack applications and design custom SVG assets to match each product's visual identity. From concept to deployment, I create end-to-end digital products that look sharp and feel alive.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-4 pt-8 sm:pt-10 justify-center">
                                {['Creative Dev', 'React', 'GSAP', 'Next.js', 'UI Architect'].map((tag) => (
                                    <span key={tag} className="ui-pill px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 backdrop-blur-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="pt-12 sm:pt-16">
                                <a
                                    href="/about"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest text-[#505255] bg-[#c8ff3e] px-8 py-4 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                                >
                                    More about me ↗
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
});

export default AboutSection;
