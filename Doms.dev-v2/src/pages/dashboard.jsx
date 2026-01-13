import MusicPlayer from '../Componenets/MusicPlayer'
import Profile from '../Componenets/Profile'
import ThemeToggle from '../Componenets/ThemeToggle'
import AboutMe from '../Componenets/AboutMe'
import ChatBot from '../Componenets/ChatBot'
import InteractiveGame from '../Componenets/InteractiveGame'
import TechStack from '../Componenets/TechStack'
import StatsGitHub from '../Componenets/StatsGitHub'
import ActionButton from '../Componenets/ActionButton'
import TechStackIcons from '../Componenets/TechStackIcons'

const Dashboard = () => {
    return (
        <>
            {/* Mobile first */}
            {/* Top view profile */}
            <div className="col-span-4 row-span-2 ">

                <div className='flex justify w-full h-full gap-4'>

                    <div className='bento-card w-48'>
                       <Profile/>
                   </div>

                    <div className='w-full flex flex-col gap-2'>

                        <div className=" flex-1 ">
                            <MusicPlayer/>
                        </div>
                        
                       <p className='bento-card h-full min-h-8 max-h-10' >
                        <ThemeToggle/>
                        </p>
                    </div>

                </div>
            </div>

                {/* ABOUT ME */}
            <div className="
                bento-card col-span-4 row-span-2   
                ">
                   <AboutMe/>
                </div>

            {/* Interactive section */}  
                <div className="
                col-span-4 row-span-3 ">
                <div className='flex justify-betweeen gap-4 h-full w-full'>
                    <div className='bento-card flex w-full  h-full'>
                        <ChatBot/>
                    </div>  
                    <div className='bento-card flex w-full h-full'>
                   <InteractiveGame/>
                    </div>  
                </div>          
                </div>


            {/* PROJECT */} 
            
                <div className="bento-card  border-blue col-span-4 row-span-4 ">
                <TechStack/>
                </div>
                
            
                <div className="
                bento-card col-span-4 row-span-2 ">
                    <StatsGitHub/>
                    </div>

                {/* Bottom Section */}
        
                <div className="col-span-4 row-span-2 ">
                <div className='flex justify w-full h-full gap-4'>
                
                    <div className='w-full flex flex-col gap-4'>
                    <p className='bento-card h-12' >
                        <ActionButton/>
                        </p>

                    <p className='bento-card h-full'>
                        <TechStackIcons/>
                        </p>
                    </div>

                    <div className='bento-card w-48'>
                    <p>Profie</p>
                    </div>
                
                </div>
            </div>        
        
        </>
    )
} 

export default Dashboard;