import { useRef, useCallback } from 'react';

// You can now pass options here!
export const useVisualizer = (options = {}) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  // LOGIC STATE
  const smoothBassRef = useRef(0);
  const lastBeatTimeRef = useRef(0);
  const beatColorHueRef = useRef(0);
  const particlesRef = useRef([]);

const colors = {

    
    base: options.colors?.base || 
          (getComputedStyle(document.documentElement).getPropertyValue('--contrast-rgb').trim() || '165, 217, 196'),
    
    highlight: options.colors?.highlight || '255, 255, 255', 
    hueSpeed: options.hueSpeed || 45 
  };

  const setupVisualizer = useCallback((audioElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;

      if (!sourceRef.current && audioElement) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }
  }, [colors.base]); 

const drawVisualizer = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      
      // NEW: Calculate a Dynamic Scale based on canvas size
      // If canvas is 800px, radius is 400px. We scale relative to that.
      const maxRadius = Math.min(width, height) / 2; 

      // 1. ANALYSIS
      let bass = 0, mid = 0, treble = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        if (i < 20) bass += v;
        else if (i < 100) mid += v;
        else treble += v;
      }
      bass /= 20;
      mid /= 80;
      treble /= (bufferLength - 100);

      smoothBassRef.current += (bass - smoothBassRef.current) * 0.15;
      const pulse = smoothBassRef.current;

      // 2. BEAT COLOR LOGIC
      const now = performance.now();
      if (bass > 0.6 && now - lastBeatTimeRef.current > 300) {
        beatColorHueRef.current += colors.hueSpeed;
        lastBeatTimeRef.current = now;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.filter = `hue-rotate(${beatColorHueRef.current}deg)`;

      // --- LAYER 1: CIRCLE GLOW (Made Bigger) ---
      // Base size is now 15% of the total available space
      const glowBaseSize = maxRadius * 0.15; 
      const glowRadius = glowBaseSize + (pulse * (maxRadius * 0.1)); 
      
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${colors.base} / ${0.1 + pulse * 0.3})`; 
      ctx.fill();
      ctx.restore(); 

      // --- LAYER 2: PARTICLES (Spawn further out) ---
      if (treble > 0.35) {
        const spawnCount = Math.floor(treble * 5);
        for (let j = 0; j < spawnCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          // Spawn particles between 20% and 40% of the radius
          const startDist = (maxRadius * 0.2) + Math.random() * (maxRadius * 0.2);
          
          particlesRef.current.push({
            x: cx + Math.cos(angle) * startDist,
            y: cy + Math.sin(angle) * startDist,
            vx: Math.cos(angle) * (1 + Math.random() * 3),
            vy: Math.sin(angle) * (1 + Math.random() * 3),
            life: 1.0,
            size: 2 + Math.random() * 3 // Slightly bigger particles
          });
        }
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.fillStyle = `rgb(${colors.highlight} / ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- LAYER 3: MAIN BARS (Scaled Up) ---
      ctx.save();
      ctx.filter = `hue-rotate(${beatColorHueRef.current}deg)`;
      
      ctx.beginPath();
      const usefulLength = Math.floor(bufferLength * 0.25);

      for (let i = 0; i < usefulLength; i++) {
        const v = dataArray[i] / 255;
        const fadeOut = 1 - Math.pow(i / usefulLength, 2);
        
        // SCALE HEIGHT: Bars can now take up 40% of the radius
        const barHeight = v * (maxRadius * 0.4) * fadeOut;
        
        const percent = i / (usefulLength - 1);
        const baseAngle = percent * (Math.PI / 2);

        [baseAngle, Math.PI - baseAngle, Math.PI + baseAngle, Math.PI * 2 - baseAngle].forEach(a => {
            // SCALE INNER RADIUS: Hole starts at 10% of radius
            const r1 = (maxRadius * 0.1) + (pulse * (maxRadius * 0.05));
            const r2 = r1 + barHeight;
            ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
            ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        });
      }

      ctx.strokeStyle = `rgb(${colors.base} / 0.5)`; 
      // Thicker lines for bigger canvas
      ctx.lineWidth = 4; 
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // --- LAYER 4: TREBLE STROKE ---
      ctx.beginPath();
      const trebleStart = Math.floor(usefulLength * 0.3); 
      for (let i = trebleStart; i < usefulLength; i++) {
        const v = dataArray[i] / 255;
        if (v > 0.1) {
            const fadeOut = 1 - Math.pow(i / usefulLength, 2);
            // Treble spikes are slightly taller (45% of radius)
            const barHeight = v * (maxRadius * 0.45) * fadeOut;
            const percent = i / (usefulLength - 1);
            const baseAngle = percent * (Math.PI / 2);

            [baseAngle, Math.PI - baseAngle, Math.PI + baseAngle, Math.PI * 2 - baseAngle].forEach(a => {
                const r1Base = (maxRadius * 0.1) + (pulse * (maxRadius * 0.05));
                const r1 = r1Base + (barHeight * 0.6); 
                const r2 = r1Base + barHeight;
                ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
                ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
            });
        }
      }

      ctx.strokeStyle = `red`; 
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    renderFrame();
  }, [colors.base, colors.highlight, colors.hueSpeed]);
  
  // ... (stopVisualization etc. remain same) ...
  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  return { canvasRef, setupVisualizer, drawVisualizer, stopVisualization, resumeAudioContext, audioContextRef };
};