// hooks/useVisualizer.js
import { useRef, useCallback, useEffect } from 'react';

export const useVisualizer = (options = {}) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  const isPlayingRef = useRef(false);

  // Advanced mapping refs
  const presenceRef = useRef(0);
  const melodyRef = useRef(0);
  const interactionRef = useRef(0);
  const foundationRef = useRef(0);
  const creativityRef = useRef(0);
  const activityRef = useRef(0);
  const sustainRef = useRef(0);
  const sparkleRef = useRef(0);

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
    if (!analyserRef.current) return;

    isPlayingRef.current = true;
    if (animationRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      // Setup dynamic canvas lookup
      animationRef.current = requestAnimationFrame(renderFrame);

      if (isPlayingRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        dataArray.fill(0);
      }

      const canvas = canvasRef.current;
      const width = canvas ? canvas.width : 500;
      const height = canvas ? canvas.height : 500;
      const cx = width / 2;
      const cy = height / 2;
      const PADDING = 10;

      const availableSpace = Math.min(width, height) / 2;
      const maxRadius = availableSpace - PADDING;

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

      // --- ADVANCED FREQUENCY MAPPING ---
      let fnd = 0; for (let i = 0; i < 3; i++) fnd += dataArray[i] / 255; fnd /= 3;
      let sus = 0; for (let i = 3; i < 7; i++) sus += dataArray[i] / 255; sus /= 4;
      let cre = 0; for (let i = 2; i < 15; i++) cre += dataArray[i] / 255; cre /= 13;
      let mel = 0; for (let i = 12; i < 59; i++) mel += dataArray[i] / 255; mel /= 47;
      let int = 0; for (let i = 23; i < 47; i++) int += dataArray[i] / 255; int /= 24;
      let act = 0; for (let i = 20; i < 101; i++) act += dataArray[i] / 255; act /= 81;
      let spr = 0; for (let i = 58; i < 117; i++) spr += dataArray[i] / 255; spr /= 59;
      let pre = (fnd + sus + cre) / 3;

      const s = scale;
      fnd *= s; sus *= s; cre *= s; mel *= s; int *= s; act *= s; spr *= s; pre *= s;

      foundationRef.current += (fnd - foundationRef.current) * 0.2;
      sustainRef.current += (sus - sustainRef.current) * 0.1;
      creativityRef.current += (cre - creativityRef.current) * 0.15;
      melodyRef.current += (mel - melodyRef.current) * 0.15;
      interactionRef.current += (int - interactionRef.current) * 0.25;
      activityRef.current += (act - activityRef.current) * 0.2;
      sparkleRef.current += (spr - sparkleRef.current) * 0.25;
      presenceRef.current += (pre - presenceRef.current) * 0.05;

      const pFound = Math.min(Math.max(0, fnd - foundationRef.current) * 3.5, 1);
      const pSustain = Math.min(sustainRef.current * 0.8, 1);
      const pCreat = Math.min(Math.max(0, cre - creativityRef.current) * 2.5, 1);
      const pMelody = Math.min(melodyRef.current * 1.2, 1);
      const pInteract = Math.min(Math.max(0, int - interactionRef.current) * 4.0, 1);
      const pActivity = Math.min(Math.max(0, act - activityRef.current) * 3.0, 1);
      const pSparkle = Math.min(Math.max(0, spr - sparkleRef.current) * 5.0, 1);
      const pPresence = Math.min(presenceRef.current, 1);

      // --- GLOBAL AUDIO REACTIVE UI ---
      const root = document.documentElement.style;
      root.setProperty('--music-presence', pPresence.toFixed(3));
      root.setProperty('--music-melody', pMelody.toFixed(3));
      root.setProperty('--music-interaction', pInteract.toFixed(3));
      root.setProperty('--music-foundation', pFound.toFixed(3));
      root.setProperty('--music-creativity', pCreat.toFixed(3));
      root.setProperty('--music-activity', pActivity.toFixed(3));
      root.setProperty('--music-sustain', pSustain.toFixed(3));
      root.setProperty('--music-sparkle', pSparkle.toFixed(3));
      root.setProperty('--music-pulse', pFound.toFixed(3));

      // --- CANVAS RENDERING ---
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const activeColor = pFound > 0.1
        ? `rgb(${strokeColorRef.current})`
        : `rgb(${baseColorRef.current})`;

      ctx.clearRect(0, 0, width, height);


      const glowBaseSize = maxRadius * 0.05;

      // Outer Halo 
      const glowRadius = glowBaseSize + (pFound * (maxRadius * 0.15) + pPresence * (maxRadius * 0.15));

      // Inner Core Base 
      const glowRadiusSSmall = glowBaseSize + (pFound * (maxRadius * 0.04) + pPresence * (maxRadius * 0.04));

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
        const liquid = Math.sin(angle * 5 + now * 0.002) * (fnd * 2)
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