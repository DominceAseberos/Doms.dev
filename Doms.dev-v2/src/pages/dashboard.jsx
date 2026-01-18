import MusicPlayer from '../features/musicPlayer/MusicPlayer'
import Profile from '../features/Profile'
import ThemeToggle from '../features/ThemeToggle'
import AboutMe from '../features/abooutMe/AboutMe'
import ChatBot from '../features/ChatBot'
import InteractiveGame from '../features/InteractiveGame'
import TechStack from '../features/TechStack'
import StatsGitHub from '../features/StatsGitHub'
import ActionButton from '../features/ActionButton'
import TechStackIcons from '../features/TechStackIcons'

const Dashboard = () => {
    return (
        <>
            {/* Mobile first */}
            {/* Top view profile */}
            <div className="col-span-6 row-span-2 ">

                <div className='flex justify w-full gap-4'>

                    <div className=' w-48  overflow-hidden ' 
                    >
                       <Profile/>
                   </div>

                    <div className='w-full flex flex-col gap-2'>

                        <div className=" flex-1 ">
                            <MusicPlayer/>
                        </div>
                        
                       <div className='' >
                        <ThemeToggle/>
                        </div>
                    </div>

                </div>
            </div>


          {/*ABOUT ME  */}
          <div className="
                bento-card col-span-6 row-span-2   
                "  
                style={{
                    background: `linear-gradient(
                        to bottom,
                         rgba(var(--box-Linear-1-rgb))  ,
                         rgba(var(--box-Linear-2-rgb))  
                    )`
                    }}
                >
                   <AboutMe/>
            </div>



                <div className="col-span-6 row-span-2 ">
                        <ChatBot/>
                 </div>


                 <div className="col-span-6 row-span-2 ">
                       <InteractiveGame/>
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
                    <div className='bento-card h-12' >
                        <ActionButton/>
                        </div>

                    <div className='bento-card h-full'>
                        <TechStackIcons/>
                        </div>
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