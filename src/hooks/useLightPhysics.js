import { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import { useLenis } from 'lenis/react';

const useLightPhysics = () => {
  const { theme } = useThemeStore();
  const lenis = useLenis();

  useEffect(() => {
    const isDark = theme === 'dark';
    
    // Target all our main content blocks, plus specific elements we want to glow individually
    const blocks = document.querySelectorAll('.lit-content-block, .bg-svg-line, .ns-lyrics-text, .ns-ai-nodes-container, .ns-ai-web-integration, .contact-squiggles, .ns-hero-text, .ns-hero-card, .ns-tech-icon-carousel, .pinned-sticky-note');

    
    const bulbY = 90; 
    const maxDist = 1400; // Increased significantly to ensure the edges are comfortably visible

    const applyPhysics = () => {
      if (!isDark) return;
      
      const bulbX = window.innerWidth / 2;

      blocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        if (rect.top > window.innerHeight + 200 || rect.bottom < -200) {
            return;
        }

        const blockCenterX = rect.left + rect.width / 2;
        const blockCenterY = rect.top + rect.height / 2;
        
        // True 2D Euclidean distance from the bulb
        const dx = blockCenterX - bulbX;
        const dy = blockCenterY - bulbY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const t = Math.min(dist / maxDist, 1);
        // Softened the falloff curve (from 1.8 to 1.2) so light travels further with less steep decay
        const brightness = Math.pow(1 - t, 1.2);

        // Calculate a much tighter radius specifically for the bright glowing effect
        // so it only shines intensely when elements actually reach near the top.
        // Reduced to 450px so it only triggers in the top half of a standard screen.
        const glowFactor = Math.pow(Math.max(0, 1 - dist / 450), 3.0);


        // Map to existing portfolio dark mode colors + warm bulb
        // Portfolio dark bg: #0c0c0c (12, 12, 12)
        // Warm bulb light: #ffdc64 (255, 220, 100)
        
        // Text and lines that should become highly transparent in shadows
        const isTextLine = block.classList.contains('bg-svg-line') ||
                           block.classList.contains('ns-lyrics-text') ||
                           block.classList.contains('ns-ai-nodes-container') ||
                           block.classList.contains('ns-ai-web-integration') ||
                           block.classList.contains('contact-squiggles');

        // Solid colored cards that should preserve their background color but darken in shadows
        const isSolidColorCard = block.classList.contains('lit-transparent') || 
                                 block.classList.contains('ns-tech-icon-carousel') ||
                                 block.classList.contains('pinned-sticky-note') ||
                                 block.classList.contains('ns-project-card') ||
                                 block.classList.contains('ns-stack-group');

        if (!isTextLine && !isSolidColorCard) {
          // Background Tint (mix surface color with warm light based on brightness)
          const bgR = Math.round(12 + (255 - 12) * brightness * 0.15);
          const bgG = Math.round(12 + (220 - 12) * brightness * 0.15);
          const bgB = Math.round(12 + (100 - 12) * brightness * 0.15);
          const bgAlpha = 0.04 + (brightness * 0.15); 
          block.style.backgroundColor = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgAlpha})`;
          
          // Border Color
          const borderAlpha = 0.07 + (brightness * 0.2);
          block.style.borderColor = `rgba(255, 220, 100, ${borderAlpha})`;

          // Directional shadow
          const shadowLen = Math.round(4 + brightness * 26);
          const shadowBlur = Math.round(8 + (1 - brightness) * 22);
          const shadowAlpha = brightness * 0.4;
          
          block.style.boxShadow = brightness > 0.02
            ? `0 ${shadowLen}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}),
               inset 0 1px 0 rgba(255,220,100,${brightness * 0.15})`
            : 'none';
        }
        if (isTextLine) {
            // Overall opacity for deep-shadow fade
            block.style.opacity = String(0.1 + brightness * 0.9);
            
            // Only apply the glowing effect when glowFactor is active (i.e. near the top)
            block.style.filter = glowFactor > 0.01 
                ? `brightness(${1 + glowFactor * 0.4}) drop-shadow(0px 0px ${15 * glowFactor}px rgba(255, 220, 100, ${glowFactor * 0.4}))` 
                : '';
        } else if (isSolidColorCard) {
            block.style.opacity = '1'; // Never make solid cards translucent!
            
            // Base shadow brightness: 0.4 in shadows, 1.0 when illuminated by general brightness
            const baseBrightness = 0.4 + brightness * 0.6;
            
            // Add extreme bulb glow factor if very close to the top
            block.style.filter = glowFactor > 0.01
                ? `brightness(${baseBrightness + glowFactor * 0.4}) drop-shadow(0px 0px ${15 * glowFactor}px rgba(255, 220, 100, ${glowFactor * 0.4}))`
                : `brightness(${baseBrightness})`;
        } else {
            // For standard tint-overwritten blocks
            block.style.opacity = String(0.1 + brightness * 0.9);
            block.style.filter = glowFactor > 0.01 ? `brightness(${1 + glowFactor * 0.1})` : '';
        }
      });

    };

    const resetPhysics = () => {
      blocks.forEach(block => {
        block.style.backgroundColor = '';
        block.style.borderColor = '';
        block.style.boxShadow = '';
        block.style.opacity = '';
        block.style.filter = '';
      });
    };

    let timeoutId;
    let physicsEnabled = false;

    if (isDark) {
      timeoutId = setTimeout(() => {
        physicsEnabled = true;
        applyPhysics();
      }, 400); // Wait for CSS theme background transition to finish
    } else {
      resetPhysics();
    }

    const handleScroll = () => {
      if (isDark && physicsEnabled) applyPhysics();
    };

    if (lenis) {
        lenis.on('scroll', handleScroll);
    } else {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleScroll);

    return () => {
      clearTimeout(timeoutId);
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
