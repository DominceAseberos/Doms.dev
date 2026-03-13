import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleMesh from './ParticleMesh';
import './LabSection.css';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const LabSection = () => {
    const sectionRef = useRef(null);
    const rightColRef = useRef(null);
    const previewRef = useRef(null);
    const tagsRef = useRef([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const tags = [
        { label: "UI components", x: "10%", y: "15%" },
        { label: "Prototypes", x: "85%", y: "20%" },
        { label: "Experiments", x: "15%", y: "85%" },
        { label: "AI", x: "80%", y: "80%" },
        { label: "Fun", x: "50%", y: "10%" }
    ];

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            mm.add({
                isDesktop: '(min-width: 1025px)',
                isMobileOrTablet: '(max-width: 1024px)'
            }, (context) => {
                let { isDesktop, isMobileOrTablet } = context.conditions;

                if (isDesktop) {
                    // Pin entire section on desktop
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=200%", // Longer pin for better sequencing
                            pin: true,
                            scrub: 1,
                            anticipatePin: 1,
                            onRefresh: self => {
                                if (self.spacer) self.spacer.style.backgroundColor = "#505255";
                            }
                        }
                    });

                    // Animate tags one by one
                    tagsRef.current.forEach((tag, i) => {
                        const targetPos = tags[i];
                        tl.to(tag, {
                            opacity: 1,
                            scale: 1,
                            left: targetPos.x,
                            top: targetPos.y,
                            duration: 0.5,
                            ease: "back.out(1.7)"
                        }, i / tags.length); // Spaced out along the scrub
                    });

                } else if (isMobileOrTablet && rightColRef.current) {
                    // Pin the entire section exactly when the card reaches the center
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: rightColRef.current,
                            start: "center center",
                            end: "+=200%",
                            pin: sectionRef.current,
                            scrub: 1,
                            anticipatePin: 1,
                            onRefresh: self => {
                                if (self.spacer) self.spacer.style.backgroundColor = "#505255";
                            }
                        }
                    });

                    // Animate tags one by one on mobile
                    tagsRef.current.forEach((tag, i) => {
                        const targetPos = { ...tags[i] };

                        // Pull tags in from the edges on mobile to prevent clipping
                        if (targetPos.x === "10%") targetPos.x = "18%";
                        if (targetPos.x === "85%") targetPos.x = "80%";
                        if (targetPos.x === "15%") targetPos.x = "22%";
                        if (targetPos.x === "80%") targetPos.x = "75%";

                        tl.to(tag, {
                            opacity: 1,
                            scale: 1,
                            left: targetPos.x,
                            top: targetPos.y,
                            duration: 0.5,
                            ease: "back.out(1.7)"
                        }, i / tags.length);
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e) => {
        if (!previewRef.current) return;
        const rect = previewRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
    };

    // Calculate rotation for Magnetic Tilt
    let rotateX = 0;
    let rotateY = 0;

    if (isHovered && previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Gentle rotation
        rotateX = -((mousePos.y - centerY) / centerY) * 4;
        rotateY = ((mousePos.x - centerX) / centerX) * 4;
    }

    return (
        <section ref={sectionRef} className="relative min-h-screen lab-section-bg flex items-center justify-center pt-32 pb-32 z-20 overflow-hidden">
            {/* Decorative Inner Polygons */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-[80%] h-full bg-[#494b4e]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)' }}
                ></div>
                <div
                    className="absolute top-[10%] left-0 w-[40%] h-[60%] bg-[#c8ff3e] opacity-[0.03]"
                    style={{ clipPath: 'polygon(0 0, 100% 20%, 75% 100%, 0 100%)' }}
                ></div>
            </div>

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Left Side: Explanatory Text & CTA */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 lab-title">The Sandbox</h2>
                        <p className="text-xl lab-subtitle mb-8 leading-relaxed max-w-lg">
                            This is where I throw code at the wall to see what sticks. A collection of experimental concepts, personal prototypes, and fun passion projects built purely for the joy of creation.
                        </p>
                        <a
                            href="/lab"
                            className="inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest text-[#505255] bg-[#c8ff3e] px-8 py-4 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(200,255,62,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                        >
                            Enter The Lab ↗
                        </a>
                    </div>

                    {/* Right Side: Magnetic Preview Card */}
                    <div ref={rightColRef} className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                        {/* Floating Tags */}
                        {tags.map((tag, i) => (
                            <div
                                key={i}
                                ref={el => tagsRef.current[i] = el}
                                className="floating-tag"
                                style={{ top: '50%', left: '50%' }}
                            >
                                {tag.label}
                            </div>
                        ))}

                        <div
                            ref={previewRef}
                            className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl lab-card shadow-lg transition-transform duration-200 ease-out flex items-center justify-center overflow-hidden group cursor-pointer z-10"
                            style={{
                                transform: isHovered
                                    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
                                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Particle Mesh Background */}
                            <ParticleMesh mouseX={mousePos.x} mouseY={mousePos.y} isHovered={isHovered} />

                            {/* Hover Backlight */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
                                style={{
                                    opacity: isHovered ? 1 : 0,
                                    background: `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(200,255,62,0.15), transparent 80%)`
                                }}
                            />

                            {/* Animated Abstract Preview Graphic */}
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-500">
                                <div className="w-24 h-24 border border-[rgba(200,255,62,0.3)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,255,62,0.1)] group-hover:shadow-[0_0_50px_rgba(200,255,62,0.3)] transition-shadow duration-500">
                                    <div className="w-10 h-10 bg-[#c8ff3e] rounded-full blur-sm opacity-80 animate-ping"></div>
                                </div>
                                <span className="text-gray-300 font-mono text-sm tracking-widest uppercase opacity-70">Interactive Preview</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LabSection;
