// src/pages/Dashboard.jsx
import MusicPlayer from '../features/musicPlayer/MusicPlayer'
import Profile from '../features/Profile'
import ThemeToggle from '../features/ThemeToggle'
import AboutMe from '../features/abooutMe/AboutMe'
import ChatBot from '../features/chatBot/ChatBot'
import StatsGitHub from '../features/github/StatsGitHub'
import Contacts from '../features/contact/contact'
import GitHubFocusCard from '../features/FocusCard'
import TechStacks from '../features/techStacks/TechStacks'
import ProjectHead from '../features/projects/components/ProjectHead'
import Projects from '../features/projects/components/Projects'
import ProjectBottom from '../features/projects/components/ProjectBottom'
import FloatingChat from '../features/chatBot/floatingChat'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'


const Dashboard = () => {
    const comp = useRef(null);

    useLayoutEffect(() => {
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
                        ease: "power3.out"
                    }
                );
            });
        }, comp);

        return () => ctx.revert();
    }, []);

    return (
        <main role="main" aria-label="Portfolio Dashboard">
            {/* Screen reader accessible H1 for SEO */}
            <h1 className="sr-only">Domince A. Aseberos - Portfolio Dashboard</h1>

            {/* Mobile first */}
            <div className="flex flex-col h-auto w-full gap-8 md:hidden z-50">
                <div className="col-span-1 row-span-1 h-45">
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

                {/* ABOUT ME */}
                <div className="col-span-1 row-span-1 h-full">
                    <AboutMe />
                </div>

                {/* CHATBOT */}
                <div className="col-span-1 row-span-1 h-75">
                    <ChatBot />
                </div>

                {/* header box */}
                <div className="col-span-1 row-span-1 h-25">
                    <ProjectHead />
                </div>

                {/* PROJECTS */}
                <div className="bento-card border-blue col-span-1 row-span-1 h-75">
                    <Projects />
                </div>

                {/* bottom box */}
                <div className="bento-card col-span-1 row-span-1 h-25">
                    <ProjectBottom />
                </div>

                {/* Stats */}
                <div className="bento-card col-span-1 row-span-1 h-75">
                    <StatsGitHub />
                </div>

                <div className="col-span-1 row-span-1 h-75">
                    <div className='flex flex-col justify h-70  gap-4'>
                        <div className='w-full h-full flex flex-row gap-4 '>
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



            {/* large SCREEN */}
            <div ref={comp} className='hidden md:grid md:grid-cols-2 gap-x-5 px-12'>
                <div className='col-span-1'>
                    <div className='grid grid-cols-6 gap-2'>
                        <div className='col-span-2 w-full md:h-40 lg:h-50  items-center desktop-anim-item'>
                            <Profile />
                        </div>
                        <div className='col-span-4 md:40 lg:h-50 desktop-anim-item'>
                            <div className='flex flex-col justify-between gap-2 h-full'>
                                <div className="md:h-30 lg:h-40">
                                    <AboutMe />
                                </div>

                                <ThemeToggle />
                            </div>
                        </div>
                        <div className='col-span-4 md:h-45 lg:h-40 desktop-anim-item'>
                            <MusicPlayer />
                        </div>
                        <div className='col-span-2  md:h-45 lg:h-40 desktop-anim-item'>
                            <Contacts />
                        </div>
                        <div className='col-span-6 md:h-50 lg:h-50 desktop-anim-item'>
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
                                <div className="md:w-35  lg:w-full lg:max-w-40 lg:min-w-25">
                                    <GitHubFocusCard />
                                </div>
                            </div>
                        </div>
                        <div className='col-span-6 desktop-anim-item'>
                            <ProjectBottom />
                        </div>
                        <div className='col-span-6 desktop-anim-item'>
                            <TechStacks />
                        </div>
                        <FloatingChat />
                    </div >
                </div >
            </div >
        </main >
    )
}

export default Dashboard;