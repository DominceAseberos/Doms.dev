import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedFaceSvg from './AnimatedFaceSvg';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedFace({ style, className, duration = 2.5, delay = 0 }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const path = svgRef.current.querySelector('path');
        if (!path) return;

        // Ensure path uses stroke for drawing and sets up the 1000-unit path length
        gsap.set(path, {
            fill: 'transparent',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeDasharray: 1000,
            strokeDashoffset: 1000
        });

        // Initialize timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: svgRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none' // Play once when it enters view
            }
        });

        // Ensure container is visible before starting
        gsap.set(svgRef.current, { opacity: 1 });

        // Draw the stroke
        tl.to(path, {
            strokeDashoffset: 0,
            duration: duration,
            delay: delay,
            ease: 'power2.inOut'
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [duration, delay]);

    return (
        <AnimatedFaceSvg
            ref={svgRef}
            className={className}
            style={{ ...style, opacity: 0 }} // Start invisible until GSAP takes over
        />
    );
}
