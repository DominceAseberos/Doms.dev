import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. MAIN COLORS (Background/Primary)
const COLORS = {
  start: { r: 21,  g: 18,  b: 38 },   // 0% (Dark Purple)
  mid:   { r: 35,  g: 0,   b: 255 },  // 50% (Blue)
  end:   { r: 255, g: 0,   b: 208 },  // 100% (Pink)
};

// 2. CONTRAST COLORS (Text/Buttons) - Perfectly visible on top of Main
const CONTRAST = {
  start: { r: 209, g: 217, b: 255 },  
  mid:   { r: 193, g: 193, b: 100 },   
  end:   { r: 153,   g: 227, b: 237 }, 
};

const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

const updateThemeVariable = (percentage) => {
  if (typeof document === 'undefined') return;

  let r, g, b;       // Main Color
  let cr, cg, cb;    // Contrast Color

  if (percentage <= 50) {
    // RANGE 1: 0% to 50%
    const t = percentage / 50; 
    
    // Main
    r = lerp(COLORS.start.r, COLORS.mid.r, t);
    g = lerp(COLORS.start.g, COLORS.mid.g, t);
    b = lerp(COLORS.start.b, COLORS.mid.b, t);

    // Contrast
    cr = lerp(CONTRAST.start.r, CONTRAST.mid.r, t);
    cg = lerp(CONTRAST.start.g, CONTRAST.mid.g, t);
    cb = lerp(CONTRAST.start.b, CONTRAST.mid.b, t);

  } else {
    // RANGE 2: 50% to 100%
    const t = (percentage - 50) / 50;

    // Main
    r = lerp(COLORS.mid.r, COLORS.end.r, t);
    g = lerp(COLORS.mid.g, COLORS.end.g, t);
    b = lerp(COLORS.mid.b, COLORS.end.b, t);

    // Contrast
    cr = lerp(CONTRAST.mid.r, CONTRAST.end.r, t);
    cg = lerp(CONTRAST.mid.g, CONTRAST.end.g, t);
    cb = lerp(CONTRAST.mid.b, CONTRAST.end.b, t);
  }

  // Format strings
  const mainColor = `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
  const contrastColor = `${Math.round(cr)} ${Math.round(cg)} ${Math.round(cb)}`;

  // Set BOTH variables
  document.documentElement.style.setProperty('--theme-rgb', mainColor);
  document.documentElement.style.setProperty('--contrast-rgb', contrastColor);
};

export const useThemeStore = create(
  persist(
    (set) => ({
      sliderValue: 0,
      setTheme: (value) => {
        set({ sliderValue: value });
        updateThemeVariable(value);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) updateThemeVariable(state.sliderValue);
      },
    }
  )
);