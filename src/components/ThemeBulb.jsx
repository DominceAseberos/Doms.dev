import React, { useState, useRef, useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import './ThemeBulb.css';

const EdisonBulbSVG = () => (
  <svg width="64" height="110" viewBox="0 0 64 110" xmlns="http://www.w3.org/2000/svg" id="edison-svg">
    <defs>
      <linearGradient id="brass-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4a3b22" />
        <stop offset="20%" stopColor="#8c7345" />
        <stop offset="50%" stopColor="#d1b46a" />
        <stop offset="80%" stopColor="#8c7345" />
        <stop offset="100%" stopColor="#3a2f1b" />
      </linearGradient>
      <linearGradient id="glass-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
      </linearGradient>
      <radialGradient id="glass-light" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="rgba(255, 230, 150, 0.4)" />
        <stop offset="70%" stopColor="rgba(255, 180, 50, 0.1)" />
        <stop offset="100%" stopColor="rgba(255, 120, 0, 0)" />
      </radialGradient>
      <pattern id="ribs" width="4" height="10" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#3a2f1b" strokeWidth="1.5" />
        <line x1="2" y1="0" x2="2" y2="10" stroke="#d1b46a" strokeWidth="1.5" />
      </pattern>
    </defs>

    {/* Socket Base */}
    <g id="socket">
      <rect x="27" y="0" width="10" height="8" fill="#111" />
      <rect x="22" y="8" width="20" height="18" fill="url(#brass-grad)" rx="1.5" />
      <rect x="22" y="12" width="20" height="10" fill="url(#ribs)" />
      <path d="M20 26 L44 26 L42 32 L22 32 Z" fill="url(#brass-grad)" />
    </g>

    {/* Glass Bulb ST64 Shape */}
    <path 
      id="glass-envelope"
      d="M23 32 C15 45 4 65 10 85 C16 105 48 105 54 85 C60 65 49 45 41 32 Z" 
      strokeWidth="1.5"
    />

    {/* Internal Components */}
    <g id="inner-stem">
      <path d="M29 32 L29 55 L35 55 L35 32" fill="rgba(255,255,255,0.15)" />
      <path d="M29 55 L20 75 M35 55 L44 75 M31 55 L26 80 M33 55 L38 80" stroke="#666" strokeWidth="0.8" fill="none" />
      <path id="filament" d="M20 75 L26 80 L32 70 L38 80 L44 75" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
    
    {/* Glass reflections */}
    <path d="M12 70 C8 85 20 100 32 102" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round"/>
    <path d="M50 75 C54 65 45 45 39 35" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

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
        <EdisonBulbSVG />
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
