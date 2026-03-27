import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import landingDataDefault from '../data/landingData.json';
import './MoreProjectsSection.css';

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const STORAGE_KEY = 'landingData';

const getLandingData = () => {
    if (typeof window === 'undefined') return landingDataDefault;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return landingDataDefault;
    try {
        const parsed = JSON.parse(stored);
        return {
            ...landingDataDefault,
            ...(parsed || {}),
            moreProjectsImages: parsed.moreProjectsImages || landingDataDefault.moreProjectsImages || []
        };
    } catch (e) {
        return landingDataDefault;
    }
};

const MagneticImage = ({ src, rotateMultiplier = 2, offsetClass, placeholderText, fwdRef }) => {
    const imgRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
    };

    let rotateX = 0;
    let rotateY = 0;

    if (isHovered && imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        rotateX = -((mousePos.y - centerY) / centerY) * rotateMultiplier;
        rotateY = ((mousePos.x - centerX) / centerX) * rotateMultiplier;
    }

    return (
        <div
            ref={(el) => {
                imgRef.current = el;
                if (fwdRef) fwdRef(el);
            }}
            className={`relative w-full aspect-video rounded-xl shadow-lg transition-transform duration-200 ease-out flex items-center justify-center overflow-hidden group cursor-pointer border border-[#ffffff10] ${offsetClass} bg-black/40`}
            style={{
                transform: isHovered
                    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Real Image */}
            {src && (
                <img src={src} alt="Project Preview" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Hover Backlight */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 bg-transparent flex items-center justify-center"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(200,255,62,0.1), transparent 80%)`
                }}
            />

            {!src && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
                    <span className="ui-sub-label text-sm opacity-80 bg-black/50 px-3 py-1 rounded-full group-hover:text-[#c8ff3e] transition-colors">{placeholderText}</span>
                </div>
            )}
        </div>
    );
};

