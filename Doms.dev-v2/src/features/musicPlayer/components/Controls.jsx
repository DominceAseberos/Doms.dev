import { LoadingPathSVG, buttonPausePathSVG, buttonPlayPathSVG } from "../svgPath"
export const Controls = ({

  isPlaying,
  togglePlayPause,
  onShuffle,
  currentMood,
  loading,
  setOpenModal,
  isOpenModal,
  buttonRef,
  isBuffering,
}) => {



  return (


    <div className="flex flex-row justify-center h-fit pb-2 gap-3">


      {/* SHUFFLE BUTTON */}
      <button className="active:scale-120 transition-all duration-200 "
        onClick={onShuffle}
        disabled={loading}
      >
        <svg className={loading ? "animate-tumble" : " "}

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
        className="rounded-full px-4 w-max  h-full flex items-center justify-center transition-all hover:brightness-110 active:scale-95"
        style={{ backgroundColor: `rgb(var(--contrast-rgb))` }}
      >
        <p className="text-black label-font font-bold uppercase text-xs tracking-wider">
          {currentMood || 'MOOD'}
        </p>
      </button>



      {/* PLAY */}
      <button
        className="active:scale-120 transition-all  w-max duration-200 rounded-full flex justify-center p-1"
        style={{
          backgroundColor: `rgb(var(--contrast-rgb))`,
        }}
        onClick={togglePlayPause}
      >
        {loading || isBuffering ? (
          <svg
            className={`animate-tumble w-6 h-6 text-[rgba(var(--box-Linear-1-rgb))]`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>


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


      {/* REPEAT */}

    </div>
  )
}

