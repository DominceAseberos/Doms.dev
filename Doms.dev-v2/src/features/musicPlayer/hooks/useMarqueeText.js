import { useState, useEffect, useRef } from 'react';

export const useMarqueeText = (title) => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldSlide, setShouldSlide] = useState(false);
  const [durationSlide, setDurationSlide] = useState(12);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const textWidth = textRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;
    const overflow = textWidth - containerWidth;

    if (overflow > 0) {
      setShouldSlide(true);
      const pixelsPerSecond = 50;
      const duration = textWidth / pixelsPerSecond;
      setDurationSlide(Math.max(duration, 12));
    } else {
      setShouldSlide(false);
    }
  }, [title]);

  return {
    textRef,
    containerRef,
    shouldSlide,
    durationSlide,
  };
};
