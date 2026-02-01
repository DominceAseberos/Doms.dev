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
import PageLoader from '../components/PageLoader'

import { useDashboard } from '../features/dashboard/hooks/useDashboard'
import { useDashboardAnimation } from '../features/dashboard/hooks/useDashboardAnimation'

const Dashboard = () => {
    const {
        compRef,
        isMobile,
        isDataReady,
        revealReady,
        handleLoadComplete,
        uiConfig,
        dashboardVisited,
        setDashboardVisited
    } = useDashboard();

    useDashboardAnimation({
        isMobile,
        revealReady,
        compRef,
        dashboardVisited,
        setDashboardVisited
    });

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
                    <div ref={compRef} className='grid grid-cols-2 gap-x-5 px-12'>
                        <div className='col-span-1'>
                            <div className='grid grid-cols-6 gap-2'>

                                <div className="col-span-6 h-fit desktop-profile-row">
                                    <div className="flex flex-row gap-2 justify-between">
                                        <div className='h-[160px] w-[180px]'>
                                            <Profile />
                                        </div>

                                        <div className="h-[160px] w-full bento-card">
                                            <AboutMeCard />
                                        </div>

                                    </div>
                                </div>
                                <div className="col-span-6 desktop-theme-row">
                                    <ThemeToggle />

                                </div>
                                <div className='col-span-4 bento-card md:h-35 lg:h-35 desktop-music-row'>
                                    <MusicPlayer />
                                </div>
                                <div className='col-span-2 bento-card md:h-35 lg:h-35 desktop-music-row'>
                                    <Contacts />
                                </div>
                                <div className='col-span-6 bento-card md:h-50 lg:h-50 desktop-github-row'>
                                    <StatsGitHub />
                                </div>
                            </div>
                        </div>

                        <div className='col-span-1'>
                            <div className='grid grid-cols-6 gap-5'>
                                <div className='col-span-6 desktop-projecthead-row'>
                                    <ProjectHead />
                                </div>
                                <div className='col-span-6 md:h-75 lg:h-75'>
                                    <div className="flex flex-row h-full justify-between gap-2">
                                        <div className="flex-[2] min-w-0 desktop-projects-row">
                                            <Projects />
                                        </div>
                                        <div className="flex-1 md:max-w-32 lg:max-w-40 desktop-focus-row">
                                            <GitHubFocusCard />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-6 bento-card desktop-projectbottom-row'>
                                    <ProjectBottom />
                                </div>
                                <div className='col-span-6 bento-card desktop-techstacks-row'>
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
