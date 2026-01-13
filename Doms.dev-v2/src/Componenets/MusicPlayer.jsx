import '../Style/musicStyle.css'

import { useState, useEffect, useCallback, useRef } from 'react';
const MusicPlayer = () => {
   
  const [isPlaying, setPlaying ] = useState(false);


  const togglePlayPause = useCallback (() =>{
     if(!isPlaying){
      setPlaying(true)
     }else
      setPlaying(false)
    }
  )

  /* title slider State */
  const textRef = useRef(null)
  const containerRef = useRef(null)
  const title = "Laufey - asdasdasd";
  const [shouldSlide, setShoudlSlide] = useState(false);

  useEffect(() => {
    if(textRef.current && containerRef.current){
      setShoudlSlide(
     textRef.current.scrollWidth > containerRef.current.offsetWidth
      );
    }
  }, [title])
 
  return (
    <>
    <div className='music-style flex  flex-col gap-2 justify-around'>

        <div className='flex flex-row w-full justify-center h-fit  gap-3 text-center p-2 '>
           <div className='w-12'>
            <img className='rounded' src="/en.jpg" alt="" />
           </div>
           <div ref={containerRef}

           className='flex flex-col w-32 overflow-hidden justify-center'>
            <p ref={textRef} 
            className={`whitespace-nowrap text-sm font-bold 
              ${shouldSlide ?
                 "title-slide"
                 : ""
                } `}>{title}</p>
            <p className='label-font font-bold '>Currently Playing</p>
          </div>
        </div>

      <div className="flex flex-row justify-center h-fit pb-2  gap-5">

        {/* SHUFFLE */}
        <button className='music-button'>
          <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"/>
          </svg>
       </button>
        {/* BACK */}
        <button >
          <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6v12m8-12v12l-8-6 8-6Z" />
          </svg>
        </button>


        {/* PLAY */}

        <button className='bg-blue-950 rounded-full p-1'
         onClick={togglePlayPause}>

          {isPlaying ?(
             <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
          </svg>
          
          )
          :
             <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd" />
          </svg>
          }
         

       
        </button>

      

        {/* FORWARD */}
        <button className=''
         onClick={""}>
          <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 6v12M8 6v12l8-6-8-6Z" />
          </svg>
        </button>
        {/* reapet */}
        <button>
          <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
        </svg>

        </button>
      </div>
 </div>
    </>
  );
};
export default MusicPlayer;

