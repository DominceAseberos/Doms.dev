import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal, flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import ExpandedProjectOverlay from './ExpandedProjectOverlay';
import './ProjectSection.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "Luminary OS",
        type: "Web App · Motion",
        desc: "A conceptual operating system interface built entirely in the browser. Features a custom window manager, virtual file system, and WebGL-accelerated compositor.\n\n### The Challenge\nBuilding a seamless native-like experience in a browser environment posed significant performance challenges. We needed to handle window dragging, real-time blur layers, and complex state management without dropping below 60FPS.\n\n### Implementation\nBy leveraging React for the declarative UI and Zustand for the global window state, we isolated renders. The compositor was written in raw WebGL to offload the heavy blur and shadow calculations to the GPU.\n\n### Results\nThe final prototype is a fully functioning desktop environment that runs on any modern browser, demonstrating extreme frontend optimization techniques.",
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

// ── Global Scroll Blocker for Flight Animation ───────────────────────────
const preventGlobalScroll = (e) => {
    // Only prevent if the event isn't coming from inside the expanded overlay
    if (!e.target.closest('.ep-overlay')) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
};

const ProjectSection = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const gridRef = useRef(null); // Stores the ref for the floor grid
    const overlayRef = useRef(null);
    const originRef = useRef(null); // Stores {rect} for reverse-zoom on close
    const hallwayST = useRef(null); // Stores the hallway ScrollTrigger
    const freezeCards = useRef(false); // When true, updateCards is skipped (fallback)
    const [activeCard, setActiveCard] = useState(1);
    const [expandedProject, setExpandedProject] = useState(null);
    const [isExpanding, setIsExpanding] = useState(false);

    // ── Open: zoom card → fullscreen ─────────────────────────────────────────
    const handleViewProject = useCallback((project, cardEl) => {
        // Immediate check and freeze to prevent overlap with ScrollTrigger onUpdate
        if (isExpanding || freezeCards.current) return;
        freezeCards.current = true;
        setIsExpanding(true);

        // Native Event Blocker: intercepts mouse immediately, zero render cycle delay
        window.addEventListener('wheel', preventGlobalScroll, { passive: false });
        window.addEventListener('touchmove', preventGlobalScroll, { passive: false });

        // Lock Lenis smooth scroll immediately 
        if (window.lenis) window.lenis.stop();
        document.body.classList.add('ep-expanded');

        // Freeze hallway ScrollTrigger immediately to prevent any scrub lag catch-up
        if (hallwayST.current) hallwayST.current.disable(false);

        const rect = cardEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Save origin so close can reverse-zoom back to this position
        originRef.current = { rect };

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

        const isMobileExpand = vw <= 768;
        const targetTop = 0;
        const targetLeft = isMobileExpand ? 0 : vw / 2;
        const targetWidth = isMobileExpand ? vw : vw / 2;
        const targetHeight = isMobileExpand ? vh / 2 : vh;

        gsap.to(clone, {
            top: targetTop,
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
            borderRadius: 0,
            duration: 0.65,
            ease: 'expo.inOut',
            onComplete: () => {
                // Remove native flight animation scroll blocker
                window.removeEventListener('wheel', preventGlobalScroll);
                window.removeEventListener('touchmove', preventGlobalScroll);

                // Synchronously render the overlay portal so overlayRef.current is immediately available
                flushSync(() => {
                    setExpandedProject(project);
                });

                document.body.removeChild(clone);
                const overlay = overlayRef.current;
                if (overlay) {
                    gsap.to(overlay, {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.from(overlay.querySelectorAll('.ep-inner > *'), {
                        y: 40,
                        opacity: 0,
                        stagger: 0.07,
                        duration: 0.5,
                        ease: 'power3.out',
                        delay: 0.15
                    });
                }
                setIsExpanding(false);
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

        const epImage = overlay.querySelector('.ep-image');
        const bgImage = epImage ? epImage.style.backgroundImage : 'none';

        const isMobileClose = vw <= 768;
        const cloneTop = 0;
        const cloneLeft = isMobileClose ? 0 : vw / 2;
        const cloneWidth = isMobileClose ? vw : vw / 2;
        const cloneHeight = isMobileClose ? vh / 2 : vh;

        const shrinkClone = document.createElement('div');
        shrinkClone.style.cssText = `
                position: fixed;
                top: ${cloneTop}px;
                left: ${cloneLeft}px;
                width: ${cloneWidth}px;
                height: ${cloneHeight}px;
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

        requestAnimationFrame(() => {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.35,
                ease: 'power2.inOut'
            });

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

                    requestAnimationFrame(() => {
                        if (hallwayST.current) hallwayST.current.enable(false);
                        freezeCards.current = false;
                        if (window.lenis) window.lenis.start();
                    });
                }
            });
        });
    }, []);

    // ── GSAP Scroll Tunnel ────────────────────────────────────────────────────
    useGSAP(() => {
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

        const section = containerRef.current.querySelector('.works-stage');
        const imgWrap = section.querySelector('.image-wrapper');
        const track = trackRef.current;
        const cards = gsap.utils.toArray('.h-card', track);

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
                        card.style.transform = `translate(-50%, -50%) translate3d(${baseX * scaleFactor}px, 0, 0) scale(${scaleFactor})`;

                        if (scaleFactor > maxScaleForHighlight && scaleFactor <= 2.2) {
                            maxScaleForHighlight = scaleFactor;
                            nearest = i;
                        }
                    } else {
                        card.style.opacity = 0;
                        card.style.pointerEvents = 'none';
                    }
                });

                // Animate the floor grid to match the camera speed
                if (gridRef.current) {
                    gridRef.current.style.backgroundPositionY = `${cameraDepth}px`;
                }

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
                    onUpdate: (self) => {
                        if (freezeCards.current) return;
                        updateCards(tl.progress());
                    }
                },
                onUpdate: () => {
                    if (!freezeCards.current) updateCards(tl.progress());
                }
            });

            hallwayST.current = tl.scrollTrigger;
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
            <section className="hero" style={{ height: '50vh', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="hero-left" style={{ width: '100%', textAlign: 'center', margin: 0, borderRight: 'none', padding: 0 }}>
                    <div className="eyebrow">Case Studies</div>
                    <h1 className="hero-name reveal-text" style={{ fontSize: '6vw', letterSpacing: '-0.02em', overflow: 'hidden' }}>
                        Selected Projects
                    </h1>
                </div>
            </section>

            <section className="works-stage" style={{ pointerEvents: isExpanding ? 'none' : 'auto' }}>
                <div className="image-wrapper">
                    <div className="works-label">Selected Work</div>
                    <div className="works-counter"><span>{String(activeCard).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}</div>
                    <div className="works-hint">Scroll to walk through</div>

                    <div className="hallway-scene">
                        <div className="tunnel-grid" ref={gridRef}></div>
                        <div className="hallway-track" ref={trackRef}>
                            {projects.map((p, i) => (
                                <div
                                    className="h-card"
                                    key={i}
                                    style={{
                                        '--c1': p.colors[0],
                                        '--c2': p.colors[1],
                                        '--glow': p.glow
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProject(p, e.currentTarget);
                                    }}
                                >
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
                                        <button className="ov-link">View Project ↗</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {expandedProject && createPortal(
                <div
                    className="ep-overlay"
                    ref={overlayRef}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <ExpandedProjectOverlay project={expandedProject} onClose={handleClose} />
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProjectSection;
