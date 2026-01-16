import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioPlayback = (onEnded) => {
  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [isPlaying, setPlaying] = useState(false);

  // 1. Init the Ref
  const onEndedRef = useRef(onEnded);

  // 2. FIXED: Keep the Ref updated! (You were missing this)
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    audioRef.current.crossOrigin = 'anonymous';

    const handleTimeUpdate = () => {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(duration > 0 ? (current / duration) * 100 : 0);
    };

    const handleEnded = () => {
      setPlaying(false);
      setProgress(0);
      
      // Call the Ref (It always has the latest function)
      if (onEndedRef.current) {
        onEndedRef.current();
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('ended', handleEnded);
    };
    
    // 3. FIXED: Dependency array MUST be empty so listeners never "flicker"
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
    audioRef.current.src = src;
    audioRef.current.load();

    if (autoPlay) {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaying(true);
            })
            .catch((error) => {
              console.log("Auto-play prevented (Expected on first load).");
              setPlaying(false); 
            });
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
    play,
    pause, 
    setAudioSrc, 
    setCurrentTime 
  };
};