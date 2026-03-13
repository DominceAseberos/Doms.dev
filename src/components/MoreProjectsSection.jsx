import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MoreProjectsSection.css';

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MagneticImage = ({ rotateMultiplier = 2, offsetClass, placeholderText, fwdRef }) => {
    const imgRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
    };

    let rotateX = 0;
    let rotateY = 0;

    if (isHovered && imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        rotateX = -((mousePos.y - centerY) / centerY) * rotateMultiplier;
        rotateY = ((mousePos.x - centerX) / centerX) * rotateMultiplier;
    }

    return (
        <div
            ref={(el) => {
                imgRef.current = el;
                if (fwdRef) fwdRef(el);
            }}
            className={`relative w-full aspect-video rounded-xl shadow-lg transition-transform duration-200 ease-out flex items-center justify-center overflow-hidden group cursor-pointer border border-[#ffffff10] ${offsetClass} bg-black/40`}
            style={{
                transform: isHovered
                    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Hover Backlight */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0 bg-transparent flex items-center justify-center"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(200,255,62,0.1), transparent 80%)`
                }}
            />

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
                <span className="text-gray-400 font-mono text-sm tracking-widest uppercase opacity-70 bg-black/50 px-3 py-1 rounded-full group-hover:text-[#c8ff3e] transition-colors">{placeholderText}</span>
            </div>
        </div>
    );
};

const MoreProjectsSection = () => {
    const sectionRef = useRef(null);
    const textRef1 = useRef(null);
    const textRef2 = useRef(null);
    const btnRef = useRef(null);
    const imgRefs = useRef([]);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top", // Pin exactly when top hits top
                    end: "+=1500", // Scroll distance for the animation
                    pin: true,
                    scrub: 1, // Smooth scrubbing
                }
            });

            // Initial states for animation
            gsap.set([textRef1.current, textRef2.current, btnRef.current], {
                y: 100,
                opacity: 0
            });

            gsap.set(imgRefs.current, {
                scale: 0.8,
                opacity: 0,
                x: (i) => i === 0 ? 100 : (i === 1 ? -100 : 100),
                y: (i) => i === 0 ? 0 : 100
            });

            // Sequence
            tl.to([textRef1.current, textRef2.current, btnRef.current], {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "power3.out"
            }, 0)
                .to(imgRefs.current, {
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, 0.2); // Start slightly after text starts

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToImgRefs = (el) => {
        if (el && !imgRefs.current.includes(el)) {
            imgRefs.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className="relative min-h-[100vh] bg-[#505255] flex items-center pt-24 pb-24 z-20 overflow-hidden">
            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Left Side: Explanatory Text & CTA */}
                    <div className="w-full lg:w-1/2">
                        <h2 ref={textRef1} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[#f2ede6]">More Projects</h2>
                        <p ref={textRef2} className="text-xl text-[#b8b2a8] mb-8 leading-relaxed max-w-lg">
                            Beyond the highlighted case studies, I have an extensive archive of professional work, freelance gigs, and side ventures. Explore the full catalog to see the breadth of my capabilities.
                        </p>
                        <div ref={btnRef}>
                            <a
                                href="/projects"
                                className="inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest text-white border border-white/20 bg-transparent px-8 py-4 rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                            >
                                View All Projects ↗
                            </a>
                        </div>
                    </div>

                    {/* Right Side: 3 Image Previews */}
                    <div className="w-full lg:w-1/2 relative">
                        {/* We use a creative grid to display 3 preview images */}
                        <div className="grid grid-cols-2 gap-4 auto-rows-[160px] md:auto-rows-[200px]">
                            <MagneticImage
                                fwdRef={addToImgRefs}
                                placeholderText="Project Preview 1"
                                offsetClass="col-span-2 row-span-1"
                            />
                            <MagneticImage
                                fwdRef={addToImgRefs}
                                placeholderText="Project Preview 2"
                                offsetClass="col-span-1 row-span-1"
                                rotateMultiplier={6}
                            />
                            <MagneticImage
                                fwdRef={addToImgRefs}
                                placeholderText="Project Preview 3"
                                offsetClass="col-span-1 row-span-1"
                                rotateMultiplier={6}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MoreProjectsSection;
