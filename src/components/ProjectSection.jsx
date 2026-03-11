import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import './ProjectSection.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "Luminary OS",
        desc: "A conceptual operating system interface built entirely in the browser. Features a custom window manager, virtual file system, and WebGL-accelerated compositor.",
        status: "Active",
        statusClass: "badge-live",
        tech: ["React", "WebGL", "Framer Motion", "Zustand"],
        colors: [["#0f172a", "#1e1b4b"]]
    },
    {
        title: "Vanta Protocol",
        desc: "Decentralized data visualizer for high-frequency trading. WebSockets stream live order book data into a custom WebGL instanced rendering engine.",
        status: "In Progress",
        statusClass: "badge-wip",
        tech: ["TypeScript", "Three.js", "WebSockets"],
        colors: [["#171717", "#2e1065"]]
    },
    {
        title: "Nexus Synth",
        desc: "Browser-based modular synthesizer using the Web Audio API. Connect oscillators, filters, and LFOs visually using an SVG node graph.",
        status: "Archived",
        statusClass: "badge-arch",
        tech: ["Web Audio API", "Canvas API", "AudioWorklet"],
        colors: [["#0a0a0a", "#022c22"]]
    }
];

const ProjectSection = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        // 1. Initial Reveal Animation for the new intro section
        const revealTitle = containerRef.current.querySelector('.reveal-text');
        if (revealTitle) {
            const splitReveal = new SplitType(revealTitle, { types: 'words, chars' });

            gsap.from(splitReveal.chars, {
                scrollTrigger: {
                    trigger: revealTitle,
                    start: "top 80%",
                },
                y: 100,
                opacity: 0,
                stagger: 0.02,
                duration: 0.8,
                ease: "power3.out"
            });
        }

        // 2. Project Card Pinning
        const sections = gsap.utils.toArray('.hero-section');

        sections.forEach((section) => {
            const imgWrap = section.querySelector('.image-wrapper');
            const imgInner = section.querySelector('.hero-img');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=150%",
                    scrub: 1.5,
                    pin: true,
                }
            });

            tl.to(imgWrap, {
                width: "80%",
                height: "70%",
                borderRadius: "30px",
                duration: 1
            }, 0);

            tl.to(imgInner, {
                scale: 1,
                y: -50,
                duration: 1
            }, 0);
        });

        return () => {
            if (revealTitle) SplitType.revert('.reveal-text');
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="portfolio-timeline">

            {/* NEW INTRO REVEAL SECTION */}
            <section className="hero" style={{ height: '50vh', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="hero-left" style={{ width: '100%', textAlign: 'center', margin: 0 }}>
                    <div className="eyebrow">Case Studies</div>
                    <h1 className="hero-name reveal-text" style={{ fontSize: '6vw', letterSpacing: '-0.02em', overflow: 'hidden' }}>
                        Selected Projects
                    </h1>
                </div>
            </section>

            {projects.map((p, i) => (
                <section className="hero-section" key={i}>

                    <div className="image-wrapper">
                        {/* We use a colored div mimicking an image based on the palette */}
                        <div className="hero-img" style={{
                            background: `linear-gradient(135deg, ${p.colors[0][0]}, ${p.colors[0][1]})`
                        }}></div>
                    </div>

                    {/* OVERLAY TEXT COMPLETELY REMOVED PER USER INSTRUCTION */}

                </section>
            ))}
        </div>
    );
};

export default ProjectSection;
