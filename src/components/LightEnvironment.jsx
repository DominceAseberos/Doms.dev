import React, { useEffect, useRef } from 'react';
import useThemeStore from '../store/useThemeStore';
import useLightPhysics from '../hooks/useLightPhysics';

const LightEnvironment = () => {
  const { theme } = useThemeStore();
  const canvasRef = useRef(null);

  // Initialize the light physics
  useLightPhysics();


  useEffect(() => {
    if (theme !== 'dark') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the light cone
    const drawCone = () => {
      // Set canvas to full width (max a bit to cover screen)
      const w = window.innerWidth;
      // Height can be enough to cover the top portion where cone fades out
      const h = Math.min(window.innerHeight, 700); 
      
      canvas.width = w;
      canvas.height = h;
      
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = 0; // Bulb is at top 90px but we position canvas top 90px

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 480);
      grd.addColorStop(0.00, 'rgba(255, 220, 100, 0.24)');
      grd.addColorStop(0.28, 'rgba(255, 180,  60, 0.13)');
      grd.addColorStop(0.60, 'rgba(255, 140,  20, 0.05)');
      grd.addColorStop(1.00, 'rgba(0,     0,   0, 0.00)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 360, h);
      ctx.lineTo(cx + 360, h);
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    };

    drawCone();
    
    // Redraw on resize
    window.addEventListener('resize', drawCone);
    return () => window.removeEventListener('resize', drawCone);
  }, [theme]);

  return (
    <>
      {/* AMBIENT WARM OVERLAY */}
      <div id="room-overlay"></div>
      
      {/* LIGHT CONE CANVAS */}
      <canvas 
        id="light-cone-canvas" 
        ref={canvasRef}
      />
    </>
  );
};

export default LightEnvironment;
