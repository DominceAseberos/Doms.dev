// src/pages/Dashboard.jsx
import MusicPlayer from '../features/musicPlayer/MusicPlayer'
import Profile from '../features/Profile'
import ThemeToggle from '../features/ThemeToggle'
import { AboutMeCard } from '../features/about'
import ChatBot from '../features/chatBot/ChatBot'
import StatsGitHub from '../features/github/StatsGitHub'
import Contacts from '../features/contact/contact'
import GitHubFocusCard from '../features/FocusCard'
import TechStacks from '../features/techStacks/TechStacks'
import ProjectHead from '../features/projects/components/ProjectHead'
import Projects from '../features/projects/components/Projects'
import ProjectBottom from '../features/projects/components/ProjectBottom'
import FloatingChat from '../features/chatBot/floatingChat'
import PageLoader from '../components/PageLoader'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigationStore } from '../store/navigationStore'
import { usePortfolioData } from '../hooks/usePortfolioData'

gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
    const comp = useRef(null);
    const { dashboardVisited, setDashboardVisited } = useNavigationStore();
    const { uiConfig, profile, isLoading } = usePortfolioData();
    const [isMobile, setIsMobile] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [revealReady, setRevealReady] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track when data is ready
    useEffect(() => {
        if (!isLoading && profile && uiConfig) {
            setIsDataReady(true);
        }
    }, [isLoading, profile, uiConfig]);

    // Callback when loader finishes fading out
    const handleLoadComplete = useCallback(() => {
        setRevealReady(true);
    }, []);

    useLayoutEffect(() => {
        if (!revealReady) return; // Wait for loader to complete
        if (!dashboardVisited && !isMobile) {
            let ctx = gsap.context(() => {
                let mm = gsap.matchMedia();
                mm.add("(min-width: 768px)", () => {
                    gsap.fromTo(".desktop-anim-item",
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "power3.out",
                            onComplete: () => {
                                document.querySelectorAll('.desktop-anim-item').forEach(el => {
                                    el.classList.add('animation-complete');
                                });
                            }
                        }
                    );
                });
            }, comp);
            setDashboardVisited(true);
            return () => ctx.revert();
        }
    }, [dashboardVisited, setDashboardVisited, isMobile, revealReady]);

    // Mobile: Sequential reveal with increasing delays
    // Profile/Music → AboutMe → ProjectHead (container+text) → Projects → rest via scroll
    useEffect(() => {
        if (!revealReady || !isMobile) return;

        const mobileCards = Array.from(document.querySelectorAll('.mobile-reveal'));
        if (!mobileCards.length) return;

        // Cards layout: [0]=Profile/Music, [1]=AboutMe, [2]=ProjectHead, [3]=Projects, [4+]=rest
        const profileRow = mobileCards[0];      // Profile + Music + Theme
        const aboutMe = mobileCards[1];         // AboutMe card
        const projectHead = mobileCards[2];     // ProjectHead container
        const projectsCarousel = mobileCards[3]; // Projects carousel
        const belowFoldCards = mobileCards.slice(4); // ProjectBottom, GitHub, Contacts, etc.

        // 1. Profile/Music row (delay: 0.5s)
        gsap.fromTo(profileRow,
            { scale: 0.92, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.6, delay: 0.5, ease: "power3.out",
                onComplete: () => profileRow?.classList.add('animation-complete')
            }
        );

        // 2. AboutMe card (delay: 1s)
        gsap.fromTo(aboutMe,
            { scale: 0.92, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.6, delay: 1, ease: "power3.out",
                onComplete: () => aboutMe?.classList.add('animation-complete')
            }
        );

        // 3. ProjectHead container (delay: 1.6s), then inner text
        gsap.fromTo(projectHead,
            { scale: 0.92, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.6, delay: 1.6, ease: "power3.out",
                onComplete: () => {
                    projectHead?.classList.add('animation-complete');
                    // Animate inner text after container reveals
                    const innerElements = projectHead?.querySelectorAll('.animate-portfolio, .animate-breadcrumb');
                    if (innerElements?.length) {
                        gsap.fromTo(innerElements,
                            { y: 20, opacity: 0 },
                            {
                                y: 0, opacity: 1,
                                duration: 0.6, stagger: 0.08, ease: "power3.out"
                            }
                        );
                    }
                }
            }
        );

        // 4. Projects carousel (delay: 2.4s - bigger delay)
        gsap.fromTo(projectsCarousel,
            { scale: 0.95, opacity: 0, y: 40 },
            {
                scale: 1, opacity: 1, y: 0,
                duration: 0.7, delay: 2.4, ease: "power3.out",
                onComplete: () => projectsCarousel?.classList.add('animation-complete')
            }
        );

        // 5. Below fold cards: scroll-triggered with staggered delays
        belowFoldCards.forEach((card, index) => {
            gsap.fromTo(card,
                { scale: 0.95, opacity: 0, y: 25 },
                {
                    scale: 1, opacity: 1, y: 0,
                    duration: 0.5, ease: "power2.out",
                    delay: index * 0.15, // Stagger delay
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        toggleActions: "play none none none",
                        once: true
                    },
                    onComplete: () => card?.classList.add('animation-complete')
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [revealReady, isMobile]);

    return (
        <>
            <PageLoader
                isLoading={!isDataReady}
                onLoadComplete={handleLoadComplete}
                minDisplayTime={600}
            />
            <main
                role="main"
                className="relative"
                aria-label="Portfolio Dashboard"
                style={{
                    opacity: revealReady ? 1 : 0,
                    transition: 'opacity 0.2s ease-out'
                }}
            >
                <h1 className="sr-only">{uiConfig.dashboardTitle}</h1>

                {isMobile ? (
                    /* Mobile Layout */
                    <div className="flex flex-col h-auto w-full gap-2 z-50 px-4">
                        <div className="h-45 mobile-reveal">
                            <div className='flex justify w-full h-full gap-4'>
                                <div className='w-48 h-full overflow-hidden'>
                                    <Profile />
                                </div>
                                <div className='w-full h-full flex flex-col gap-4'>
                                    <div className="flex-1">
                                        <MusicPlayer />
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>

                        <div className="h-full mobile-reveal">
                            <AboutMeCard />
                        </div>



                        <div className="h-25 mobile-reveal">
                            <ProjectHead />
                        </div>

                        <div className="bento-card border-blue h-[400px] mobile-reveal">
                            <Projects />
                        </div>

                        <div className="bento-card h-25 mobile-reveal">
                            <ProjectBottom />
                        </div>

                        <div className="bento-card h-75 mobile-reveal">
                            <StatsGitHub />
                        </div>

                        <div className="h-75">
                            <div className='flex flex-col justify h-70 gap-4'>
                                <div className='w-full h-full flex flex-row gap-4'>
                                    <div className='flex-1 min-w-0 mobile-reveal'>
                                        <Contacts />
                                    </div>
                                    <div className='flex-1 min-w-0 mobile-reveal'>
                                        <GitHubFocusCard />
                                    </div>
                                </div>
                                <div className='bento-card w-full h-25 mobile-reveal'>
                                    <TechStacks />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Desktop Layout */
                    <div ref={comp} className='grid grid-cols-2 gap-x-5 px-12'>
                        <div className='col-span-1'>
                            <div className='grid grid-cols-6 gap-2'>

                                <div className="col-span-6 h-fit">
                                    <div className="flex flex-row gap-2 justify-between">
                                        <div className='h-[160px] w-[180px] desktop-anim-item'>
                                            <Profile />
                                        </div>

                                        <div className="h-[160px] w-full bento-card">
                                            <AboutMeCard />
                                        </div>

                                    </div>
                                </div>
                                <div className="col-span-6">
                                    <ThemeToggle />

                                </div>
                                <div className='col-span-4 bento-card md:h-35 lg:h-35 desktop-anim-item'>
                                    <MusicPlayer />
                                </div>
                                <div className='col-span-2 bento-card md:h-35 lg:h-35 desktop-anim-item'>
                                    <Contacts />
                                </div>
                                <div className='col-span-6 bento-card md:h-50 lg:h-50 desktop-anim-item'>
                                    <StatsGitHub />
                                </div>
                            </div>
                        </div>

                        <div className='col-span-1'>
                            <div className='grid grid-cols-6 gap-5'>
                                <div className='col-span-6 desktop-anim-item'>
                                    <ProjectHead />
                                </div>
                                <div className='col-span-6 md:h-75 lg:h-75 desktop-anim-item'>
                                    <div className="flex flex-row h-full justify-between gap-2">
                                        <div className="flex-[2] min-w-0">
                                            <Projects />
                                        </div>
                                        <div className="flex-1 md:max-w-32 lg:max-w-40">
                                            <GitHubFocusCard />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-6 bento-card desktop-anim-item'>
                                    <ProjectBottom />
                                </div>
                                <div className='col-span-6 bento-card desktop-anim-item'>
                                    <TechStacks />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <FloatingChat />

            </main>
        </>
    )
}

export default Dashboard;
