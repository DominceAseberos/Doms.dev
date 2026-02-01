import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, FileText } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import PageLoader from '../components/PageLoader';
import umtcLogo from '../assets/umtc-logo.png';
import heroImage from '../assets/hero-image.png';

// About Feature Components
import {
    AboutMeHero,
    AboutMeIdentity,
    AboutMeEducation,
    AboutMeResume,
    AboutMeTechStack,
    AboutMeFooter,
    AboutMeStatusCard,
    BackButton,
    DownloadCVButton,
} from '../features/about';

gsap.registerPlugin(ScrollTrigger);

const AboutMePage = () => {
    const [expandedImage, setExpandedImage] = useState(null); // null, 'hero', 'education', 'resume'
    const [isDataReady, setIsDataReady] = useState(false);
    const [revealReady, setRevealReady] = useState(false);
    const { profile, education, contacts, techStack, isLoading } = usePortfolioData();

    // Refs for animations
    const heroCardRef = useRef(null);
    const identityCardRef = useRef(null);
    const educationCardRef = useRef(null);
    const resumeCardRef = useRef(null);
    const mdIconStack = useRef(null);
    const feedCard = useRef(null);
    const footerRef = useRef(null);

    // Track when data is ready
    useEffect(() => {
        if (!isLoading && profile && education && techStack) {
            setIsDataReady(true);
        }
    }, [isLoading, profile, education, techStack]);

    // Callback when loader finishes fading out
    const handleLoadComplete = useCallback(() => {
        setRevealReady(true);
    }, []);

    // Reveal animation - only runs after loader completes
    // Different behavior for mobile (scroll reveal) vs desktop (sequential reveal)
    useEffect(() => {
        if (!revealReady) return;

        const isMobile = window.innerWidth < 768;
        const cards = [heroCardRef, identityCardRef, feedCard, mdIconStack, educationCardRef, resumeCardRef, footerRef];
        const cardEls = cards.map(ref => ref.current).filter(Boolean);
        gsap.killTweensOf(cardEls);

        if (isMobile) {
            // MOBILE: First 3 cards animate on load, rest are scroll-triggered
            const aboveFoldCards = cardEls.slice(0, 3);
            const belowFoldCards = cardEls.slice(3);

            // Above fold: staggered fade+slide on load
            gsap.fromTo(aboveFoldCards,
                { y: 40, opacity: 0, rotate: 1 },
                {
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power3.out',
                    onComplete: () => {
                        aboveFoldCards.forEach(el => el?.classList.add('animation-complete'));
                    }
                }
            );

            // Below fold: scroll-triggered per-card animation
            belowFoldCards.forEach((card) => {
                gsap.fromTo(card,
                    { y: 50, opacity: 0, rotate: 1.5 },
                    {
                        y: 0,
                        opacity: 1,
                        rotate: 0,
                        duration: 0.6,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                            once: true
                        },
                        onComplete: () => {
                            card?.classList.add('animation-complete');
                        }
                    }
                );
            });

            // Inner scroll-reveal elements for mobile
            cards.forEach((cardRef) => {
                if (!cardRef.current) return;
                const contentElements = cardRef.current.querySelectorAll('.scroll-reveal');
                gsap.killTweensOf(contentElements);
                gsap.fromTo(
                    contentElements,
                    { y: 15, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                            once: true
                        },
                        onComplete: () => {
                            contentElements.forEach(el => el?.classList.add('animation-complete'));
                        }
                    }
                );
            });
        } else {
            // DESKTOP: Sequential reveal with specific timing
            // First, hide all cards immediately so they're not visible before animation
            gsap.set(cardEls, { opacity: 0, y: 25, scale: 0.95 });

            const tl = gsap.timeline();

            // 1. Hero (0.3s)
            if (heroCardRef.current) {
                tl.fromTo(heroCardRef.current,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.3
                );
            }

            // 2. Identity (0.5s)
            if (identityCardRef.current) {
                tl.fromTo(identityCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.5
                );
            }

            // 3. StatusCard (0.7s)
            if (feedCard.current) {
                tl.fromTo(feedCard.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.7
                );
            }

            // 4. TechStack (0.9s)
            if (mdIconStack.current) {
                tl.fromTo(mdIconStack.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    0.9
                );
            }

            // 5. Education (1.1s)
            if (educationCardRef.current) {
                tl.fromTo(educationCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    1.1
                );
            }

            // 6. Resume + CV Button (1.3s)
            if (resumeCardRef.current) {
                tl.fromTo(resumeCardRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    1.3
                );
            }

            // 7. Footer (1.5s)
            if (footerRef.current) {
                tl.fromTo(footerRef.current,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
                    1.5
                );
            }

            tl.eventCallback('onComplete', () => {
                cardEls.forEach(el => el?.classList.add('animation-complete'));
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [revealReady]);

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
        <>
            <PageLoader
                isLoading={!isDataReady}
                onLoadComplete={handleLoadComplete}
                minDisplayTime={600}
            />
            <div
                className="min-h-screen w-full py-8 px-4 md:px-2"
                style={{
                    background: `linear-gradient(to bottom, rgb(var(--body-Linear-1-rgb)), rgb(var(--body-Linear-2-rgb)))`,
                    opacity: revealReady ? 1 : 0,
                    transition: 'opacity 0.2s ease-out'
                }}
            >

                <div className="md:hidden lg:hidden 
            flex flex-col gap-8 page-content max-w-2xl mx-auto items-center">
                    <div className="flex flex-start w-full">
                        <BackButton />
                    </div>
                    <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />



                    <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} />

                    <AboutMeStatusCard feedCard={feedCard} onExpand={handleImageExpand} profile={profile} />

                    <AboutMeTechStack mdIconStack={mdIconStack} techStack={techStack} />

                    <AboutMeEducation educationCardRef={educationCardRef} education={education} onExpand={handleImageExpand} />

                    <AboutMeResume resumeCardRef={resumeCardRef} onExpand={handleImageExpand} profile={profile} />

                    <div className="w-full flex justify-center">
                        <DownloadCVButton profile={profile} />

                    </div>


                    <div className="w-full
                rounded-2xl p-6 border border-white/5"
                        style={{
                            background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                        }}
                    >
                        <AboutMeFooter footerRef={footerRef} contacts={contacts} profile={profile} />
                    </div>

                </div>
                {/* ==================BIG SCREEN===================== */}

                <div className="
            hidden md:grid md:cols-span-12 lg:cols-span-12 p-4 gap-4

            ">
                    {/* ===================== */}
                    <div className="md:col-span-4 lg:col-span-2 md:h-60 md:w-full lg:h-60 " >
                        <div className="flex flex-col gap-4 w-full h-full">
                            <BackButton />

                            <AboutMeHero heroCardRef={heroCardRef} onExpand={handleImageExpand} profile={profile} />

                        </div>

                    </div>

                    {/* ============= */}
                    <div className="
                md:h-40 md:w-full lg:h-60 
                md:col-span-4 lg:col-span-2 ">
                        <AboutMeIdentity identityCardRef={identityCardRef} profile={profile} />

                    </div>

                    {/* ================ */}
                    <div className="md:col-span-4 lg:col-span-2  md:h-40 md:w-full lg:h-60">
                        <AboutMeStatusCard feedCard={feedCard} onExpand={handleImageExpand} profile={profile} />

                    </div>


                    {/* ============== */}
                    <div className="md:col-span-2 lg:col-span-2  md:h-20 md:w-full lg:h-60 aspect-square">
                        <AboutMeTechStack mdIconStack={mdIconStack} techStack={techStack} />

                    </div>


                    <div className="md:col-span-2 lg:col-span-2  md:h-40 md:w-full  lg:h-60">
                        <AboutMeEducation educationCardRef={educationCardRef} education={education} onExpand={handleImageExpand} />
                    </div>


                    <div className="md:col-span-2 lg:col-span-2  md:h-40 md:w-full lg:h-60">

                        <div className="flex flex-col  justify-between gap-2 w-50 h-full " >

                            <div className="h-2/3 w-50">
                                <AboutMeResume resumeCardRef={resumeCardRef} onExpand={handleImageExpand} profile={profile} />
                            </div>


                            <DownloadCVButton profile={profile} />

                        </div>



                    </div>

                    <div className="md:col-span-4 lg:col-span-6 w-full
                rounded-2xl p-6 border border-white/5"
                        style={{
                            background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
                        }}
                    >
                        <AboutMeFooter footerRef={footerRef} contacts={contacts} profile={profile} />
                    </div>

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
        </>
    );
};

export default AboutMePage;
