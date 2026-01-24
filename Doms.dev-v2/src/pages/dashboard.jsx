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


const Dashboard = () => {
    return (
        <>
            {/* Mobile first */}
            
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
                <ProjectHead/>
            </div>

            {/* PROJECTS */}
            <div className="bento-card border-blue col-span-1 row-span-1 h-75">
                <Projects />
            </div>

            {/* bottom box */}
            <div className="bento-card col-span-1 row-span-1 h-25">
                <ProjectBottom />
            </div>

           <div className="bento-card col-span-1 row-span-1 h-75">
                <StatsGitHub />

         </div>

            <div className="col-span-1 row-span-1 h-75">
                <div className='flex flex-col justify h-55  gap-4'>
                    <div className='w-full h-full flex flex-row gap-4'>
                        <Contacts />
                        <GitHubFocusCard />
                    </div>
                    <div className='bento-card w-full h-25'>
                        <TechStacks />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;