import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioPlayback = (onEnded) => {
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [isBuffering, setBuffering] = useState(false);

  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.crossOrigin = 'anonymous';

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const duration = audio.duration;
      setProgress(duration > 0 ? (current / duration) * 100 : 0);
    };

    const handleEnded = () => {
      setPlaying(false);
      setProgress(0);
      if (onEndedRef.current) onEndedRef.current();
    };

    const handleWaiting = () => setBuffering(true);
    const handlePlaying = () => setBuffering(false);
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current.src) return;
    audioRef.current.play()
      .then(() => setPlaying(true))
      .catch(e => console.log('Playback prevented (User interaction needed):', e));
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setPlaying(false);
  }, []);

  const setAudioSrc = useCallback((src, autoPlay = true) => {
    const audio = audioRef.current;
    audio.src = src;
    audio.load();

    if (autoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    }
  }, []);

  const setCurrentTime = useCallback((time) => {
    audioRef.current.currentTime = time;
  }, []);

  return {
    audioRef,
    progress,
    isPlaying,
    setPlaying,
    isBuffering, // this will now work
    play,
    pause,
    setAudioSrc,
    setCurrentTime
  };
};
