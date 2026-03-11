import React, { useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
    const originRef = useRef(null); // Stores {rect} for reverse-zoom on close
    const [activeCard, setActiveCard] = useState(1);
    const [expandedProject, setExpandedProject] = useState(null);
    const [isExpanding, setIsExpanding] = useState(false);

    // ── Open: zoom card → fullscreen ─────────────────────────────────────────
    const handleViewProject = useCallback((project, cardEl) => {
        if (isExpanding) return;
        setIsExpanding(true);

        const rect = cardEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Save origin so close can reverse-zoom back to this position
        originRef.current = { rect };

        // Use a clean image-backed div instead of cloneNode to avoid
        // inheriting GSAP's inline transform styles (scale/translateX/yPercent etc.)
        // which cause a visible glitch during the zoom animation.
        const clone = document.createElement('div');
        clone.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            z-index: 10001;
            border-radius: 18px;
            overflow: hidden;
            pointer-events: none;
            background-image: url(${project.image});
            background-size: cover;
            background-position: center;
            background-color: #06060a;
        `;
        document.body.appendChild(clone);

        // Expand the clone to fullscreen
        gsap.to(clone, {
            top: 0,
            left: 0,
            width: vw,
            height: vh,
            borderRadius: 0,
            duration: 0.65,
            ease: 'expo.inOut',
            onComplete: () => {
                document.body.classList.add('ep-expanded');
                setExpandedProject(project);
                requestAnimationFrame(() => {
                    const overlay = overlayRef.current;
                    if (overlay) {
                        gsap.from(overlay, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.out',
                            onStart: () => { document.body.removeChild(clone); }
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

    // ── Close: fullscreen → shrink back to card position ─────────────────────
    const handleClose = useCallback(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const origin = originRef.current;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const targetRect = origin?.rect || {
            top: vh / 2 - 130,
            left: vw / 2 - 100,
            width: 200,
            height: 260
        };

        // Read the project image from the overlay so the shrink clone looks like the card
        const epImage = overlay.querySelector('.ep-image');
        const bgImage = epImage ? epImage.style.backgroundImage : 'none';

        // Build a visually rich clone so the user can see it shrinking
        const shrinkClone = document.createElement('div');
        shrinkClone.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${vw}px;
            height: ${vh}px;
            z-index: 10001;
            border-radius: 0;
            overflow: hidden;
            pointer-events: none;
            background-image: ${bgImage};
            background-size: cover;
            background-position: center;
            background-color: #06060a;
        `;
        document.body.appendChild(shrinkClone);

        // Instantly hide the React overlay — the clone takes over visually
        gsap.set(overlay, { opacity: 0 });

        // Shrink the clone back to where the card originally was
        gsap.to(shrinkClone, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: 18,
            duration: 0.65,
            ease: 'expo.inOut',
            onComplete: () => {
                document.body.removeChild(shrinkClone);
                setExpandedProject(null);
                document.body.classList.remove('ep-expanded');
                if (overlayRef.current) gsap.set(overlayRef.current, { clearProps: 'all' });
            }
        });
    }, []);

    // ── GSAP Scroll Tunnel ────────────────────────────────────────────────────
    useGSAP(() => {
        // Intro reveal text
        const revealTitle = containerRef.current.querySelector('.reveal-text');
        if (revealTitle) {
            const splitReveal = new SplitType(revealTitle, { types: 'words, chars' });
            gsap.from(splitReveal.chars, {
                scrollTrigger: { trigger: revealTitle, start: 'top 80%' },
                y: 100,
                opacity: 0,
                stagger: 0.02,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        // 2D Hallway card tunnel
        const section = containerRef.current.querySelector('.works-stage');
        const imgWrap = section.querySelector('.image-wrapper');
        const track = trackRef.current;
        const cards = gsap.utils.toArray('.h-card', track);
        const TRAVEL = 3500;

        let mm = gsap.matchMedia();
        mm.add({
            isDesktop: '(min-width: 1025px)',
            isTablet: '(min-width: 769px) and (max-width: 1024px)',
            isMobile: '(max-width: 768px)'
        }, (context) => {
            let { isDesktop, isTablet, isMobile } = context.conditions;
            const FOCAL_LENGTH = 300;

            cards.forEach((card, i) => {
                let baseX;
                if (isMobile) {
                    baseX = i % 2 === 0 ? -55 : 55;
                } else if (isTablet) {
                    baseX = i % 2 === 0 ? -220 : 220;
                } else {
                    baseX = i % 2 === 0 ? -500 : 480;
                }
                const depthOffset = (i * 600) + 200;
                card.dataset.depth = depthOffset;
                card.dataset.baseX = baseX;
                gsap.set(card, {
                    x: baseX * 0.1,
                    yPercent: -50,
                    xPercent: -50,
                    scale: 0.1,
                    opacity: 0,
                    zIndex: 1
                });
            });

            const TOTAL_DEPTH = (cards.length * 600) + 400;

            // Named function so we can call it immediately for the initial state
            const updateCards = (progress) => {
                const cameraDepth = progress * TOTAL_DEPTH;
                let nearest = 0;
                let maxScaleForHighlight = 0;

                cards.forEach((card, i) => {
                    const cardDepth = parseFloat(card.dataset.depth);
                    const baseX = parseFloat(card.dataset.baseX);
                    const distFromCamera = cardDepth - cameraDepth;
                    let scaleFactor = FOCAL_LENGTH / (distFromCamera + FOCAL_LENGTH);
                    if (distFromCamera < -FOCAL_LENGTH) scaleFactor = 0;

                    if (scaleFactor > 0) {
                        let opacity = 0;
                        if (scaleFactor < 0.25) {
                            opacity = scaleFactor * 4;
                        } else if (scaleFactor > 2) {
                            opacity = Math.max(0, 1 - (scaleFactor - 2));
                        } else {
                            opacity = 1;
                        }
                        card.style.opacity = opacity;
                        card.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none';
                        card.style.zIndex = Math.round(scaleFactor * 100);
                        gsap.set(card, { scale: scaleFactor, x: baseX * scaleFactor });
                        if (scaleFactor > maxScaleForHighlight && scaleFactor <= 2.2) {
                            maxScaleForHighlight = scaleFactor;
                            nearest = i;
                        }
                    } else {
                        card.style.opacity = 0;
                        card.style.pointerEvents = 'none';
                    }
                });
                setActiveCard(nearest + 1);
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: `+=${TOTAL_DEPTH}`,
                    scrub: 1.5,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => updateCards(self.progress)
                }
            });

            // Render cards at progress=0 immediately — no scroll required
            updateCards(0);

            tl.to(imgWrap, {
                width: isMobile ? '88%' : isTablet ? '76%' : '72%',
                borderRadius: isMobile ? '16px' : '30px',
                duration: 1,
                ease: 'power1.out'
            }, 0);
        });

        return () => {
            if (revealTitle) SplitType.revert('.reveal-text');
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="portfolio-timeline">

            {/* INTRO REVEAL */}
            <section className="hero" style={{ height: '50vh', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="hero-left" style={{ width: '100%', textAlign: 'center', margin: 0, borderRight: 'none', padding: 0 }}>
                    <div className="eyebrow">Case Studies</div>
                    <h1 className="hero-name reveal-text" style={{ fontSize: '6vw', letterSpacing: '-0.02em', overflow: 'hidden' }}>
                        Selected Projects
                    </h1>
                </div>
            </section>

            {/* HALLWAY TUNNEL */}
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

            {/* FULLSCREEN PROJECT OVERLAY — rendered via portal to escape GSAP pin stacking context */}
            {expandedProject && createPortal(
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
                </div>,
                document.body
            )}

        </div>
    );
};

export default ProjectSection;
