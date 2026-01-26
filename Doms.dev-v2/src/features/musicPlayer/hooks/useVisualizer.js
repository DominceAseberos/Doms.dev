// hooks/useVisualizer.js
import { useRef, useCallback, useEffect } from 'react';

export const useVisualizer = (options = {}) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  const isPlayingRef = useRef(false);

  // LOGIC STATE
  const smoothBassRef = useRef(0);
  const particlesRef = useRef([]);

  // Refs defined at top level for consistent access
  const maxVolRef = useRef(100);
  const baseColorRef = useRef('165, 217, 196');
  const strokeColorRef = useRef('255, 255, 255');
  const wobbleCircle = useRef('16, 68, 255');

  // PERFORMANCE: Move color fetching into setup calls to avoid getComputedStyle on every render
  const updateColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    baseColorRef.current = style.getPropertyValue('--contrast-rgb').trim() || '165, 217, 196';
    strokeColorRef.current = style.getPropertyValue('--visualizer-effect-rgb').trim() || '255, 255, 255';
    wobbleCircle.current = style.getPropertyValue('--visualizer-effect-wobble-rgb').trim() || '16, 68, 255';
  }, []);

  const setupVisualizer = useCallback((audioElement) => {
    updateColors(); // Fetch colors once during setup
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
  }, []);

  const drawVisualizer = useCallback(() => {
    updateColors(); // Fetch colors once before starting animation loop
    if (!analyserRef.current || !canvasRef.current) return;

    isPlayingRef.current = true;
    if (animationRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      // Auto-sleep check
      if (!isPlayingRef.current && smoothBassRef.current < 0.01 && particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        return;
      }

      animationRef.current = requestAnimationFrame(renderFrame);

      if (isPlayingRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        dataArray.fill(0);
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const PADDING = 10;

      const MAX_CIRCLE_SIZE = 120;
      const availableSpace = Math.min(width, height) / 2;
      const maxRadius = Math.min(availableSpace, MAX_CIRCLE_SIZE) - PADDING;


      const now = performance.now();

      let frameVol = 0;
      for (let i = 0; i < bufferLength; i++) {
        frameVol += dataArray[i];
      }
      frameVol /= bufferLength;

      if (frameVol > maxVolRef.current) {
        maxVolRef.current = frameVol;
      } else {
        maxVolRef.current -= 0.1;
      }

      // Sensitivity Scale
      const scale = 255 / (Math.max(maxVolRef.current, 40));

      // --- FREQUENCY ANALYSIS ---
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

      // Apply Scale
      bass *= scale;
      mid *= scale;
      treble *= scale;

      smoothBassRef.current += (bass - smoothBassRef.current) * 0.15;
      const pulse = smoothBassRef.current;
      const kick = Math.max(0, bass - pulse);
      const kickPulse = Math.min(kick * 2.5, 1);

      const activeColor = kickPulse > 0.1
        ? `rgb(${strokeColorRef.current})`
        : `rgb(${baseColorRef.current})`;

      ctx.clearRect(0, 0, width, height);


      const glowBaseSize = maxRadius * 0.05;

      // Outer Halo 
      const glowRadius = glowBaseSize + (kickPulse * (maxRadius * 0.15) + pulse * (maxRadius * 0.15));

      // Inner Core Base 
      const glowRadiusSSmall = glowBaseSize + (kickPulse * (maxRadius * 0.04) + pulse * (maxRadius * 0.04));

      ctx.save();

      // --- LAYER 1: OUTER GLOW ---
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${strokeColorRef.current})`;
      ctx.fill();

      // --- LAYER 2: INNER CORE (Wobble) ---
      ctx.beginPath();
      const step = 0.02;

      for (let angle = 0; angle <= Math.PI * 2; angle += step) {

        // A. LIQUID BASE (Subtle movement)
        const liquid = Math.sin(angle * 5 + now * 0.002) * (bass * 2)
          + Math.cos(angle * 5 - now * 0.003) * (mid * 2);

        // B. TREBLE SPIKES (Sharp but contained)
        let spikes = 0;
        if (treble > 0.3) {
          spikes = Math.sin(angle * 50 + now * 0.01) * (treble * 4);
          if (angle % 0.2 < 0.05) spikes += treble * 2;
        }

        const expansion = kickPulse * 2;

        const totalDistortion = liquid + spikes + expansion;

        const r = glowRadiusSSmall + totalDistortion;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = `rgb(${wobbleCircle.current})`;
      ctx.fill();
      ctx.restore();

      // --- LAYER 3: PARTICLES ---
      if (treble > 0.2 && particlesRef.current.length < 60) {
        const spawnCount = Math.floor(treble * 2);
        for (let j = 0; j < spawnCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          const startDist = (maxRadius * 0.2) + Math.random() * (maxRadius * 0.2);
          particlesRef.current.push({
            x: cx + Math.cos(angle) * startDist,
            y: cy + Math.sin(angle) * startDist,
            vx: Math.cos(angle) * (1 + Math.random() * 3),
            vy: Math.sin(angle) * (1 + Math.random() * 3),
            life: 1.0,
            size: 2 + Math.random() * 3,
            color: activeColor
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
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- LAYER 4: MAIN BARS ---
      ctx.save();
      ctx.beginPath();
      const usefulLength = Math.floor(bufferLength * 0.25);
      for (let i = 0; i < usefulLength; i++) {
        const v = dataArray[i] / 255;
        const fadeOut = 1 - Math.pow(i / usefulLength, 2);
        const barHeight = v * (maxRadius * 0.7) * fadeOut;
        const percent = i / (usefulLength - 1);
        const baseAngle = percent * (Math.PI / 2);
        const innerCircleRadius = maxRadius * 0.15;
        const maxBarLength = barHeight * 0.4;

        [baseAngle, Math.PI - baseAngle, Math.PI + baseAngle, Math.PI * 2 - baseAngle].forEach(a => {
          const r1 = innerCircleRadius + (pulse * (maxRadius * 0.02));
          const r2 = r1 + maxBarLength * 2;
          ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
          ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        });
      }

      ctx.strokeStyle = `rgb(${baseColorRef.current} / 0.5)`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // --- LAYER 5: TREBLE STROKE ---
      ctx.beginPath();
      const trebleStart = Math.floor(usefulLength * 0.4);
      for (let i = trebleStart; i < usefulLength; i++) {
        const v = dataArray[i] / 255;
        if (v > 0.1) {
          const fadeOut = 1 - Math.pow(i / usefulLength, 2);
          const barHeight = v * (maxRadius * 0.95) * fadeOut;
          const percent = i / (usefulLength - 1);
          const baseAngle = percent * (Math.PI / 2);
          [baseAngle, Math.PI - baseAngle, Math.PI + baseAngle, Math.PI * 2 - baseAngle].forEach(a => {
            const r1Base = (maxRadius * 0.1) + (pulse * (maxRadius * 0.2));
            const r1 = r1Base + (barHeight * 0.6);
            const r2 = r1Base + barHeight;
            ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
            ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
          });
        }
      }

      ctx.strokeStyle = `rgb(${strokeColorRef.current})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    renderFrame();
  }, []);

  const stopVisualization = useCallback(() => {
    isPlayingRef.current = false;
  }, []);

  const resumeAudioContext = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return { canvasRef, setupVisualizer, drawVisualizer, stopVisualization, resumeAudioContext, audioContextRef };
};