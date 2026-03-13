import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const AboutSection = () => {
    const sectionRef = useRef(null);
    const stripesRef = useRef([]);
    const headerRef = useRef(null);
    const textRef = useRef(null);

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
                }, "-=0.6");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToStripes = (el) => {
        if (el && !stripesRef.current.includes(el)) {
            stripesRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen bg-transparent overflow-hidden flex items-center justify-center z-10 py-24 sm:py-32">
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
                {Array.from({ length: stripeCount }).map((_, i) => (
                    <div
                        key={i}
                        ref={addToStripes}
                        className="w-full bg-[#505255]"
                        style={{ height: `${100 / stripeCount}%` }}
                    />
                ))}
            </div>

            <div className="container max-w-5xl mx-auto px-6 relative z-10">
                <div className="flex flex-col gap-12 sm:gap-16 lg:gap-24 items-center">
                    <div ref={headerRef} className="w-full">
                        <h2
                            className="font-black uppercase tracking-tighter text-white leading-[1] text-center"
                            style={{ fontSize: 'clamp(1.5rem, 5.5vw, 6rem)' }}
                        >
                            Built on{' '}
                            <span className="text-[#c8ff3e] drop-shadow-[0_0_20px_rgba(200,255,62,0.3)]">
                                Curiosity.
                            </span>
                        </h2>
                    </div>

                    <div ref={textRef} className="w-full max-w-3xl flex flex-col items-center">
                        <div className="space-y-6 text-gray-400 text-base sm:text-lg md:text-xl font-light leading-relaxed text-center">
                            <p>
                                I'm Domince—a digital craftsman obsessed with the intersection of performance and poetry in code. For me, every project is an opportunity to solve an impossible puzzle.
                            </p>
                            <p>
                                My workflow is anchored in high-speed experimentation and a relentless drive for architectural elegance. I don't just build websites; I engineer fluid, interactive environments that resonate with users.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-4 pt-8 sm:pt-10 justify-center">
                            {['Creative Dev', 'React', 'GSAP', 'Next.js', 'UI Architect'].map((tag) => (
                                <span key={tag} className="text-white/20 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/5 hover:border-[#c8ff3e]/30 hover:text-white transition-all duration-300 backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="pt-12 sm:pt-16">
                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest text-[#505255] bg-[#c8ff3e] px-8 py-4 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                            >
                                More about me ↗
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
