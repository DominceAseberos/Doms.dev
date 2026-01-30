import { memo, useRef } from 'react';
import { LoadingPathSVG, buttonPausePathSVG, buttonPlayPathSVG } from "../svgPath";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const Controls = memo(({
  isPlaying,
  togglePlayPause,
  onShuffle,
  currentMood,
  isMetadataLoading,
  setOpenModal,
  isOpenModal,
  buttonRef, // This is for the Mood button externally
  isBuffering,
  onNext,

}) => {
  const containerRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onEnter = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2, ease: "power2.out" });
  });

  const onLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" });
  });

  const onActive = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1.2, duration: 0.1, ease: "power2.out" });
  });

  return (
    <div ref={containerRef} className="flex flex-row justify-center h-fit pb-2 gap-3">
      {/* SHUFFLE BUTTON */}
      <button
        className="hover:cursor-pointer"
        onClick={onShuffle}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseDown={onActive}
        onMouseUp={onEnter}
        disabled={isMetadataLoading}
      >
        <svg className={isMetadataLoading ? "animate-tumble" : " "}
          fill="rgb(var(--contrast-rgb))" width="32px" height="32px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g fillRule="evenodd">
              {LoadingPathSVG.map((d, i) => (
                <path key={i} d={d}></path>
              ))}
            </g>
          </g>
        </svg>
      </button>

      {/*Mood TEXT button*/}
      <button
        ref={buttonRef}
        onClick={() => setOpenModal(!isOpenModal)}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseDown={onActive}
        onMouseUp={onEnter}
        className="rounded-full px-4 w-max m-1 flex items-center justify-center hover:cursor-pointer"
        style={{ backgroundColor: `rgb(var(--contrast-rgb))` }}
      >
        <p className="text-black label-font font-bold uppercase text-xs tracking-wider">
          {currentMood || 'MOOD'}
        </p>
      </button>

      {/* PLAY */}
      <button
        className="w-8 h-8 rounded-full flex justify-center p-1 hover:cursor-pointer"
        style={{
          backgroundColor: `rgb(var(--contrast-rgb))`,
        }}
        onClick={togglePlayPause}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseDown={onActive}
        onMouseUp={onEnter}
      >
        {isMetadataLoading || isBuffering ? (
          <div className="loading-spinner animate-spin" />
        ) : isPlaying ? (
          <svg
            className="w-max text-gray-800"
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
          <svg
            className="w-max text-gray-800"
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
        onClick={onNext}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseDown={onActive}
        onMouseUp={onEnter}
        className="w-max hover:cursor-pointer"
      >
        <svg className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          fill="none" viewBox="0 0 24 24"
          style={{
            color: `rgb(var(--contrast-rgb))`,
          }}
        >
          <path stroke="currentColor" strokeLinecap="round"
            strokeLinejoin="round" strokeWidth="2" d="M16 6v12M8 6v12l8-6-8-6Z" />
        </svg>
      </button>

    </div>
  );
});
