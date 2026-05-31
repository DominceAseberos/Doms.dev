import { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import { useLenis } from 'lenis/react';

const useLightPhysics = () => {
  const { theme } = useThemeStore();
  
  // If Lenis is active, we can hook into its scroll. 
  // We'll also fall back to native scroll just in case.
  const lenis = useLenis();

  useEffect(() => {
    // We only apply physics in dark mode. 
    // In light mode, we reset everything.
    const isDark = theme === 'dark';

    const blocks = document.querySelectorAll('.lit-content-block');
    
    // Physics variables
    const bulbY = 90; // px from top of screen to bulb center
    const maxDist = 700; // how far light travels (can tweak for longer pages)

    const applyPhysics = () => {
      if (!isDark) return;

      blocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        // Calculate the center of the block relative to the viewport
        const blockCenterY = rect.top + rect.height / 2;
        
        // Distance from the bulb center
        const dist = Math.max(0, blockCenterY - bulbY);
        
        // Falloff calculation
        const t = Math.min(dist / maxDist, 1);
        const brightness = Math.pow(1 - t, 1.8);

        // ── background tint ──
        const r = Math.round(255 * brightness);
        const g = Math.round(200 * brightness);
        const b = Math.round(80 * brightness);
        const bg = 0.05 + brightness * 0.12; 
        
        // Use a CSS variable for the base background, or fallback to standard dark background
        // For standard blocks, we will override background
        block.style.backgroundColor = `rgba(${r},${g},${b},${bg})`;
        block.style.borderColor = `rgba(${r},${g},${b},${0.1 + brightness * 0.22})`;

        // ── text colors ──
        const lum = Math.round(55 + brightness * 200);
        const warm = Math.round(lum * 0.98);
        
        const textElements = block.querySelectorAll('h1, h2, h3, p, span, li');
        textElements.forEach(el => {
            // Give headers a slightly brighter pop
            const isHeader = ['H1', 'H2', 'H3'].includes(el.tagName);
            if (isHeader) {
                el.style.color = `rgb(${lum},${warm},${Math.round(lum * 0.52)})`;
            } else {
                el.style.color = `rgb(${Math.round(lum * 0.74)},${Math.round(warm * 0.70)},${Math.round(lum * 0.34)})`;
            }
        });

        // ── directional shadow (cast downward, away from bulb) ──
        const shadowLen = Math.round(4 + brightness * 26);
        const shadowBlur = Math.round(8 + (1 - brightness) * 22);
        const shadowAlpha = brightness * 0.6;
        
        block.style.boxShadow = brightness > 0.04
          ? `0 ${shadowLen}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}),
             inset 0 1px 0 rgba(255,220,80,${brightness * 0.14})`
          : 'none';

        // ── overall opacity for deep-shadow fade ──
        block.style.opacity = String(0.08 + brightness * 0.92);
      });
    };

    const resetPhysics = () => {
      blocks.forEach(block => {
        block.style.backgroundColor = '';
        block.style.borderColor = '';
        block.style.boxShadow = '';
        block.style.opacity = '';
        
        const textElements = block.querySelectorAll('h1, h2, h3, p, span, li');
        textElements.forEach(el => {
            el.style.color = '';
        });
      });
    };

    if (isDark) {
      applyPhysics();
    } else {
      resetPhysics();
    }

    // Scroll handling
    const handleScroll = () => {
      if (isDark) applyPhysics();
    };

    // If we have lenis, bind to its scroll, else bind to window
    if (lenis) {
        lenis.on('scroll', handleScroll);
    } else {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleScroll);

    return () => {
      if (lenis) {
          lenis.off('scroll', handleScroll);
      } else {
          window.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, [theme, lenis]);
};

export default useLightPhysics;
