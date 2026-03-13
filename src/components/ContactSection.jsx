import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ContactSection = () => {
    const sectionRef = useRef(null);
    const stripesRef = useRef([]);
    const contentRef = useRef(null);

    const stripeCount = 20;

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=1500", // Control the speed/length of the transition
                    pin: true,
                    scrub: 1,
                }
            });

            // Set initial state of contact content
            gsap.set(contentRef.current, { opacity: 0, scale: 0.9, y: 50 });

            // Animate stripes flying apart (Reverse Warp)
            tl.to(stripesRef.current, {
                xPercent: (i) => i % 2 === 0 ? 100 : -100, // Alternate left/right
                ease: "power3.inOut",
                stagger: {
                    amount: 0.5,
                    from: "center" // Start opening from the middle like an eye
                }
            })
                // Animate content fading in
                .to(contentRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.2"); // Start fading in while stripes are finishing

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToStripes = (el) => {
        if (el && !stripesRef.current.includes(el)) {
            stripesRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-transparent overflow-hidden flex items-center justify-center -mt-32 z-10 pt-32">

            {/* The Reverse Warp Stripes Overlay (Matched to the gray #505255 of previous section) */}
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

            {/* The Black Contact Section Content */}
            <div ref={contentRef} className="relative z-10 text-center text-white px-6">
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-[#c8ff3e] drop-shadow-[0_0_20px_rgba(200,255,62,0.3)]">
                    Let's Build It.
                </h2>
                <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
                    The lab is always open. Whether you have a project in mind, an idea to explore, or just want to connect—drop a line.
                </p>

                <a
                    href="mailto:hello@example.com"
                    className="inline-flex items-center justify-center font-bold text-lg uppercase tracking-widest text-[#505255] bg-[#c8ff3e] px-10 py-5 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                    Get In Touch ↗
                </a>

                <div className="mt-20 flex justify-center gap-8 text-sm text-gray-500 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>

        </section>
    );
};

export default ContactSection;
