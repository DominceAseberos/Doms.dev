import React, { useRef, useState } from 'react';
import './LabSection.css';

const LabSection = () => {
    const previewRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

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
        <section className="relative min-h-screen lab-section-bg flex items-center justify-center pt-32 pb-32 z-20 overflow-hidden">
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
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div
                            ref={previewRef}
                            className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl lab-card shadow-lg transition-transform duration-200 ease-out flex items-center justify-center overflow-hidden group cursor-pointer"
                            style={{
                                transform: isHovered
                                    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
                                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
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
