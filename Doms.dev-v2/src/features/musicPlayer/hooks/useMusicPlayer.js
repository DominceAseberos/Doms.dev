// hooks/useMusicPlayer.js
import { useCallback, useMemo, useRef } from 'react';
import { useAudioPlayback } from './useAudioPlay';

import { useMarqueeText } from './useSliderText';
import { useFetchTrack } from './useFetchSong';

export const useMusicPlayer = (activeTrackId, onNextTrack) => {
  const audioPlayback = useAudioPlayback(() => {
    onNextTrack?.();
  });


  const hasInteractedRef = useRef(false); // Track user clicks play btn

  const handleTrackLoaded = useCallback((streamURL) => {
    const shouldAutoPlay = hasInteractedRef.current;

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

    if (audioPlayback.isPlaying) {
      audioPlayback.pause();
    } else {
      audioPlayback.play();
    }

    hasInteractedRef.current = true;
  }, [audioPlayback]);

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

  };
};