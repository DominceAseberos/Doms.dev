import React, { useEffect, useRef } from 'react';
import useThemeStore from '../store/useThemeStore';

const FireflyCursor = () => {
    const canvasRef = useRef(null);
    const theme = useThemeStore((state) => state.theme);
    const isLightTheme = theme === 'light';

    useEffect(() => {
        if (isLightTheme) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let W, H, DPR;
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let hasMouse = false;

        const FIREFLY_COUNT = 30;
        const fireflies = Array.from({ length: FIREFLY_COUNT }, () => ({
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
            vx: 0,
            vy: 0,
            offsetX: (Math.random() - 0.5) * 100,
            offsetY: (Math.random() - 0.5) * 100,
            speed: 0.015 + Math.random() * 0.02,
            wobbleSpeed: 0.02 + Math.random() * 0.05,
            wobblePhase: Math.random() * Math.PI * 2,
            size: 1 + Math.random() * 1.5,
            blinkSpeed: 0.01 + Math.random() * 0.03,
            blinkPhase: Math.random() * Math.PI * 2,
        }));

        function resize() {
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }

        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e) => {
            hasMouse = true;
            mx = e.clientX;
            my = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        let animFrame;
        function tick() {
            animFrame = requestAnimationFrame(tick);
            ctx.clearRect(0, 0, W, H);

            fireflies.forEach(f => {
                let targetX = hasMouse ? mx + f.offsetX : W / 2 + f.offsetX;
                let targetY = hasMouse ? my + f.offsetY : H / 2 + f.offsetY;
                
                f.offsetX += (Math.random() - 0.5) * 1.5;
                f.offsetY += (Math.random() - 0.5) * 1.5;
                
                const maxOffset = hasMouse ? 80 : 200;
                if (f.offsetX > maxOffset) f.offsetX = maxOffset;
                if (f.offsetX < -maxOffset) f.offsetX = -maxOffset;
                if (f.offsetY > maxOffset) f.offsetY = maxOffset;
                if (f.offsetY < -maxOffset) f.offsetY = -maxOffset;

                const dx = targetX - f.x;
                const dy = targetY - f.y;
                
                f.vx += dx * f.speed;
                f.vy += dy * f.speed;
                
                f.vx *= 0.88;
                f.vy *= 0.88;
                
                f.x += f.vx;
                f.y += f.vy;

                f.wobblePhase += f.wobbleSpeed;
                const wx = Math.cos(f.wobblePhase) * 3;
                const wy = Math.sin(f.wobblePhase) * 3;

                f.blinkPhase += f.blinkSpeed;
                const alpha = 0.4 + 0.6 * Math.abs(Math.sin(f.blinkPhase));

                const px = f.x + wx;
                const py = f.y + wy;

                const grd = ctx.createRadialGradient(px, py, 0, px, py, f.size * 6);
                grd.addColorStop(0, `rgba(200, 255, 62, ${alpha * 0.8})`);
                grd.addColorStop(0.3, `rgba(150, 255, 50, ${alpha * 0.3})`);
                grd.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(px, py, f.size * 6, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(px, py, f.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            });
        }

        tick();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animFrame);
        };
    }, [theme, isLightTheme]);

    if (isLightTheme) return null;

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none" 
            style={{ zIndex: 9999 }}
        />
    );
};

export default FireflyCursor;
