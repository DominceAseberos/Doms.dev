// src/pages/Dashboard.jsx
import MusicPlayer from '../features/musicPlayer/MusicPlayer'
import Profile from '../features/Profile'
import ThemeToggle from '../features/ThemeToggle'
import AboutMe from '../features/abooutMe/AboutMe'
import ChatBot from '../features/chatBot/ChatBot'
import StatsGitHub from '../features/StatsGitHub'
import ActionButton from '../features/ActionButton'
import TechStackIcons from '../features/TechStackIcons'
import Calendar from '../features/Calendar'
import ProjectHead from '../features/projects/components/ProjectHead'
import Projects from '../features/projects/components/Projects'
import ProjectBottom from '../features/projects/components/ProjectBottom'
import { useGSAP } from '@gsap/react'
import { initDashboardAnimations } from '../features/dashboard/animations/dashboardAnimations'

const Dashboard = () => {
  useGSAP(() => {
    initDashboardAnimations();
  }, []);

  return (
    <>
      {/* Mobile first */}

      <div className="col-span-1 row-span-1 h-45 animate-card">
        <div className='flex justify w-full h-full gap-4'>
          <div className='w-48 h-full overflow-hidden animate-item'>
            <Profile />
          </div>
          <div className='w-full h-full flex flex-col gap-4 animate-item'> {/* Changed vertical gap to 4 too */}
            <div className="flex-1">
              <MusicPlayer />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ABOUT ME */}
      <div className="col-span-1 row-span-1 h-full animate-card">
        <AboutMe />
      </div>

      {/* CHATBOT */}
      <div className="col-span-1 row-span-1 h-75 animate-card">
        <ChatBot />
      </div>

      {/* header box */}
      <div className="col-span-1 row-span-1 h-25 animate-card">
        <ProjectHead />
      </div>

      {/* PROJECTS */}
      <div className="bento-card border-blue col-span-1 row-span-1 h-75 animate-card">
        <Projects />
      </div>

      {/* bottom box */}
      <div className="bento-card col-span-1 row-span-1 h-25 animate-card">
        <ProjectBottom />
      </div>

      <div className="bento-card col-span-1 row-span-1 h-75 animate-card">
        <StatsGitHub />
      </div>
      {/* 2. Bottom Section: Already had gap-4, kept as is */}
      <div className="col-span-1 row-span-1 h-75 animate-card">
        <div className='flex justify w-full h-full gap-4'>
          <div className='w-full flex flex-col gap-4 animate-item'>
            <ActionButton />
            <TechStackIcons />
          </div>
          <div className='bento-card w-100 animate-item'>
            <Calendar />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;