import React, { useState, useRef, useEffect } from 'react';
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

    if (nextSongIndex >= currentPlaylist.length || currentIndex === -1) {

      const moods = Object.keys(TRACKLIST);
      const currentMoodIndex = moods.indexOf(currentMood);
      let nextMoodIndex = currentMoodIndex + 1;

      if (nextMoodIndex >= moods.length) {
        nextMoodIndex = 0;
      }

      nextMood = moods[nextMoodIndex];
      nextSongIndex = 0;
    }

    // 4. Update Everything
    const nextPlaylist = TRACKLIST[nextMood];
    const nextTrackId = nextPlaylist[nextSongIndex].id;

    console.log(`⏭️ New Mood: ${nextMood} | Song: ${nextSongIndex} | ID: ${nextTrackId}`);
    console.groupEnd();

    // ✅ IMPORTANT: Update BOTH State and ID so the Dropdown updates too!
    setCurrentMood(nextMood);
    setTrackID(nextTrackId);
  };


  const handleShuffle = () => {
    console.log("🎲 Shuffling...");
    const moods = Object.keys(TRACKLIST);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    const playlist = TRACKLIST[randomMood];
    const randomTrack = playlist[Math.floor(Math.random() * playlist.length)];

    // Update both to trigger "New Song" logic
    setCurrentMood(randomMood);
    setTrackID(randomTrack.id);
  };


  const handleMoodSelect = (selectedMood) => {
    console.log(`🎯 Switching to Mood: ${selectedMood}`);

    // 1. Get the playlist for the chosen mood
    const playlist = TRACKLIST[selectedMood];

    // 2. Pick a random song from THIS playlist
    const randomTrackIndex = Math.floor(Math.random() * playlist.length);
    const randomTrackId = playlist[randomTrackIndex].id;

    // 3. Update State (Plays immediately)
    setCurrentMood(selectedMood);
    setTrackID(randomTrackId);
  };

useEffect(() => {
  const handleClickOutside = (event) => {
    // If dropdown exists and click is NOT inside dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenModal(false);
    } else {
      // Click is inside dropdown, do nothing
      setIsOpenModal(true); // optional, can omit if it's already true
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
    setCurrentTime,
    currentPlaying,
    coverPhotoSrc,
    loading,
    title,
    artistName,
    textRef,
    containerRef,
    shouldSlide,
    durationSlide,
    canvasRef,
  } = useMusicPlayer(trackID, handleNextTrack);

  return (
    <>
      <style>{marqueeStyle}</style>

      <div
        className="music-style flex flex-col gap-2 justify-around relative z-20"
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

        />

        
        <OverlayDropdown

          currentMood={currentMood}
          onMoodChange={handleMoodSelect}
          availableMoods={MOOD_OPTIONS}
          setOpenModal={setIsOpenModal}
          isOpenModal={isOpenModal}
          dropdownRef={dropdownRef}

        />


        <div className="fixed flex justify-center items-center h-58 w-58 rounded-full bottom-0 -right-4 z-100">
          <Visualizer canvasRef={canvasRef} />
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
