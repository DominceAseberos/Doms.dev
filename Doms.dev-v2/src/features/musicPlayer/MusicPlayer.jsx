import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMusicPlayer } from './hooks';
import { AlbumInfo, Controls, ProgressBar, Visualizer } from './components';
import { marqueeStyle } from './styles/Marques';
import { useTrackID } from './hooks/useTrackID';
import { TRACKLIST, MOOD_OPTIONS } from './config/trackList';
import { OverlayDropdown } from './components/OverlayDropdown';

const MusicPlayer = () => {
  const { trackID, setTrackID } = useTrackID();
  const [currentMood, setCurrentMood] = useState(Object.keys(TRACKLIST)[0]);
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
  };


  const handleShuffle = () => {
    const moods = Object.keys(TRACKLIST);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    const playlist = TRACKLIST[randomMood];
    const randomTrack = playlist[Math.floor(Math.random() * playlist.length)];

    setCurrentMood(randomMood);
    setTrackID(randomTrack.id);
  };


  const handleMoodSelect = (selectedMood) => {

    const playlist = TRACKLIST[selectedMood];

    const randomTrackIndex = Math.floor(Math.random() * playlist.length);
    const randomTrackId = playlist[randomTrackIndex].id;

    setCurrentMood(selectedMood);
    setTrackID(randomTrackId);
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
    loading,
    artistName,
    textRef,
    containerRef,
    shouldSlide,
    durationSlide,
    canvasRef,
    isBuffering,
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
          loading={loading}
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
          loading={loading}
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

      {/* Portal visualizer out of the card to bypass transform constraints */}
      {createPortal(
        <div className="fixed flex justify-center items-center h-48 w-48 bottom-0 right-4 z-9999 pointer-events-none opacity-80">
          <Visualizer canvasRef={canvasRef} />
        </div>,
        document.body
      )}
    </>
  );
};

export default MusicPlayer;
