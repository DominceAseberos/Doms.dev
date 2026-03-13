import React, { useRef, useState } from 'react';
import './LabSection.css';

const LabCard = ({ title, desc, offsetClass }) => {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
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

    if (isHovered && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max rotation 8 degrees
        rotateX = -((mousePos.y - centerY) / centerY) * 8;
        rotateY = ((mousePos.x - centerX) / centerX) * 8;
    }

    return (
        <div
            ref={cardRef}
            className={`p-6 lab-card rounded-2xl shadow-sm transition-transform duration-200 ease-out flex flex-col items-start relative overflow-hidden group ${offsetClass}`}
            style={{
                transform: isHovered
                    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Mouse Tracking Glow Background */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.08), transparent 80%)`
                }}
            />

            <div className="h-48 lab-image-placeholder rounded-xl w-full mb-6 flex items-center justify-center relative z-10 transition-colors group-hover:bg-black/30">
                <span className="text-gray-400 font-mono text-sm">Preview Image</span>
            </div>
            <h3 className="text-xl font-bold mb-2 lab-card-title relative z-10">{title}</h3>
            <p className="text-sm lab-card-desc mb-6 relative z-10 flex-grow">{desc}</p>
            <a href="#" className="font-bold text-xs uppercase tracking-wider text-black bg-[#c8ff3e] px-4 py-2 rounded-full hover:bg-black hover:text-[#c8ff3e] transition-colors relative z-10 mt-auto">View Code ↗</a>
        </div>
    );
};

const labProjects = [
    {
        title: "WebGPU Compute",
        desc: "Fluid simulation running natively in the browser using WebGPU.",
        offsetClass: "lg:mt-0"
    },
    {
        title: "CSS 3D Engine",
        desc: "A simple 3D rendering engine built without WebGL, using only CSS transforms.",
        offsetClass: "lg:mt-12"
    },
    {
        title: "Rust Wasm Parser",
        desc: "High-performance markdown parser compiled to WebAssembly from Rust.",
        offsetClass: "lg:mt-24"
    }
];

const LabSection = () => {
    return (
        <section className="relative min-h-screen lab-section-bg flex items-center justify-center pt-32 pb-32 z-20">
            <div className="container max-w-6xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 lab-title">The Lab</h2>
                    <p className="text-lg lab-subtitle max-w-2xl">Smaller experiments, prototypes, and open source contributions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {labProjects.map((project, index) => (
                        <LabCard
                            key={index}
                            title={project.title}
                            desc={project.desc}
                            offsetClass={project.offsetClass}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LabSection;
