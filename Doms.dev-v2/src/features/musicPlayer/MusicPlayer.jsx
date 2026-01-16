import React, { useState } from 'react'; 
import { useMusicPlayer } from './hooks';
import { AlbumInfo, Controls, ProgressBar, Visualizer } from './components';
import { marqueeStyle } from './styles/Marques';
import { useTrackID } from './hooks/useTrackID';
import { TRACKLIST } from './config/trackList';
const MusicPlayer = () => {
  const { trackID, setTrackID } = useTrackID();
  const [currentMood, setCurrentMood] = useState(Object.keys(TRACKLIST)[0]);
  
  const handleNextTrack = () => {
    console.group("🎵 Changing Track...");

    // 1. Find Current Category & Index
    const categories = Object.keys(TRACKLIST); // ['chill', 'gym', 'focus']
    let currentCategory = categories[0];
    
    // Robust search for current category
    for (const cat of categories) {
       if (TRACKLIST[cat].find(t => String(t.id) === String(trackID))) {
         currentCategory = cat;
         break;
       }
    }

    const currentPlaylist = TRACKLIST[currentCategory];
    const currentIndex = currentPlaylist.findIndex(t => String(t.id) === String(trackID));
    
    // 2. Calculate Next
    let nextSongIndex = currentIndex + 1;
    let nextCategory = currentCategory;

    // 3. Logic: Did we finish this category?
    if (nextSongIndex >= currentPlaylist.length || currentIndex === -1) {
        console.log(`✅ Finished ${currentCategory}. Moving to next category...`);
        
        // Find index of current category (e.g., 0 for chill)
        const currentCatIndex = categories.indexOf(currentCategory);
        let nextCatIndex = currentCatIndex + 1;

        // If we ran out of categories, loop back to the start (Chill)
        if (nextCatIndex >= categories.length) {
            console.log(" Playlist Loop: Back to Start");
            nextCatIndex = 0;
        }

        // Set up the new category
        nextCategory = categories[nextCatIndex];
        nextSongIndex = 0; // Start of new list
    }

    // 4. Get the ID
    const nextPlaylist = TRACKLIST[nextCategory];
    const nextTrackId = nextPlaylist[nextSongIndex].id;

    console.log(`⏭️ Next: ${nextCategory} [${nextSongIndex}] -> ID: ${nextTrackId}`);
    console.groupEnd();

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
        className="music-style flex flex-col gap-2 justify-around"
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
         onShuffle={handleShuffle}   // ✅ Pass logic
         currentMood={currentMood}
         loading={loading}   // ✅ Pass text
      />

        <div className="fixed flex justify-center items-center h-58 w-58 rounded-full bottom-0 -right-4 z-100">
          <Visualizer canvasRef={canvasRef} />
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
