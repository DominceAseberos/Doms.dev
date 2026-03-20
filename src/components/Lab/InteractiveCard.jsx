import React, { useRef, useState } from 'react';
import ParticleMesh from '../ParticleMesh';
import useThemeStore from '../../store/useThemeStore';

const InteractiveCard = ({ children, className = "", containerClassName = "" }) => {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';

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

        // Gentle rotation
        rotateX = -((mousePos.y - centerY) / centerY) * 4;
        rotateY = ((mousePos.x - centerX) / centerX) * 4;
    }

    return (
        <div className={`relative w-full ${containerClassName}`}>
            <div
                ref={cardRef}
                className={`relative w-full aspect-[4/3] rounded-3xl transition-transform duration-200 ease-out flex items-center justify-center overflow-hidden group cursor-pointer ${isLight ? 'bg-[#f8fafc] border border-[rgba(0,0,0,0.05)] shadow-2xl' : 'bg-[#1a1c1e] border border-[rgba(255,255,255,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(200,255,62,0.02)]'} ${className}`}
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
                        background: isLight
                            ? `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(200,255,62,0.18), transparent 80%)`
                            : `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(200,255,62,0.15), transparent 80%)`
                    }}
                />

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default InteractiveCard;
