import '../Style/musicStyle.css'
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const MusicPlayer = () => {
  const [isPlaying, setPlaying] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const textRef = useRef(null)
  const containerRef = useRef(null)
  const [shouldSlide, setShouldSlide] = useState(false);
  const [coverPhotoSrc, setCoverPhotoSrc] = useState("/placeholderAlbum.jpg")
  const [loading, setLoading] = useState(true);
  const [durationSlide, setDurationSlide] = useState(12);

  const audioRef = useRef(new Audio());


/* TOGGLE BUTTONS */
  const togglePlayPause = useCallback(() => {
    if(isPlaying){
        audioRef.current.pause()
    }else{
      audioRef.current.play().catch(e => console.log("Playback prevented:", e));
    }
    setPlaying(prev => !prev);
  }, [isPlaying]);


useEffect(() => {
    const fetchMusicToPlay = async () => {
      try {
        const res = await axios.get(
          "https://api.audius.co/v1/tracks/22?app_name=MyPortfolio"
        );
        const track = res.data.data;
        setCurrentPlaying(track);

        const streamURL = `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=MyPortfolio`;
        audioRef.current.src = streamURL;
        audioRef.current.load();
        setPlaying(false);
        

        if (track.artwork?.["480x480"]) {
          const img = new Image();
          img.src = track.artwork["480x480"];
          img.onload = () => {
            setCoverPhotoSrc(track.artwork["480x480"]);
            setLoading(false);
          };
          img.onerror = () => {
            setCoverPhotoSrc("/placeholderAlbum.jpg");
            setLoading(false);
          };
        } else {
          setCoverPhotoSrc("/placeholderAlbum.jpg");
          setLoading(false);
        }
      } catch (err) {
        console.warn(err);
        setCoverPhotoSrc("/placeholderAlbum.jpg");
        setLoading(false);
      }
    };

    fetchMusicToPlay();

      return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  

/* MUSIC INFO */
const title =  currentPlaying?.title || "Unknown Song";
const artistName = currentPlaying?.user?.name || "Unknown Artist";


// check if text should slide
useEffect(() => {
  if (!textRef.current || !containerRef.current) return;

  const textWidth = textRef.current.scrollWidth;
  const containerWidth = containerRef.current.offsetWidth;

  const overflow = textWidth - containerWidth;

  if (overflow > 0) {
    setShouldSlide(true);
    const pixelsPerSecond = 50; 
    const duration = textWidth / pixelsPerSecond;

    setDurationSlide(Math.max(duration, 12));
  } else {
    setShouldSlide(false);
  }
}, [title]);


  return (
    <>
    <div className='music-style flex  flex-col gap-2 justify-around'>

        <div className='flex flex-row w-full justify-center h-fit  gap-3 text-center p-2 '>
         
            <div className="rounded border-sky-100 border-[1.4px] w-12 h-12 overflow-hidden flex items-center justify-center">
       
            {loading ? (
              <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-400 rounded-full animate-spin"></div>
                        ) : (
                          <img className='rounded'
                            src={coverPhotoSrc}
                            alt="Album Cover"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </div>
                <div ref={containerRef}
                  className='flex flex-col w-32 overflow-hidden justify-center'>
                    <p ref={textRef} 
                    className="whitespace-nowrap text-sm font-bold "
                    style={
                      shouldSlide ?
                      {
                        animation: `slide ${durationSlide}s linear infinite`,
                      }:{}
                    }
                        >  
                        {title}
                        </p>
                    <p className='label-font '>Artist: {artistName}</p>

                  </div>
                </div>

    {/*button controls  */}
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
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
          </svg>
          
          )
          :
             <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd" />
          </svg>
          }
         

       
        </button>

      

        {/* FORWARD */}
        <button className=''
         onClick={() => {}}>
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