const MoreProjectsSection = () => {
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';
    const sectionRef = useRef(null);
    const textRef1 = useRef(null);
    const textRef2 = useRef(null);
    const btnRef = useRef(null);
    const imgRefs = useRef([]);
    const [landingData, setLandingData] = useState(() => getLandingData());

    useEffect(() => {
        const checkData = () => setLandingData(getLandingData());
        const interval = setInterval(checkData, 500);
        window.addEventListener('storage', checkData);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkData);
        };
    }, []);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            if (!sectionRef.current) return;
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top", // Pin exactly when top hits top
                    end: "+=1500", // Scroll distance for the animation
                    pin: true,
                    scrub: 1, // Smooth scrubbing
                }
            });

            // Initial states for animation
            gsap.set([textRef1.current, textRef2.current, btnRef.current], {
                y: 100,
                opacity: 0
            });

            gsap.set(imgRefs.current, {
                scale: (i) => i === 0 ? 0.8 : 0,
                opacity: 0,
                x: (i) => i === 0 ? 0 : (i % 2 === 0 ? 150 : -150),
                y: (i) => i === 0 ? 100 : (i % 3 === 0 ? 150 : -150),
                rotation: (i) => i === 0 ? 0 : (i % 2 === 0 ? 15 : -15)
            });

            // Sequence
            tl.to([textRef1.current, textRef2.current, btnRef.current], {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "power3.out"
            }, 0)
                .to(imgRefs.current, {
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    stagger: 0.05,
                    ease: "back.out(1.7)"
                }, 0.2); // Start slightly after text starts

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToImgRefs = (el) => {
        if (el && !imgRefs.current.includes(el)) {
            imgRefs.current.push(el);
        }
    };

    const fallbackPreviews = [
        { text: "Project Preview 1", offsetClass: "col-span-2 row-span-1", rotateMultiplier: 2 },
        { text: "Project Preview 2", offsetClass: "col-span-1 row-span-1", rotateMultiplier: 6 },
        { text: "Project Preview 3", offsetClass: "col-span-1 row-span-1", rotateMultiplier: 6 }
    ];

    const displayImages = landingData.moreProjectsImages && landingData.moreProjectsImages.length > 0
        ? landingData.moreProjectsImages
        : fallbackPreviews;

    return (
        <section ref={sectionRef} className={`relative min-h-[100vh] flex items-center pt-24 pb-24 z-20 overflow-hidden ${isLight ? 'bg-[#d0d7c8]' : 'bg-[#0b0b0b]'}`}>
            {/* Decorative Inner Polygons */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-[85%] h-full"
                    style={{
                        clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)',
                        backgroundColor: isLight ? '#d0d7c8' : '#0b0b0b'
                    }}
                ></div>
                <div
                    className="absolute bottom-0 right-0 w-[50%] h-[75%]"
                    style={{
                        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                        background: isLight ? '#c8ff3e' : 'linear-gradient(to top right, #3f4144, transparent)',
                        opacity: isLight ? 0.08 : 0.8
                    }}
                ></div>
            </div>

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Left Side: Explanatory Text & CTA — order 3 on mobile, natural on desktop */}
                    <div className="w-full lg:w-1/2 order-3 lg:order-none">
                        <h2 ref={textRef1} className={`text-5xl md:text-7xl font-bold tracking-tight mb-8 ${isLight ? 'text-[#222]' : 'text-[#f2ede6]'}`}>More Projects</h2>
                        <p ref={textRef2} className={`ui-body-copy text-base md:text-lg mb-10 max-w-lg ${isLight ? 'text-[#333]' : ''}`}>
                            Beyond the highlighted case studies, I have an archive of work and side ventures. Explore the full catalog to see the breadth of my capabilities.
                        </p>
                        <div ref={btnRef}>
                            <a
                                href="/projects"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] ${isLight ? 'text-[#222] bg-[#c8ff3e] border-none hover:bg-white hover:text-black' : 'text-white border border-white/20 bg-transparent hover:bg-white hover:text-black'}`}
                            >
                                View All Projects ↗
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Scattered Collage Image Previews */}
                    <div className="w-full lg:w-1/2 relative order-2 lg:order-none h-[400px] md:h-[600px] flex items-center justify-center">
                        {displayImages.map((img, i) => {
                            const isString = typeof img === 'string';
                            const src = isString ? img : null;
                            const text = !isString ? img.text : "";

                            // Logic: 1 center big img, others scattered around
                            const isCenter = i === 0;

                            // Predefined scatter offsets (top/left/right/bottom %)
                            const scatterPos = [
                                { top: '5%', left: '0%' },     // 1: top-left
                                { bottom: '5%', right: '0%' }, // 2: bottom-right
                                { top: '10%', right: '0%' },    // 3: top-right
                                { bottom: '10%', left: '5%' },  // 4: bottom-left
                                { top: '40%', left: '-10%' },  // 5: mid-left
                                { top: '50%', right: '-10%' }, // 6: mid-right
                                { top: '-5%', left: '30%' },   // 7: top-center
                                { bottom: '-5%', right: '30%' }// 8: bottom-center
                            ];

                            // Safe index for positions
                            const pos = isCenter ? {} : scatterPos[(i - 1) % scatterPos.length];

                            return (
                                <div
                                    key={`${src || text}-${i}`}
                                    className={`absolute transition-all duration-300 ${isCenter ? 'w-[75%] md:w-[65%] z-10' : 'w-[35%] md:w-[35%] z-20'}`}
                                    style={isCenter ? {} : { ...pos }}
                                >
                                    <MagneticImage
                                        fwdRef={addToImgRefs}
                                        src={src}
                                        placeholderText={text}
                                        rotateMultiplier={isCenter ? 1 : 6}
                                        offsetClass="rounded-xl overflow-hidden shadow-2xl"
                                    />
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MoreProjectsSection;
