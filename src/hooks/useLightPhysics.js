import { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import { useLenis } from 'lenis/react';

const useLightPhysics = () => {
  const { theme } = useThemeStore();
  const lenis = useLenis();

  useEffect(() => {
    const isDark = theme === 'dark';
    
    // We target all our main content blocks, but also allow nested elements to be targeted if they have the class
    const blocks = document.querySelectorAll('.lit-content-block');
    
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

        // Map to existing portfolio dark mode colors + warm bulb
        // Portfolio dark bg: #0c0c0c (12, 12, 12)
        // Warm bulb light: #ffdc64 (255, 220, 100)
        
        const isTransparent = block.classList.contains('lit-transparent');

        if (!isTransparent) {
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

        // Overall opacity for deep-shadow fade
        block.style.opacity = String(0.1 + brightness * 0.9);

        // Removed aggressive text color tinting to keep text and SVG colors crisp
        // and match the aesthetic of the custom motion cards.
      });
    };

    const resetPhysics = () => {
      blocks.forEach(block => {
        block.style.backgroundColor = '';
        block.style.borderColor = '';
        block.style.boxShadow = '';
        block.style.opacity = '';
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
