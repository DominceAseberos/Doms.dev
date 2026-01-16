// hooks/useMusicPlayer.js
import { useCallback, useMemo, useRef } from 'react';
import { useAudioPlayback } from './useAudioPlay';
import { useVisualizer } from './useVisualizer';
import { useMarqueeText } from './useSliderText';
import { useFetchTrack } from './useFetchSong';

export const useMusicPlayer = (activeTrackId, onNextTrack) => {
  const audioPlayback = useAudioPlayback(() => {
    onNextTrack?.();
  });

  const visualizer = useVisualizer();
  const hasInteractedRef = useRef(false); // Track user clicks

const handleTrackLoaded = useCallback((streamURL) => {
      // Logic: AutoPlay ONLY if user has interacted previously
      const shouldAutoPlay = hasInteractedRef.current;
      
      console.log("💿 Track Loaded. Should AutoPlay?", shouldAutoPlay); // <--- LOG THIS

      audioPlayback.setAudioSrc(streamURL, shouldAutoPlay);
    },
    [audioPlayback]
  );

  const trackData = useFetchTrack(activeTrackId, handleTrackLoaded, onNextTrack);

  const title = useMemo(
    () => trackData.currentPlaying?.title || 'Unknown Song',
    [trackData.currentPlaying?.title]
  );

  const artistName = useMemo(
    () => trackData.currentPlaying?.user?.name || 'Unknown Artist',
    [trackData.currentPlaying?.user?.name]
  );

  const marquee = useMarqueeText(title);

  const togglePlayPause = useCallback(() => {
    // ... visualizer setup ...
    if (!visualizer.audioContextRef.current) {
       visualizer.setupVisualizer(audioPlayback.audioRef.current);
    }
    visualizer.resumeAudioContext();

    if (audioPlayback.isPlaying) {
      audioPlayback.pause();
      visualizer.stopVisualization();
    } else {
      audioPlayback.play();
      visualizer.drawVisualizer();
    }

    hasInteractedRef.current = true; 
    console.log(hasInteractedRef)
  }, [audioPlayback, visualizer]);

  return {
    // ... all your returns are fine ...
    isPlaying: audioPlayback.isPlaying,
    togglePlayPause,
    progress: audioPlayback.progress,
    audioRef: audioPlayback.audioRef,
    setCurrentTime: audioPlayback.setCurrentTime,
    currentPlaying: trackData.currentPlaying,
    coverPhotoSrc: trackData.coverPhotoSrc,
    loading: trackData.loading,
    title,
    artistName,
    textRef: marquee.textRef,
    containerRef: marquee.containerRef,
    shouldSlide: marquee.shouldSlide,
    durationSlide: marquee.durationSlide,
    canvasRef: visualizer.canvasRef,
  };
};