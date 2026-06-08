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

        // Text Colors
        const textElements = block.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em, button');
        
        // Portfolio white: #f2f0ed (242, 240, 237)
        // Portfolio gray: #8d8d8d (141, 141, 141)
        textElements.forEach(el => {
            const isHeader = ['H1', 'H2', 'H3', 'STRONG'].includes(el.tagName);
            
            if (isHeader) {
                // Fades to a rich, warm golden color instead of white
                const r = Math.round(24 + (255 - 24) * brightness);
                const g = Math.round(24 + (210 - 24) * brightness);
                const b = Math.round(24 + (100 - 24) * brightness);
                el.style.color = `rgb(${r}, ${g}, ${b})`;
            } else {
                // Fades to a warm, sandy gray
                const r = Math.round(24 + (230 - 24) * brightness);
                const g = Math.round(24 + (190 - 24) * brightness);
                const b = Math.round(24 + (120 - 24) * brightness);
                el.style.color = `rgb(${r}, ${g}, ${b})`;
            }
        });

        // Apply a warm tint to images and graphics so they physically blend with the light
        const media = block.querySelectorAll('img, video, svg');
        media.forEach(el => {
             // In the dark: dim. In the light: bright with a heavy warm sepia tint
             const imgBrightness = 0.4 + (brightness * 0.6);
             const sepia = brightness * 0.5; // Adds up to 50% warm brown/yellow tint
             const contrast = 0.8 + (brightness * 0.3);
             el.style.filter = `brightness(${imgBrightness}) sepia(${sepia}) contrast(${contrast})`;
        });
      });
    };

    const resetPhysics = () => {
      blocks.forEach(block => {
        block.style.backgroundColor = '';
        block.style.borderColor = '';
        block.style.boxShadow = '';
        block.style.opacity = '';
        
        const textElements = block.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em, button');
        textElements.forEach(el => {
            el.style.color = '';
        });

        const media = block.querySelectorAll('img, video, svg');
        media.forEach(el => {
            el.style.filter = '';
        });
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
