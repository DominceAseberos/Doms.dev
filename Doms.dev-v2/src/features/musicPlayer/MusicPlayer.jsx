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

    </>
  );
};

export default MusicPlayer;
