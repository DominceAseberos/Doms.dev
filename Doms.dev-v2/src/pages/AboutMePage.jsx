import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, FileText } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import umtcLogo from '../assets/umtc-logo.png';
import heroImage from '../assets/hero-image.png';

// About Feature Components
import {
    AboutMeHero,
    AboutMeIdentity,
    AboutMeEducation,
    AboutMeResume,
    AboutMeTechStack,
    AboutMeFooter
} from '../features/about';

gsap.registerPlugin(ScrollTrigger);

const AboutMePage = () => {
    const [expandedImage, setExpandedImage] = useState(null); // null, 'hero', 'education', 'resume'
    const { profile, education, contacts, techStack } = usePortfolioData();

    // Refs for animations
    const heroCardRef = useRef(null);
    const identityCardRef = useRef(null);
    const educationCardRef = useRef(null);
    const resumeCardRef = useRef(null);
    const mdIconStack = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
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
                    cardEls.forEach(el => el?.classList.add('animation-complete'));
                }
            }
        );

        cards.forEach((cardRef) => {
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
        gsap.to('.page-content', {
            filter: 'blur(8px)',
            duration: 0.3,
        });
        gsap.fromTo('.expanded-image-container',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    };

    const handleImageClose = () => {
        gsap.to('.page-content', {
            filter: 'blur(0px)',
            duration: 0.3,
        });
        gsap.to('.expanded-image-container', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => setExpandedImage(null)
        });
    };

    return (
        <div
            className="min-h-screen w-full py-8 px-4 md:px-2"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--body-Linear-1-rgb)), rgb(var(--body-Linear-2-rgb)))`
            }}
        >
            <div className="md:grid md:grid-cols-12 md:gap-2 md:max-w-5xl lg:grid lg:grid-cols-12 page-content max-w-2xl mx-auto space-y-6 items-center">

                <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />

                <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} techStack={techStack} />

                <AboutMeTechStack mdIconStack={mdIconStack} techStack={techStack} />

                <AboutMeEducation educationCardRef={educationCardRef} education={education} onExpand={handleImageExpand} />

                <AboutMeResume resumeCardRef={resumeCardRef} onExpand={handleImageExpand} profile={profile} />

                <AboutMeFooter footerRef={footerRef} contacts={contacts} profile={profile} />

            </div>

            {/* Expanded Image Modal */}
            {expandedImage && (
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
                                    <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                                )}
                                {expandedImage === 'education' && (
                                    <img src={umtcLogo} alt="University of Mindanao" className="w-full h-full object-contain p-8 bg-white" />
                                )}
                                {expandedImage === 'resume' && (
                                    <FileText size={120} style={{ color: 'rgb(var(--contrast-rgb))', opacity: 0.4 }} />
                                )}
                            </div>
                        </div>

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
            )}
        </div>
    );
};

export default AboutMePage;
