import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioPlayback = () => {
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    audioRef.current.crossOrigin = 'anonymous';

    const handleTimeUpdate = () => {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const percent = duration > 0 ? (current / duration) * 100 : 0;
      setProgress(percent);
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  const play = useCallback(() => {
    audioRef.current.play().catch(e => console.log('Playback prevented:', e));
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setPlaying(false);
  }, []);

  const setAudioSrc = useCallback((src) => {
    audioRef.current.src = src;
    audioRef.current.load();
  }, []);

  const setCurrentTime = useCallback((time) => {
    audioRef.current.currentTime = time;
  }, []);

  return {
    audioRef,
    progress,
    isPlaying,
    setPlaying,
    play,
    pause,
    setAudioSrc,
    setCurrentTime,
  };
};
