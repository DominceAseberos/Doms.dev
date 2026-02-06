import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LiquidBackground = ({ children, className = "", innerRef }) => {
    const glows = useRef([]);
    const container = useRef(null);

    useGSAP(() => {
        // Glow animations
        glows.current.forEach((glow, i) => {
            gsap.to(glow, {
                x: i % 2 === 0 ? "15%" : "-15%",
                y: i % 2 === 0 ? "-10%" : "10%",
                duration: 10 + i * 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(glow, {
                scale: 1.2,
                duration: 5 + i * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });
    }, { scope: container });

    return (
        <div
            ref={(node) => {
                container.current = node;
                if (innerRef) {
                    if (typeof innerRef === 'function') innerRef(node);
                    else innerRef.current = node;
                }
            }}
            className={`relative overflow-hidden ${className}`}
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            {/* Liquid Background Glows */}
            <div
                ref={el => glows.current[0] = el}
                className="absolute -top-1/2 -right-1/4 w-[120%] h-[120%] bg-blue-500/10 blur-[30px] md:blur-[50px] rounded-full pointer-events-none transform-gpu"
            />
            <div
                ref={el => glows.current[1] = el}
                className="absolute -bottom-1/2 -left-1/4 w-[120%] h-[120%] bg-purple-500/10 blur-[30px] md:blur-[50px] rounded-full pointer-events-none transform-gpu"
            />

            {/* Content Container - Ensure z-index puts it above glows */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default LiquidBackground;
