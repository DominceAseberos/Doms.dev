import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Github, Linkedin, ArrowLeft, X, Mail, MessageCircle } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import umtcLogo from '../assets/umtc-logo.png';
import heroImage from '../assets/hero-image.png';

gsap.registerPlugin(ScrollTrigger);

// Unified GSAP motion hook for all interactive elements
const useButtonMotion = () => {
    const ref = useRef(null);

    const onEnter = () => {
        if (!ref.current) return;
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            scale: 1.1,
            rotation: -4,
            duration: 0.2,
            ease: "power3.out"
        });
    };

    const onLeave = () => {
        if (!ref.current) return;
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            scale: 1,
            rotation: 0,
            duration: 0.25,
            ease: "elastic.out(1, 0.4)"
        });
    };

    const onTap = () => {
        if (!ref.current) return;
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, {
            scale: 0.95,
            duration: 0.12,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        });
    };

    return { ref, onEnter, onLeave, onTap };
};

// Generic animated wrapper component
const Animated = ({ children, className = '', style = {} }) => {
    const motion = useButtonMotion();
    return (
        <span
            ref={motion.ref}
            onMouseEnter={motion.onEnter}
            onMouseLeave={motion.onLeave}
            onMouseDown={motion.onTap}
            className={`inline-block cursor-pointer select-none ${className}`}
            style={style}
        >
            {children}
        </span>
    );
};

