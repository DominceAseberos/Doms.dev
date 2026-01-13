import '../Style/musicStyle.css'


import { useState, useEffect, useCallback } from 'react';
const MusicPlayer = () => {
   
  const [isPlaying, setPlaying ] = useState(false);


  const togglePlayPause = useCallback (() =>{
     if(!isPlaying){
      setPlaying(true)
     }else
      setPlaying(false)
    }
  )
  return (
    <>
    <div className='music-style flex flex-col gap-2 justify-around'>
        {/* BACKWARD */}

        <div className='music-title  text-center'>
          <p>Music Title</p>
        </div>

      <div className="flex flex-row justify-center h-12 gap-10">
        <button>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6v12m8-12v12l-8-6 8-6Z" />
          </svg>
        </button>
        {/* PLAY */}

        <button onClick={togglePlayPause}>

          {isPlaying ?(
             <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
          </svg>
          
          )
          :
             <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd" />
          </svg>
          }
         

       
        </button>

      

        {/* FORWARD */}
        <button>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 6v12M8 6v12l8-6-8-6Z" />
          </svg>
        </button>

      </div>
 </div>
    </>
  );
};
export default MusicPlayer;

