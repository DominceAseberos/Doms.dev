// src/pages/Dashboard.jsx
import MusicPlayer from '../features/musicPlayer/MusicPlayer'
import Profile from '../features/Profile'
import ThemeToggle from '../features/ThemeToggle'
import AboutMe from '../features/abooutMe/AboutMe'
import ChatBot from '../features/chatBot/ChatBot'
import InteractiveGame from '../features/InteractiveGame'
import TechStack from '../features/TechStack'
import StatsGitHub from '../features/StatsGitHub'
import ActionButton from '../features/ActionButton'
import TechStackIcons from '../features/TechStackIcons'
import Calendar from '../features/Calendar'

const Dashboard = () => {
    return (
        <>
            {/* Mobile first */}
            
            <div className="col-span-1 row-span-1 h-45">
                <div className='flex justify w-full h-full gap-4'> 
                    <div className='w-48 h-full overflow-hidden'>
                        <Profile />
                    </div>
                    <div className='w-full h-full flex flex-col gap-4'> {/* Changed vertical gap to 4 too */}
                        <div className="flex-1">
                            <MusicPlayer />
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* ABOUT ME */}
            <div className="col-span-1 row-span-1 h-50">
                <AboutMe />
            </div>

            {/* CHATBOT */}
            <div className="col-span-1 row-span-1 h-75">
                <ChatBot />
            </div>

            {/* GAME */}
            <div className="col-span-1 row-span-1 h-75">
                <InteractiveGame />
            </div>

            {/* PROJECT */}
            <div className="bento-card border-blue col-span-1 row-span-1 h-75">
                <TechStack />
            </div>

            {/* GITHUB */}
            <div className="bento-card col-span-1 row-span-1 h-75">
                <StatsGitHub />
            </div>

            {/* 2. Bottom Section: Already had gap-4, kept as is */}
            <div className="col-span-1 row-span-1 h-75">
                <div className='flex justify w-full h-full gap-4'>
                    <div className='w-full flex flex-col gap-4'>
                        <ActionButton />
                        <TechStackIcons />
                    </div>
                    <div className='bento-card w-100'>
                        <Calendar />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;