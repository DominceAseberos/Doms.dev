import { useCallback, useMemo } from 'react';
import { useAudioPlayback } from './useAudioPlayback';
import { useVisualizer } from './useVisualizer';
import { useMarqueeText } from './useMarqueeText';
import { useFetchTrack } from './useFetchTrack';

export const useMusicPlayer = () => {
  const audioPlayback = useAudioPlayback();
  const visualizer = useVisualizer();
  
  const handleTrackLoaded = useCallback((streamURL) => {
    audioPlayback.setAudioSrc(streamURL);
  }, [audioPlayback]);

  const trackData = useFetchTrack(handleTrackLoaded);

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
      visualizer.drawVisualizer();
    }
    visualizer.resumeAudioContext();

    if (audioPlayback.isPlaying) {
      audioPlayback.pause();
      visualizer.stopVisualization();
    } else {
      audioPlayback.play();
      visualizer.drawVisualizer();
    }
  }, [audioPlayback, visualizer]);

  return {
    // Audio controls
    isPlaying: audioPlayback.isPlaying,
    togglePlayPause,
    progress: audioPlayback.progress,
    audioRef: audioPlayback.audioRef,
    setCurrentTime: audioPlayback.setCurrentTime,

    // Track info
    currentPlaying: trackData.currentPlaying,
    coverPhotoSrc: trackData.coverPhotoSrc,
    loading: trackData.loading,
    title,
    artistName,

    // Marquee
    textRef: marquee.textRef,
    containerRef: marquee.containerRef,
    shouldSlide: marquee.shouldSlide,
    durationSlide: marquee.durationSlide,

    // Visualizer
    canvasRef: visualizer.canvasRef,
  };
};