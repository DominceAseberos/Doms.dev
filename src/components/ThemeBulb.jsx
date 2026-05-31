import React, { useState } from 'react';
import useThemeStore from '../store/useThemeStore';
import './ThemeBulb.css';

const ThemeBulb = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [isPulling, setIsPulling] = useState(false);

  const handleToggle = () => {
    setIsPulling(true);
    toggleTheme();
    
    // Reset pull animation
    setTimeout(() => {
      setIsPulling(false);
    }, 150);
  };

  return (
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
  );
};

export default ThemeBulb;
