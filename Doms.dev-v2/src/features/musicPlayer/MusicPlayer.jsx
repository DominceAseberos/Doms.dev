import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMusicPlayer } from './hooks';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { AlbumInfo, Controls, ProgressBar, Visualizer } from './components';
import { buttonPausePathSVG, buttonPlayPathSVG } from './svgPath';
import { marqueeStyle } from './styles/Marques';
import { useTrackID } from './hooks/useTrackID';
import { OverlayDropdown } from './components/OverlayDropdown';

const MusicPlayer = () => {
  const { trackID, setTrackID } = useTrackID();
  const { trackList: TRACKLIST } = usePortfolioData();

  // Generate MOOD_OPTIONS dynamically from TRACKLIST
  const MOOD_OPTIONS = Object.keys(TRACKLIST).map(key => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  const [currentMood, setCurrentMood] = useState(() => {
    return localStorage.getItem('lastMood') || Object.keys(TRACKLIST)[0];
  });
  const [isVisualizerFull, setIsVisualizerFull] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);


  const handleNextTrack = () => {
    const currentPlaylist = TRACKLIST[currentMood];
    const currentIndex = currentPlaylist.findIndex(t => String(t.id) === String(trackID));

    let nextSongIndex = currentIndex + 1;
    let nextMood = currentMood;
    let nextPlaylist = currentPlaylist;

    if (nextSongIndex >= currentPlaylist.length || currentIndex === -1) {
      console.log(`✅ Finished ${currentMood}. Switching Mood...`);

      const moods = Object.keys(TRACKLIST);
      const currentMoodIndex = moods.indexOf(currentMood);
      let nextMoodIndex = currentMoodIndex + 1;

      if (nextMoodIndex >= moods.length) {
        nextMoodIndex = 0;
      }

      nextMood = moods[nextMoodIndex];
      nextPlaylist = TRACKLIST[nextMood];

      nextSongIndex = Math.floor(Math.random() * nextPlaylist.length);
    }


    const nextTrackId = nextPlaylist[nextSongIndex].id;

    console.log(`⏭️ New Mood: ${nextMood} | Song: ${nextSongIndex} | ID: ${nextTrackId}`);
    console.groupEnd();

    setCurrentMood(nextMood);
    setTrackID(nextTrackId);
    localStorage.setItem('lastMood', nextMood);
  };


  const handleShuffle = () => {
    const moods = Object.keys(TRACKLIST);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    const playlist = TRACKLIST[randomMood];
    const randomTrack = playlist[Math.floor(Math.random() * playlist.length)];

    setCurrentMood(randomMood);
    setTrackID(randomTrack.id);
    localStorage.setItem('lastMood', randomMood);
  };


  const handleMoodSelect = (selectedMood) => {

    const playlist = TRACKLIST[selectedMood];

    const randomTrackIndex = Math.floor(Math.random() * playlist.length);
    const randomTrackId = playlist[randomTrackIndex].id;

    setCurrentMood(selectedMood);
    setTrackID(randomTrackId);
    localStorage.setItem('lastMood', selectedMood);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenModal(false);
      } else {
        setIsOpenModal(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);



  const {
    isPlaying,
    togglePlayPause,
    progress,
    audioRef,
    currentPlaying,
    coverPhotoSrc,
    isMetadataLoading,
    isImageLoading,
    textRef,
    containerRef,
    shouldSlide,
    durationSlide,
    isBuffering,
    drawVisualizer,
    canvasRef,
  } = useMusicPlayer(trackID, handleNextTrack);

  // Ensure visualizer starts drawing when full view is opened
  useEffect(() => {
    if (isVisualizerFull) {
      drawVisualizer();
    }
  }, [isVisualizerFull, drawVisualizer]);

  return (
    <>
      <style>{marqueeStyle}</style>

      <div
        className="music-style w-full h-full flex flex-col justify-around relative z-20 overflow-hidden"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(var(--box-Linear-1-rgb)),
            rgba(var(--box-Linear-2-rgb))
          )`,
        }}
      >
        <AlbumInfo
          currentPlaying={currentPlaying}
          coverPhotoSrc={coverPhotoSrc}
          isMetadataLoading={isMetadataLoading}
          isImageLoading={isImageLoading}
          textRef={textRef}
          containerRef={containerRef}
          shouldSlide={shouldSlide}
          durationSlide={durationSlide}
        />

        <ProgressBar progress={progress} audioRef={audioRef} />

        <Controls
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
          onShuffle={handleShuffle}
          currentMood={currentMood}
          isMetadataLoading={isMetadataLoading}
          setOpenModal={setIsOpenModal}
          isOpenModal={isOpenModal}
          buttonRef={buttonRef}
          isBuffering={isBuffering}
          onNext={handleNextTrack}
          isVisualizerFull={isVisualizerFull}
          onToggleVisualizer={() => setIsVisualizerFull(!isVisualizerFull)}
        />

        <OverlayDropdown
          currentMood={currentMood}
          onMoodChange={handleMoodSelect}
          availableMoods={MOOD_OPTIONS}
          setOpenModal={setIsOpenModal}
          isOpenModal={isOpenModal}
          dropdownRef={dropdownRef}
        />
      </div>

      {/* Portal visualizer out of the card to bypass transform constraints */}
      {createPortal(
        isVisualizerFull ? (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xl cursor-default animate-in fade-in duration-500"
            onClick={() => setIsVisualizerFull(false)}
          >
            <div
              className="relative w-[90vw] h-[90vh] md:w-[80vw] md:h-[80vh] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button for full view */}
              <button
                onClick={() => setIsVisualizerFull(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer z-[10001]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="w-full h-full max-w-4xl max-h-4xl aspect-square flex items-center justify-center pointer-events-none">
                <Visualizer canvasRef={canvasRef} isFullView={true} />
              </div>

              <div className="absolute bottom-8 flex flex-col items-center gap-4">
                <div className="text-white/40 font-inter text-sm tracking-widest uppercase pointer-events-none">
                  Visualizer Full View
                </div>

                {/* Full Screen Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="p-4 rounded-full transition-transform cursor-pointer shadow-2xl flex items-center justify-center hover:scale-110"
                  style={{ backgroundColor: 'rgb(var(--contrast-rgb))' }}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg
                      className="w-6 h-6"
                      style={{ color: `rgb(var(--theme-rgb))` }}
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
                      className="w-6 h-6"
                      style={{ color: `rgb(var(--theme-rgb))` }}
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
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed flex justify-center items-center h-48 w-48 bottom-0 right-4 md:bottom-8 md:left-8 md:right-auto z-9999 pointer-events-none opacity-80">
            <Visualizer canvasRef={canvasRef} />
          </div>
        ),
        document.body
      )}
    </>
  );
};

export default MusicPlayer;
