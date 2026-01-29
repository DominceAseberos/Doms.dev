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
import FrequencyCircles from '../components/FrequencyCircles'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useNavigationStore } from '../store/navigationStore'
import { usePortfolioData } from '../hooks/usePortfolioData'


const Dashboard = () => {
    const comp = useRef(null);
    const { dashboardVisited, setDashboardVisited } = useNavigationStore();
    const { uiConfig } = usePortfolioData();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
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
    }, [dashboardVisited, setDashboardVisited, isMobile]);

    return (
        <main role="main" className="relative" aria-label="Portfolio Dashboard">
            <h1 className="sr-only">{uiConfig.dashboardTitle}</h1>

            {isMobile ? (
                /* Mobile Layout */
                <div className="flex flex-col h-auto w-full gap-8 z-50 px-4">
                    <div className="h-45">
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

                    <div className="h-full">
                        <AboutMeCard />
                    </div>



                    <div className="h-25">
                        <ProjectHead />
                    </div>

                    <div className="bento-card border-blue h-75">
                        <Projects />
                    </div>

                    <div className="bento-card h-25">
                        <ProjectBottom />
                    </div>

                    <div className="bento-card h-75">
                        <StatsGitHub />
                    </div>

                    <div className="h-75">
                        <div className='flex flex-col justify h-70 gap-4'>
                            <div className='w-full h-full flex flex-row gap-4'>
                                <div className='flex-1 min-w-0'>
                                    <Contacts />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <GitHubFocusCard />
                                </div>
                            </div>
                            <div className='bento-card w-full h-25'>
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
                            <div className='col-span-2 w-full md:h-40 lg:h-50 items-center desktop-anim-item'>
                                <Profile />
                            </div>
                            <div className='col-span-4 md:40 lg:h-50 desktop-anim-item'>
                                <div className='flex flex-col justify-between gap-2 h-full'>
                                    <div className="md:h-30 lg:h-40 bento-card">
                                        <AboutMeCard />
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </div>
                            <div className='col-span-4 bento-card md:h-45 lg:h-40 desktop-anim-item'>
                                <MusicPlayer />
                            </div>
                            <div className='col-span-2 bento-card md:h-45 lg:h-40 desktop-anim-item'>
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
                                    <div className="flex-1">
                                        <Projects />
                                    </div>
                                    <div className="md:w-35 lg:w-full lg:max-w-40 lg:min-w-25">
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

            {/* Premium Frequency Visualization Center */}
            {!isMobile && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] desktop-anim-item">
                    <div
                        className="px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                        }}
                    >
                        <FrequencyCircles />
                    </div>
                </div>
            )}
        </main>
    )
}

export default Dashboard;