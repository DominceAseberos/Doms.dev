import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useThemeStore from '../store/useThemeStore';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ContactSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Simple fade and float up for the final footer elements
            gsap.fromTo(contentRef.current.children, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1, 
                    stagger: 0.2, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%", // Start revealing when footer enters the screen
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full min-h-[60vh] bg-transparent flex items-center justify-center z-10 py-32">
            
            {/* The Black Contact Section Content */}
            <div ref={contentRef} className="relative z-10 text-center text-white px-6">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-[var(--accent)] drop-shadow-[0_0_20px_rgba(200,255,62,0.1)]">
                    Let's Build It.
                </h2>
                <p className="ui-body-copy text-base md:text-lg mb-12 max-w-4xl mx-auto">
                    Transforming complex code into high-performance digital magic that captivates, converts, and defies the ordinary.
                </p>

                <a 
                    href="/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center font-bold text-lg uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 ${isLight ? 'text-white bg-[#121212] hover:bg-[var(--accent)] hover:text-black' : 'text-[#505255] bg-[#c8ff3e] hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}
                >
                    Get In Touch ↗
                </a>

                <div className="mt-20 flex justify-center gap-8 text-xs text-white/65 uppercase tracking-[0.14em] font-semibold">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>

        </section>
    );
};

export default ContactSection;
