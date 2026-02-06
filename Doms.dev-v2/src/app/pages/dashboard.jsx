// src/pages/Dashboard.jsx
import MusicPlayer from '../features/musicPlayer/MusicPlayer'
import Profile from '../features/Profile'
import ThemeToggle from '../features/ThemeToggle'
import { AboutMeCard } from '../features/about'
import StatsGitHub from '../features/github/StatsGitHub'
import Contacts from '../features/contact/contact'
import GitHubFocusCard from '../features/FocusCard'
import TechStacks from '../features/techStacks/TechStacks'
import ProjectHead from '../features/projects/components/ProjectHead'
import Projects from '../features/projects/components/Projects'
import ProjectBottom from '../features/projects/components/ProjectBottom'
import FloatingChat from '../features/chatBot/floatingChat'
import WaterDroplet from '@app/components/WaterDroplet'
import PageLoader from '@app/components/PageLoader'


import { useDashboard } from '../features/dashboard/hooks/useDashboard'
import { useDashboardAnimation } from '../features/dashboard/hooks/useDashboardAnimation'
import { useRef, useState, useEffect } from 'react'
import { useLoader } from '@app/contexts/LoaderContext'

const Dashboard = () => {
    const dropletRef = useRef([]);
    const { initialLoadComplete, resetInitialLoad } = useLoader();

    const {
        compRef,
        isMobile,
        isDataReady,
        handleLoadComplete,
        uiConfig,
        dashboardVisited,
        setDashboardVisited
    } = useDashboard();

    const [revealReady, setRevealReady] = useState(initialLoadComplete || isDataReady);

    // Clear the flag after first Dashboard render so subsequent navigations show the loader
    useEffect(() => {
        if (initialLoadComplete) {
            resetInitialLoad();
        }
    }, []);

    useDashboardAnimation({
        isMobile,
        revealReady,
        compRef,
        dashboardVisited,
        setDashboardVisited,
        dropletRef // Pass ref to hook
    });

    return (
        <>
            <WaterDroplet ref={dropletRef} />
            {!revealReady && (
                <PageLoader
                    isLoading={!isDataReady}
                    onLoadComplete={() => setRevealReady(true)}
                />
            )}
            <main
                role="main"
                className="relative min-h-screen"
                aria-label="Portfolio Dashboard"
                style={{
                    opacity: revealReady ? 1 : 0,
                    transition: 'opacity 0.2s ease-out'
                }}
            >
                <h1 className="sr-only">{uiConfig ? uiConfig.dashboardTitle : 'Dashboard'}</h1>

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
                    <div className="hidden md:flex items-center justify-center min-h-screen w-full p-4 lg:p-8">
                        <div
                            ref={compRef}
                            className="w-full max-w-7xl h-fit grid grid-cols-2 gap-4 lg:gap-6"
                        >
                            {/* LEFT COLUMN */}
                            <div className='col-span-1 flex flex-col gap-2 lg:gap-4 h-full'>
                                {/* Profile & About Row */}
                                <div className="flex flex-col gap-2 lg:gap-4 flex-shrink-0">
                                    <div className="desktop-profile-row flex flex-row gap-2 lg:gap-4 h-full w-full">
                                        <div className="w-[130px] h-[130px] flex-shrink-0">
                                            <Profile />
                                        </div>
                                        <div className="flex-1">
                                            <AboutMeCard />
                                        </div>
                                    </div>
                                    <div className="desktop-theme-row flex-shrink-0">
                                        <ThemeToggle />
                                    </div>
                                </div>

                                {/* Music & Contacts Row */}
                                <div className="flex flex-row gap-2 lg:gap-4 w-full h-[180px] lg:h-[200px] justify-between flex-shrink-0">
                                    <div className='flex-1 min-w-0 desktop-music-row'>
                                        <MusicPlayer />
                                    </div>
                                    <div className='h-full aspect-square desktop-contacts-row'>
                                        <Contacts />
                                    </div>
                                </div>

                                {/* Github Stats - Fills remaining vertical space */}
                                <div className='bento-card flex-1 min-h-[300px] desktop-github-row'>
                                    <StatsGitHub />
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className='col-span-1 flex flex-col gap-2 lg:gap-4 h-full'>
                                {/* Top Section */}
                                <div className="desktop-projecthead-row flex-shrink-0">
                                    <ProjectHead />
                                </div>

                                {/* MIDDLE SECTION: Flexible Space Filler */}
                                <div className="flex-1 min-h-[300px]">
                                    <div className="flex flex-row gap-2 lg:gap-4 h-full">
                                        <div className="flex-1 desktop-projects-row h-full">
                                            <Projects />
                                        </div>
                                        <div className="w-1/3 desktop-focus-row h-full">
                                            <GitHubFocusCard />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Sections */}
                                <div className="desktop-projectbottom-row flex-shrink-0">
                                    <ProjectBottom />
                                </div>
                                <div className="desktop-techstacks-row flex-shrink-0">
                                    <TechStacks />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <FloatingChat />

            </main >
        </>
    )
}

export default Dashboard;
