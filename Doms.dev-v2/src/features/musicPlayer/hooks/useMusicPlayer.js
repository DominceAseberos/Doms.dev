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
  const hasInteractedRef = useRef(false); // Track user clicks play btn

  const handleTrackLoaded = useCallback((streamURL) => {
    const shouldAutoPlay = hasInteractedRef.current;

    audioPlayback.setAudioSrc(streamURL, shouldAutoPlay);

    if (shouldAutoPlay) {
      if (!visualizer.audioContextRef.current && audioPlayback.audioRef.current) {
        visualizer.setupVisualizer(audioPlayback.audioRef.current);
      }

      visualizer.resumeAudioContext();
      visualizer.drawVisualizer();
    }
  },
    [audioPlayback, visualizer]
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
  }, [audioPlayback, visualizer]);

  return {
    isPlaying: audioPlayback.isPlaying,
    togglePlayPause,
    progress: audioPlayback.progress,
    audioRef: audioPlayback.audioRef,
    isBuffering: audioPlayback.isBuffering,
    setCurrentTime: audioPlayback.setCurrentTime,
    currentPlaying: trackData.currentPlaying,
    coverPhotoSrc: trackData.coverPhotoSrc,
    isMetadataLoading: trackData.isMetadataLoading,
    isImageLoading: trackData.isImageLoading,
    title,
    artistName,
    textRef: marquee.textRef,
    containerRef: marquee.containerRef,
    shouldSlide: marquee.shouldSlide,
    durationSlide: marquee.durationSlide,
    canvasRef: visualizer.canvasRef,
    drawVisualizer: visualizer.drawVisualizer,
  };
};