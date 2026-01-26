import { memo } from 'react';
import { LoadingPathSVG, buttonPausePathSVG, buttonPlayPathSVG } from "../svgPath"

export const Controls = memo(({

  isPlaying,
  togglePlayPause,
  onShuffle,
  currentMood,
  isMetadataLoading,
  setOpenModal,
  isOpenModal,
  buttonRef,
  isBuffering,
  onNext,
}) => {



  return (


    <div className="flex flex-row justify-center h-fit pb-2 gap-3">


      {/* SHUFFLE BUTTON */}
      <button className="active:scale-120 transition-all duration-200  hover:scale-110 hover:cursor-pointer"
        onClick={onShuffle}
        disabled={isMetadataLoading}
      >
        <svg className={isMetadataLoading ? "animate-tumble" : " "}

          fill="rgb(var(--contrast-rgb))" width="32px" height="32px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"
            strokeWidth="0"></g><g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd">

                {LoadingPathSVG.map((d, i) => (
                  <path key={i} d={d}></path>
                ))}

              </g> </g></svg>
      </button>


      {/*Mood  TEXTT button*/}
      <button ref={buttonRef}
        onClick={() => setOpenModal(!isOpenModal)}
        className="rounded-full px-4 w-max  m-1 flex items-center justify-center transition-all hover:brightness-110 active:scale-95 hover:scale-110 hover:cursor-pointer"
        style={{ backgroundColor: `rgb(var(--contrast-rgb))` }}
      >
        <p className="text-black label-font font-bold uppercase text-xs tracking-wider">
          {currentMood || 'MOOD'}
        </p>
      </button>



      {/* PLAY */}
      <button
        className="active:scale-120 transition-all  w-8 h-8 duration-200 rounded-full flex justify-center p-1 hover:scale-110 hover:cursor-pointer"
        style={{
          backgroundColor: `rgb(var(--contrast-rgb))`,
        }}
        onClick={togglePlayPause}
      >
        {isMetadataLoading || isBuffering ? (

          <div className="loading-spinner" />

        ) : isPlaying ? (
          <svg
            className="active:scale-120 transition-all duration-200 w-max text-gray-800"
            style={{
              color: `rgb(var(--theme-rgb))`,
            }}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={buttonPausePathSVG}
            />
          </svg>
        ) : (
          // 3️⃣ Play Icon
          <svg
            className="active:scale-120 transition-all duration-200 w-max text-gray-800"
            style={{
              color: `rgb(var(--theme-rgb))`,
            }}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d={buttonPlayPathSVG}
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>


      {/* NEXT */}
      <button
        onClick={onNext} className="active:scale-120 transition-all  w-max duration-200 hover:scale-110 hover:cursor-pointer">

        <svg className="w-6 h-6 text-gray-800
       dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          fill="none" viewBox="0 0 24 24
      "
          style={{
            color: `rgb(var(--contrast-rgb))`,
          }}
        >
          <path stroke="currentColor" strokeLinecap="round"
            strokeLinejoin="round" strokeWidth="2" d="M16 6v12M8 6v12l8-6-8-6Z" />
        </svg>
      </button>


    </div>
  )
});
