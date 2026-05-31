import React, { useState, useRef, useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import './ThemeBulb.css';

const ThemeBulb = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [isPulling, setIsPulling] = useState(false);
  const pendulumRef = useRef(null);

  const angle = useRef(0);
  const angularVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(0);

  // Real physics pendulum based on scroll inertia
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastTime.current = performance.now();
    let animationFrameId;

    const handleFrame = (time) => {
      const currentScrollY = window.scrollY;
      const dt = time - lastTime.current;
      
      // Calculate velocity (approximate pixels per frame at 60fps)
      const dy = currentScrollY - lastScrollY.current;
      const velocity = dt > 0 ? (dy / dt) * 16 : 0;
      
      // Map scroll velocity to a target angle (clamped between -40 and 40 degrees)
      const targetAngle = Math.max(Math.min(velocity * 0.15, 40), -40);
      
      // Spring physics values
      const tension = 0.05; // How strongly it pulls toward the target
      const friction = 0.92; // How long it takes to settle
      
      const force = (targetAngle - angle.current) * tension;
      angularVelocity.current = (angularVelocity.current + force) * friction;
      angle.current += angularVelocity.current;

      // Safety check for NaN
      if (isNaN(angle.current)) {
          angle.current = 0;
          angularVelocity.current = 0;
      }

      if (pendulumRef.current) {
        // Rotate the entire fixture from the top center
        // Only apply if it's moving to save performance, or if it's near zero to snap it
        pendulumRef.current.style.transform = `translateX(-50%) rotate(${angle.current}deg)`;
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = time;
      animationFrameId = requestAnimationFrame(handleFrame);
    };

    animationFrameId = requestAnimationFrame(handleFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleToggle = () => {
    setIsPulling(true);
    toggleTheme();
    
    // Reset pull animation
    setTimeout(() => {
      setIsPulling(false);
    }, 150);
  };

  return (
    <div id="bulb-pendulum" ref={pendulumRef}>
      <div id="bulb-wrap">
      <div id="bulb-wire"></div>
      <div id="bulb" onClick={handleToggle}>
        <div id="bulb-glass"></div>
        <div id="bulb-base"></div>
      </div>
      <div id="cord-wrap" onClick={handleToggle}>
        <div id="cord"></div>
        <div id="cord-pull" className={isPulling ? 'pull' : ''} title="Pull to toggle light"></div>
      </div>
      
      {/* Hint text only visible when light mode maybe? */}
      {theme === 'light' && (
        <div className="absolute top-full mt-4 text-[10px] text-neutral-500 opacity-60 tracking-wider w-max text-center pointer-events-none">
          ↑ pull cord
        </div>
      )}
      </div>
    </div>
  );
};

export default ThemeBulb;
