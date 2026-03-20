import React, { useRef, useLayoutEffect, forwardRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DisplayName from './DisplayName';
import ProfileMorphCard from './ProfileMorphCard';
import { FiGithub } from 'react-icons/fi';
import { fetchAboutData } from '../shared/aboutService';
import useLoadingStore from '../store/useLoadingStore';
import useThemeStore from '../store/useThemeStore';
import humanPortrait from '../assets/human-cutout.png';
import animePortrait from '../assets/anime-cutout.png';
import './AboutSection.css';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const AboutSection = forwardRef(({ narrativeRef, ...props }, ref) => {
    const location = useLocation();
    const isAboutPage = location.pathname === '/about';
    const sectionRef = useRef(null);
    const stripesRef = useRef([]);
    const headerRef = useRef(null);
    const textRef = useRef(null);
    const cardRef = useRef(null);

    const stripeCount = 20;
    const isLoading = useLoadingStore((state) => state.isLoading);
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';

    const [aboutData, setAboutData] = useState({ resume: '/resume.pdf', cv: '/resume.pdf' });

    useEffect(() => {
        const loadAbout = async () => {
            try {
                const data = await fetchAboutData();
                setAboutData(data);
            } catch (err) {
                console.error("Failed to fetch about data for AboutSection", err);
            }
        };
        loadAbout();
    }, []);

    useLayoutEffect(() => {
        if (isLoading) return;

        let ctx = gsap.context(() => {
            gsap.set(headerRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)" });
            gsap.set(textRef.current, { opacity: 0, y: 30 });
            if (cardRef.current) gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.92 });
            
            if (isAboutPage && narrativeRef && narrativeRef.current) {
                gsap.set(narrativeRef.current, { opacity: 0, y: 40 });
            }

            const tlConfig = isAboutPage 
                ? { delay: 0.2 } 
                : {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=1500",
                        pin: true,
                        scrub: 1,
                    }
                  };

            const tl = gsap.timeline(tlConfig);

            tl.to(stripesRef.current, {
                xPercent: (i) => i % 2 === 0 ? 100 : -100,
                duration: isAboutPage ? 1.5 : 0.5,
                ease: "power2.inOut",
                stagger: {
                    amount: 0.8,
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

            if (isAboutPage && narrativeRef && narrativeRef.current) {
                tl.to(narrativeRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out"
                }, "-=0.6");
            }

        }, sectionRef);

        return () => ctx.revert();
    }, [isLoading, isAboutPage]);

    const addToStripes = (el) => {
        if (el && !stripesRef.current.includes(el)) {
            stripesRef.current.push(el);
        }
    };

    return (
        <section
            id="about-hero"
            ref={(el) => { sectionRef.current = el; if (ref) ref.current = el; }}
            className={`relative w-full bg-transparent flex z-50 ${isAboutPage ? 'pt-12 pb-0 sm:pt-16 sm:pb-0 items-start justify-start' : 'py-24 sm:py-32 min-h-screen items-center justify-center'}`}
            style={isAboutPage ? { minHeight: '82vh' } : {}}
        >
            <div className="absolute inset-x-0 top-0 z-[100] pointer-events-none flex flex-col overflow-hidden" style={{ height: '100vh' }}>
                {Array.from({ length: stripeCount }).map((_, i) => (
                    <div
                        key={i}
                        ref={addToStripes}
                        className="w-full"
                        style={{ height: `${100 / stripeCount}%`, backgroundColor: isLight ? (i % 2 === 0 ? '#e6f7d9' : '#f2ede6') : '#505255' }}
                    />
                ))}
            </div>

            <div className={`w-full relative z-10 ${isAboutPage ? 'max-w-[1400px] mx-auto px-6 md:px-16' : 'max-w-5xl px-6'}`}>
                {isAboutPage ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-20 items-center mt-6 sm:mt-14">
                        {/* Left column: name + bio + tags */}
                        <div ref={headerRef} className="flex flex-col gap-6">
                            <DisplayName
                                as="h2"
                                staticMode
                                className="about-name-compact"
                            />
                            <div ref={textRef} className="flex flex-col gap-8">
                                {/* Bio text was removed here to prevent multiple introductions on the About page */}
                                <div className="flex flex-wrap gap-2 sm:gap-4">
                                    {['Creative Dev', 'React', 'GSAP', 'Next.js', 'UI Architect'].map((tag) => (
                                        <span key={tag} className="ui-pill px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 backdrop-blur-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="about-hero-actions pt-2">
                                    <a
                                        href={aboutData.resume}
                                        download
                                        className="btn-primary"
                                    >
                                        Download Resume
                                    </a>
                                    <a
                                        href={aboutData.cv}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-ghost"
                                    >
                                        Open CV
                                    </a>
                                    <a
                                        href="https://github.com/Domince07"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-ghost btn-github"
                                        aria-label="GitHub Profile"
                                    >
                                        <FiGithub size={20} />
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
                                className={`font-black uppercase tracking-tighter leading-[1] text-center ${isLight ? 'text-[#121212]' : 'text-white'}`}
                                style={{ fontSize: 'clamp(1.5rem, 5.5vw, 6rem)' }}
                            >
                                Built with 
                                <span className={`drop-shadow-[0_0_20px_rgba(200,255,62,0.3)] ${isLight ? 'text-[var(--accent)]' : 'text-[#c8ff3e]'}`}>
                                    {' '}Motion{' '}
                                </span>
                                + Code.
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
                                    className={`inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 ${isLight ? 'text-white bg-[#121212] hover:bg-[var(--accent)] hover:text-black' : 'text-[#505255] bg-[#c8ff3e] hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}
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
