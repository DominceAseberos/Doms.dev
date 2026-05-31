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
      // Height must cover the full viewport so the 1400px glow doesn't get cut off!
      const h = window.innerHeight; 
      
      canvas.width = w;
      canvas.height = h;
      
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = 90; // Center of bulb on screen

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1400);
      grd.addColorStop(0.00, 'rgba(255, 240, 150, 0.40)');
      grd.addColorStop(0.20, 'rgba(255, 200,  80, 0.20)');
      grd.addColorStop(0.50, 'rgba(255, 140,  20, 0.08)');
      grd.addColorStop(1.00, 'rgba(0,     0,   0, 0.00)');

      ctx.save();
      ctx.fillStyle = grd;
      // Fill the entire canvas area to create a perfect spherical bare-bulb glow
      ctx.fillRect(0, 0, w, h);
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
