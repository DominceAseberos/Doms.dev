import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import './ProjectSection.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "Luminary OS",
        type: "Web App · Motion",
        desc: "A conceptual operating system interface built entirely in the browser. Features a custom window manager, virtual file system, and WebGL-accelerated compositor.",
        tech: ["React", "WebGL", "Zustand"],
        colors: ["#0b1a0d", "#132215"],
        glow: "rgba(100,220,80,.1)",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Vanta Protocol",
        type: "GSAP · Three.js",
        desc: "Decentralized data visualizer for high-frequency trading. WebSockets stream live order book data into a custom WebGL instanced rendering engine.",
        tech: ["TypeScript", "Three.js"],
        colors: ["#1a0e08", "#261508"],
        glow: "rgba(220,120,40,.1)",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Nexus Synth",
        type: "WebGL · Canvas",
        desc: "Browser-based modular synthesizer using the Web Audio API. Connect oscillators, filters, and LFOs visually using an SVG node graph.",
        tech: ["Web Audio", "Canvas API"],
        colors: ["#08080f", "#0d0d1e"],
        glow: "rgba(80,100,255,.1)",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Meridian",
        type: "React · Animation",
        desc: "Luxury shopping experience with magnetic hover effects and a scroll-driven product showcase that boosted conversion by 40%.",
        tech: ["React", "Framer", "GSAP"],
        colors: ["#12060e", "#1c0a18"],
        glow: "rgba(200,60,180,.1)",
        image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Void",
        type: "p5.js · GLSL",
        desc: "Procedurally generated art driven by noise algorithms. Every session is unique — no two outputs are ever the same.",
        tech: ["p5.js", "WebGL", "GLSL"],
        colors: ["#081210", "#0c1c18"],
        glow: "rgba(40,200,160,.1)",
        image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop"
    }
];