const AboutMePage = () => {
    const [expandedImage, setExpandedImage] = useState(null); // null, 'hero', 'education', 'resume'
    const { profile, education, contacts, techStack } = usePortfolioData();
    const heroCardRef = useRef(null);
    const identityCardRef = useRef(null);
    const educationCardRef = useRef(null);
    const resumeCardRef = useRef(null);
    const mdIconStack = useRef(null);
    const footerRef = useRef(null);


    useEffect(() => {
        // Tier 1: Stagger card entrances from bottom
        const cards = [heroCardRef, identityCardRef, educationCardRef, resumeCardRef, mdIconStack, footerRef];
        const cardEls = cards.map(ref => ref.current).filter(Boolean);
        gsap.killTweensOf(cardEls);

        gsap.fromTo(
            cardEls,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heroCardRef.current,
                    start: 'top 90%',
                },
                onComplete: () => {
                    // Remove will-change after animation to free GPU resources
                    cardEls.forEach(el => el?.classList.add('animation-complete'));
                }
            }
        );

        // Tier 2: Internal content scroll-trigger for each card
        cards.forEach((cardRef, index) => {
            if (!cardRef.current) return;

            const contentElements = cardRef.current.querySelectorAll('.scroll-reveal');

            gsap.killTweensOf(contentElements);
            gsap.fromTo(
                contentElements,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                    onComplete: () => {
                        // Clean up will-change after animation
                        contentElements.forEach(el => el?.classList.add('animation-complete'));
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const handleImageExpand = (imageType) => {
        setExpandedImage(imageType);

        // Animate background blur and image centering
        gsap.killTweensOf('.page-content');
        gsap.to('.page-content', {

            filter: 'blur(8px)',
            duration: 0.3,
        });

        gsap.killTweensOf('.expanded-image-container');
        gsap.fromTo('.expanded-image-container',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    };

    const handleImageClose = () => {
        gsap.killTweensOf('.page-content');
        gsap.to('.page-content', {
            filter: 'blur(0px)',
            duration: 0.3,
        });

        gsap.killTweensOf('.expanded-image-container');
        gsap.to('.expanded-image-container', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => setExpandedImage(null)
        });
    };


    return (
        <div
            className="min-h-screen w-full py-8  px-4 md:px-6 md:px-2"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--body-Linear-1-rgb)), rgb(var(--body-Linear-2-rgb)))`
            }}
        >
            <div className="
            md:grid md:grid-cols-12 md:gap-2 md:max-w-5xl
            lg:grid lg:grid-cols-12
            page-content max-w-2xl mx-auto space-y-6"
            >

                {/* Hero Image Card */}
                <div
                    ref={heroCardRef}
                    className="
                    h-66 flex justify-center
                    md:col-span-2 md:h-52
                    lg:col-span-2 lg:h-52
                    rounded-2xl p-6 border border-white/5 overflow-hidden"
                    style={{
                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                    }}
                >
                    <div
                        className="scroll-reveal w-full aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => handleImageExpand('hero')}
                        style={{ background: 'rgba(var(--contrast-rgb), 0.1)' }}
                    >
                        <img
                            src={heroImage}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Identity & Bio Card */}
                <div
                    ref={identityCardRef}
                    className="
                    md:col-span-6 md:h-52 md:w-full
                    lg:col-span-6 lg:h-52 lg:w-full
                    rounded-2xl p-6 border border-white/5 space-y-4"
                    style={{
                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                    }}
                >
                    <div className="scroll-reveal">
                        <h1
                            className="font-bold tracking-tight leading-none"
                            style={{
                                color: 'rgb(var(--contrast-rgb))',
                                fontSize: 'clamp(24px, 4vw, 32px)'
                            }}
                        >
                            {profile.name}
                        </h1>
                        <p
                            className="text-gray-400 font-medium mt-1"
                            style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}
                        >
                            {profile.age} • {profile.location}
                        </p>
                    </div>

                    <div className="scroll-reveal">
                        <p
                            className="text-gray-300 leading-relaxed"
                            style={{ fontSize: 'clamp(13px, 2.2vw, 15px)' }}
                        >
                            {profile.bio}
                        </p>
                    </div>

                    <div className="md:hidden lg:hidden
                    scroll-reveal space-y-2 ">
                        <h3
                            className="font-semibold"
                            style={{
                                color: 'rgb(var(--contrast-rgb))',
                                fontSize: 'clamp(14px, 2.5vw, 16px)'
                            }}
                        >
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-around  text-center "
                            style={{
                                color: 'rgb(var(--contrast-rgb))',
                                borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                                background: 'rgba(var(--contrast-rgb), 0.05)'
                            }}
                        >
                            {techStack.slice(0, 6).map((tech, index) => (
                                <Animated key={index}>
                                    <div className="rounded-full text-xs font-medium  border  px-3 py-2 w-32 cursor-pointer select-none touch-manipulation"
                                        style={{
                                            color: 'rgb(var(--contrast-rgb))',
                                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                                            background: 'rgba(var(--contrast-rgb), 0.05)'
                                        }}
                                    >
                                        {tech.name}
                                    </div>
                                </Animated>
                            ))}
                        </div>
                    </div>

                </div>

                {/*mideum-large screen  MDICONSTACK */}
                <div ref={mdIconStack}
                    className="hidden
                    md:block md:col-span-4 md:h-52 md:w-full
                    lg:block lg:col-span-4 lg:h-52 lg:w-full
                    scroll-reveal space-y-2
                    rounded-2xl p-6 border border-white/5 overflow-hidden
                    "
                    style={{
                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                    }}
                >

                    <h3
                        className="font-semibold "
                        style={{
                            color: 'rgb(var(--contrast-rgb))',
                            fontSize: 'clamp(14px, 2.5vw, 16px)'
                        }}
                    >
                        Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2 text-center">
                        {techStack.slice(0, 6).map((tech, index) => (
                            <Animated key={index}>
                                <div className="rounded-full text-xs font-medium  border  px-3 py-2 w-fit cursor-pointer select-none touch-manipulation"
                                    style={{
                                        color: 'rgb(var(--contrast-rgb))',
                                        borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                                        background: 'rgba(var(--contrast-rgb), 0.05)'
                                    }}
                                >
                                    {tech.name}
                                </div>
                            </Animated>
                        ))}
                    </div>
                </div>



                {/* Education Card */}
                <div
                    ref={educationCardRef}

                    className="
                    h-85 flex flex-col  justify-between
                    md:col-span-6  md:h-45 md:w-full md:flex md:flex-row md:justify-between md:gap-5
                    lg:col-span-6 lg:h-45 lg:w-full lg:flex lg:flex-row lg:justify-between lg:gap-5

                    rounded-2xl p-6 border border-white/5 space-y-4"

                    style={{
                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                    }}
                >
                    {/* Logo Placeholder */}
                    <div
                        className="scroll-reveal w-full h-full rounded-xl flex items-center justify-center
                        md:w-1/2 md:h-full md:flex md:flex-row md:justify-center
                        lg:w-1/2 lg:h-full lg:flex lg:flex-row lg:justify-center


                        bg-white
                        border cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => handleImageExpand('education')}
                        style={{
                            background: '#fff', // Force white background for the logo
                            borderColor: 'rgba(var(--contrast-rgb), 0.2)'
                        }}
                    >
                        <img
                            src={umtcLogo}
                            alt="University of Mindanao"
                            className="w-full h-full object-contain p-4"
                        />
                    </div>

                    {/* Education Details */}
                    <div className="
                    scroll-reveal space-y-2">
                        <h3
                            className="font-bold"
                            style={{
                                color: 'rgb(var(--contrast-rgb))',
                                fontSize: 'clamp(16px, 3vw, 18px)'
                            }}
                        >
                            {education.school}
                        </h3>
                        <p
                            className="text-gray-300 font-medium"
                            style={{ fontSize: 'clamp(13px, 2vw, 14px)' }}
                        >
                            {education.degree}
                        </p>
                        <p
                            className="text-gray-400 text-sm"
                            style={{ fontSize: 'clamp(11px, 1.8vw, 12px)' }}
                        >
                            {education.level} • Year {education.yearLevel}
                        </p>
                    </div>
                </div>

                {/* Resume/CV Card */}
                <div
                    ref={resumeCardRef}
                    className="h-85 flex flex-col justify-center items-center

                     md:col-span-6  md:h-45 md:flex md:flex-row md:gap-5   md:items-center

                    lg:col-span-6 lg:h-45 lg:w-full lg:flex lg:flex-row lg:justify-between lg:gap-5
                    rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between"
                    style={{
                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                    }}
                >
                    {/* Icon Placeholder */}
                    <div
                        className="scroll-reveal w-1/2  h-full rounded-xl flex items-center justify-center border cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => handleImageExpand('resume')}
                        style={{
                            background: 'rgba(var(--contrast-rgb), 0.05)',
                            borderColor: 'rgba(var(--contrast-rgb), 0.2)'
                        }}
                    >
                        <FileText
                            size={48}
                            style={{ color: 'rgb(var(--contrast-rgb))', opacity: 0.4 }}
                        />
                    </div>

                    {/* Download Button */}
                    <Animated>
                        <button
                            className="
                         w-full h-fit py-4 px-4 rounded-xl  flex-nowrap font-bold uppercase tracking-widest transition-all hover:cursor-pointer"
                            style={{
                                background: 'rgb(var(--contrast-rgb))',
                                color: '#000',
                                fontSize: 'clamp(10px, 2vw, 12px)'
                            }}
                        >
                            Download CV
                        </button>
                    </Animated>
                </div>

                {/* Interactive Footer */}
                <div
                    ref={footerRef}
                    className="
                    items-center
                    md:col-span-12 md:h-fit md:flex md:flex-row md:justify-between  
                    md:items-center
                    rounded-2xl p-6 border border-white/5 flex flex-col gap-4"
                    style={{
                        background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                    }}
                >
                    {/* Back Button */}
                    <Animated>
                        <Link to="/">
                            <button
                                className="
                                px-6
                            md:py-3 md:w-full md:px-3    
                            scroll-reveal w-full py-3 rounded-xl font-semibold flex flex-row justify-between gap-2 hover:cursor-pointer border"
                                style={{
                                    color: 'rgb(var(--contrast-rgb))',
                                    borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                                    fontSize: 'clamp(12px, 2.2vw, 14px)'
                                }}
                            >
                                <ArrowLeft size={18} />
                                Back to Dashboard
                            </button>
                        </Link>
                    </Animated>

                    {/* Social Icons */}
                    <div className="
                    scroll-reveal  flex justify-center gap-4">
                        <Animated className="md:h-fit p-3 rounded-full border" style={{
                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                            background: 'rgba(var(--contrast-rgb), 0.05)'
                        }}>
                            <a
                                href={contacts.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                <Github
                                    size={20}
                                    style={{ color: 'rgb(var(--contrast-rgb))' }}
                                />
                            </a>
                        </Animated>

                        <Animated className="md:h-fit p-3 rounded-full border" style={{
                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                            background: 'rgba(var(--contrast-rgb), 0.05)'
                        }}>
                            <a
                                href="#"
                                className="flex items-center justify-center"
                            >
                                <Linkedin
                                    size={20}
                                    style={{ color: 'rgb(var(--contrast-rgb))' }}
                                />
                            </a>
                        </Animated>

                        <Animated className="md:h-fit p-3 rounded-full border" style={{
                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                            background: 'rgba(var(--contrast-rgb), 0.05)'
                        }}>
                            <a
                                href={`mailto:${contacts.email}`}
                                className="flex items-center justify-center"
                            >
                                <Mail
                                    size={20}
                                    style={{ color: 'rgb(var(--contrast-rgb))' }}
                                />
                            </a>
                        </Animated>

                        <Animated className="md:h-fit p-3 rounded-full border" style={{
                            borderColor: 'rgba(var(--contrast-rgb), 0.3)',
                            background: 'rgba(var(--contrast-rgb), 0.05)'
                        }}>
                            <a
                                href={contacts.messenger}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                <MessageCircle
                                    size={20}
                                    style={{ color: 'rgb(var(--contrast-rgb))' }}
                                />
                            </a>
                        </Animated>
                    </div>

                    {/* Copyright */}
                    <p
                        className="scroll-reveal text-center text-gray-400"
                        style={{ fontSize: 'clamp(10px, 1.5vw, 11px)' }}
                    >
                        © 2026 {profile.name}
                    </p>
                </div>
            </div>

            {/* Expanded Image Modal */}
            {
                expandedImage && (
                    <div
                        className="fixed top-0 inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
                    >
                        <div className="expanded-image-container relative max-w-2xl w-full md:max-w-xl ">
                            <div
                                className="aspect-square rounded-2xl overflow-hidden"
                                style={{ background: 'rgba(var(--contrast-rgb), 0.1)' }}
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    {expandedImage === 'hero' && (
                                        <img
                                            src={heroImage}
                                            alt="Hero"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {expandedImage === 'education' && (
                                        <img
                                            src={umtcLogo}
                                            alt="University of Mindanao"
                                            className="w-full h-full object-contain p-8 bg-white"
                                        />
                                    )}
                                    {expandedImage === 'resume' && (
                                        <FileText
                                            size={120}
                                            style={{ color: 'rgb(var(--contrast-rgb))', opacity: 0.4 }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={handleImageClose}
                                className="absolute -top-12 right-0 p-2 md:top-0 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                                style={{
                                    background: 'rgb(var(--contrast-rgb))',
                                    color: '#000'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AboutMePage;
