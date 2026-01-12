import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<main className="h-auto md:h-screen w-full md:overflow-hidden p-4 md:p-8 bg-[#020617]">
      {/* Tailwind handles the 12-column logic and responsiveness */}
 <div className="grid h-full w-full grid-cols-2 grid-rows-32 gap-4 ">
        
        {/* Mobile first */}
        {/* Top view profile */}
      <div className="col-span-4 row-span-2 ">
        <div className='flex justify w-full h-full gap-4'>
          <div className='bento-card w-48'>
            <p>Profie</p>
            </div>
            <div className='w-full flex flex-col gap-2'>
            <p className='bento-card h-full'>Music Player</p>
            <p className='bento-card h-12' >Theme toggle</p>
            </div>
        </div>
       </div>
        {/* ABOUT ME */}
     <div className="
        bento-card col-span-4 row-span-2   
        ">About Me</div>

        
      {/* Interactive section */}  
        <div className="
         col-span-4 row-span-3 ">
          <div className='flex justify-betweeen gap-4 h-full w-full'>
              <div className='bento-card flex w-full  h-full'>
                Chat bot
              </div>  
              <div className='bento-card flex w-full h-full'>
               Game
              </div>  
          </div>          
        </div>


       {/* PROJECT */} 
     
        <div className="bento-card  border-blue col-span-4 row-span-4 ">
          Tech Stack
        </div>
        
       
        <div className="
        bento-card col-span-4 row-span-2 ">Stats</div>

        {/* Bottom Section */}
   
        <div className="col-span-4 row-span-2 ">
        <div className='flex justify w-full h-full gap-4'>
          
            <div className='w-full flex flex-col gap-4'>
              <p className='bento-card h-12' >Theme toggle</p>
              <p className='bento-card h-full'>Music Player</p>
            </div>

            <div className='bento-card w-48'>
              <p>Profie</p>
            </div>
         
        </div>
       </div>

      </div>
    </main>
   
    </>
  )
}
export default App