const ProjectSection = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const overlayRef = useRef(null);
    const [activeCard, setActiveCard] = useState(1);
    const [expandedProject, setExpandedProject] = useState(null);
    const [isExpanding, setIsExpanding] = useState(false);

    const handleViewProject = useCallback((project, cardEl) => {
        if (isExpanding) return;
        setIsExpanding(true);

        // Get card's current bounding rect for the zoom origin
        const rect = cardEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Create a clone that sits exactly over the card in viewport coords
        const clone = cardEl.cloneNode(true);
        clone.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            z-index: 9999;
            border-radius: 18px;
            overflow: hidden;
            pointer-events: none;
            margin: 0;
            transform: none;
        `;
        document.body.appendChild(clone);

        // 1. Zoom the clone up to full screen
        gsap.to(clone, {
            top: 0,
            left: 0,
            width: vw,
            height: vh,
            borderRadius: 0,
            duration: 0.65,
            ease: "expo.inOut",
            onComplete: () => {
                // 2. Fade in the real React overlay
                document.body.classList.add('ep-expanded'); // Hide nav links via CSS
                setExpandedProject(project);
                // Wait one frame for React to render, then fade in
                requestAnimationFrame(() => {
                    const overlay = overlayRef.current;
                    if (overlay) {
                        gsap.from(overlay, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.out',
                            onStart: () => {
                                document.body.removeChild(clone);
                            }
                        });
                        gsap.from(overlay.querySelectorAll('.ep-inner > *'), {
                            y: 40,
                            opacity: 0,
                            stagger: 0.07,
                            duration: 0.5,
                            ease: 'power3.out',
                            delay: 0.15
                        });
                    } else {
                        document.body.removeChild(clone);
                    }
                    setIsExpanding(false);
                });
            }
        });
    }, [isExpanding]);

    const handleClose = useCallback((triggerEl) => {
        const overlay = overlayRef.current;
        if (!overlay) return;
        gsap.to(overlay, {
            opacity: 0,
            scale: 1.04,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
                setExpandedProject(null);
                document.body.classList.remove('ep-expanded'); // Restore nav links
                gsap.set(overlay, { clearProps: 'all' });
            }
        });
    }, []);

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

        // 2. Hallway Card Pinning and Shrinking
        const section = containerRef.current.querySelector('.works-stage');
        const imgWrap = section.querySelector('.image-wrapper');
        const track = trackRef.current;
        const cards = gsap.utils.toArray('.h-card', track);

        const TRAVEL = 3500; // Total Z distance to travel

        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 1025px)",
            isTablet: "(min-width: 769px) and (max-width: 1024px)",
            isMobile: "(max-width: 768px)"
        }, (context) => {
            let { isDesktop, isTablet, isMobile } = context.conditions;

            // Variables for 2D Tunnel simulation
            const FOCAL_LENGTH = 300;

            // Pre-position cards flat, assigning an abstract 'depth' index
            cards.forEach((card, i) => {
                let baseX;
                if (isMobile) {
                    baseX = i % 2 === 0 ? -55 : 55;
                } else if (isTablet) {
                    baseX = i % 2 === 0 ? -220 : 220;
                } else {
                    baseX = i % 2 === 0 ? -500 : 480;
                }

                // Depth is abstract (0, 600, 1200...) instead of physical Z pixels
                const depthOffset = (i * 600) + 200;
                card.dataset.depth = depthOffset;
                card.dataset.baseX = baseX;

                // Set initial flat CSS (tiny and invisible in the distance)
                gsap.set(card, {
                    x: baseX * 0.1,
                    yPercent: -50,
                    xPercent: -50,
                    scale: 0.1,
                    opacity: 0,
                    zIndex: 1
                });
            });

            // Calculate total scroll explicitly to match the depth of the furthest card
            const TOTAL_DEPTH = (cards.length * 600) + 400;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: `+=${TOTAL_DEPTH}`,
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const cameraDepth = self.progress * TOTAL_DEPTH;

                        let nearest = 0;
                        let maxScaleForHighlight = 0;

                        cards.forEach((card, i) => {
                            const cardDepth = parseFloat(card.dataset.depth);
                            const baseX = parseFloat(card.dataset.baseX);

                            // Distance from camera 
                            // > 0 means the card is ahead of camera
                            // <= 0 means the card has passed through the camera
                            const distFromCamera = cardDepth - cameraDepth;

                            let scaleFactor = FOCAL_LENGTH / (distFromCamera + FOCAL_LENGTH);

                            if (distFromCamera < -FOCAL_LENGTH) {
                                // Card is completely behind the camera lens
                                scaleFactor = 0;
                            }

                            if (scaleFactor > 0) {
                                // Fade curve
                                let opacity = 0;
                                if (scaleFactor < 0.25) {
                                    opacity = scaleFactor * 4; // Fade in quicker from deep background
                                } else if (scaleFactor > 2) {
                                    opacity = Math.max(0, 1 - (scaleFactor - 2)); // Fade out as it wraps around the camera
                                } else {
                                    opacity = 1;
                                }

                                card.style.opacity = opacity;
                                card.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none';

                                // Dynamic Z-index guarantees collision bounding boxes sort properly
                                card.style.zIndex = Math.round(scaleFactor * 100);

                                // Scatter horizontally from center equivalent to scaling
                                const currentX = baseX * scaleFactor;

                                gsap.set(card, {
                                    scale: scaleFactor,
                                    x: currentX
                                });

                                // Log closest readable card for the section counter
                                if (scaleFactor > maxScaleForHighlight && scaleFactor <= 2.2) {
                                    maxScaleForHighlight = scaleFactor;
                                    nearest = i;
                                }
                            } else {
                                // Hide physically when behind camera
                                card.style.opacity = 0;
                                card.style.pointerEvents = 'none';
                            }
                        });

                        setActiveCard(nearest + 1);
                    }
                }
            });

            // Shrink the container initially
            tl.to(imgWrap, {
                width: isMobile ? "94%" : isTablet ? "88%" : "80%",
                height: isMobile ? "88%" : isTablet ? "80%" : "70%",
                borderRadius: isMobile ? "16px" : "30px",
                duration: 0.15,
                ease: "power2.inOut"
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
                <div className="hero-left" style={{ width: '100%', textAlign: 'center', margin: 0, borderRight: 'none', padding: 0 }}>
                    <div className="eyebrow">Case Studies</div>
                    <h1 className="hero-name reveal-text" style={{ fontSize: '6vw', letterSpacing: '-0.02em', overflow: 'hidden' }}>
                        Selected Projects
                    </h1>
                </div>
            </section>

            {/* SINGLE PINNED WRAPPER FOR 3D HALLWAY */}
            <section className="works-stage">
                <div className="image-wrapper">

                    <div className="works-label">Selected Work</div>
                    <div className="works-counter"><span>{String(activeCard).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}</div>
                    <div className="works-hint">Scroll to walk through</div>

                    <div className="hallway-scene">
                        <div className="hallway-track" ref={trackRef}>

                            {projects.map((p, i) => (
                                <div className="h-card" key={i} style={{
                                    '--c1': p.colors[0],
                                    '--c2': p.colors[1],
                                    '--glow': p.glow
                                }}>
                                    <div className="h-card-face">
                                        <img className="h-card-image" src={p.image} alt={p.title} />
                                    </div>
                                    <div className="h-card-glow"></div>
                                    <div className="h-card-vignette"></div>
                                    <div className="h-card-title-wrap">
                                        <span className="h-card-num">{String(i + 1).padStart(2, '0')}</span>
                                        <div className="h-card-name">{p.title}</div>
                                        <span className="h-card-type">{p.type}</span>
                                    </div>
                                    <div className="h-card-overlay">
                                        <span className="ov-tag">Project</span>
                                        <div className="ov-title">{p.title}</div>
                                        <p className="ov-desc">{p.desc}</p>
                                        <div className="ov-pills">
                                            {p.tech.map((t, idx) => (
                                                <span className="ov-pill" key={idx}>{t}</span>
                                            ))}
                                        </div>
                                        <button
                                            className="ov-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const card = e.target.closest('.h-card');
                                                handleViewProject(p, card);
                                            }}
                                        >View Project ↗</button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </section>

            {/* FULLSCREEN PROJECT EXPANDED OVERLAY */}
            {expandedProject && (
                <div className="ep-overlay" ref={overlayRef}>
                    <button className="ep-close" onClick={handleClose}>✕</button>
                    <div className="ep-inner">
                        <span className="ep-tag">Project</span>
                        <h2 className="ep-title">{expandedProject.title}</h2>
                        <p className="ep-type">{expandedProject.type}</p>
                        <div className="ep-divider" />
                        <p className="ep-desc">{expandedProject.desc}</p>
                        <div className="ep-pills">
                            {expandedProject.tech.map((t, i) => (
                                <span className="ep-pill" key={i}>{t}</span>
                            ))}
                        </div>
                        <a href="#" className="ep-cta">Open Case Study ↗</a>
                    </div>
                    <div
                        className="ep-image"
                        style={{ backgroundImage: `url(${expandedProject.image})` }}
                    />
                </div>
            )}

        </div>
    );
};

export default ProjectSection;
