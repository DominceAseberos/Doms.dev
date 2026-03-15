import React, { useEffect, useRef } from 'react';
import useThemeStore from '../store/useThemeStore';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const gridRef = useRef(null);
    const theme = useThemeStore((state) => state.theme);
    const isLightTheme = theme === 'light';
    const palette = {
        dot: isLightTheme ? 'rgba(18, 18, 18, 0.52)' : 'rgba(131, 10, 50, 0.5)',
        lineRgb: isLightTheme ? '18, 18, 18' : '232, 0, 77',
        glowRgb: isLightTheme ? '40, 40, 40' : '255, 80, 120',
        trailRgb: isLightTheme ? '18, 18, 18' : '232, 0, 77',
        coreRgb: isLightTheme ? '18, 18, 18' : '255, 200, 210',
        grid: isLightTheme
            ? 'rgba(0, 0, 0, 0.055)'
            : 'rgba(255, 255, 255, 0.028)',
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let W, H, DPR;
        let COUNT, CONNECT_DIST, TAIL_LENGTH, SPEED, DOT_RADIUS, GRID_SIZE;

        function getConfig() {
            const w = window.innerWidth;
            if (w < 480) {
                COUNT = 34; DOT_RADIUS = 1.6; CONNECT_DIST = 80; SPEED = 0.28; TAIL_LENGTH = 56; GRID_SIZE = 40;
            } else if (w < 768) {
                COUNT = 48; DOT_RADIUS = 1.8; CONNECT_DIST = 98; SPEED = 0.32; TAIL_LENGTH = 70; GRID_SIZE = 50;
            } else if (w < 1280) {
                COUNT = 92; DOT_RADIUS = 2; CONNECT_DIST = 112; SPEED = 0.36; TAIL_LENGTH = 88; GRID_SIZE = 60;
            } else {
                COUNT = 118; DOT_RADIUS = 2; CONNECT_DIST = 126; SPEED = 0.4; TAIL_LENGTH = 102; GRID_SIZE = 60;
            }
        }

        let nodes = [];
        function syncNodes() {
            while (nodes.length < COUNT) {
                nodes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED
                });
            }
            if (nodes.length > COUNT) nodes.length = COUNT;
        }

        function resize() {
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W * DPR; canvas.height = H * DPR;
            canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            getConfig(); syncNodes();
            if (gridRef.current) {
                gridRef.current.style.backgroundSize = `${GRID_SIZE}px ${GRID_SIZE}px`;
            }
        }

        resize();
        let resizeTimer;
        const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); };
        window.addEventListener('resize', handleResize);

        const stars = [];
        function spawnStar() {
            const sx = Math.random() * W;
            const sy = Math.random() * (H * 0.5); // Spawn mostly in the upper half so they can fall
            // Angle between 0 and PI means it will go downwards in canvas (y increases downwards)
            const angle = Math.random() * Math.PI;
            const spd = 6 + Math.random() * 6;
            stars.push({ x: sx, y: sy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, trail: [], alpha: 0, fadeIn: true, life: 1 });
        }
        const maxStars = () => W < 768 ? 1 : 2;
        const starInterval = setInterval(() => { if (stars.length < maxStars()) spawnStar(); }, 5000);
        spawnStar();

        const dist = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); };
        function drawLine(x1, y1, x2, y2, alpha, w = 0.8) {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${palette.lineRgb},${alpha})`; ctx.lineWidth = w; ctx.stroke();
        }

        let animFrame;
        function tick() {
            animFrame = requestAnimationFrame(tick);
            ctx.clearRect(0, 0, W, H);

            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy;

                if (n.x < 0) { n.x = 0; n.vx *= -1; } if (n.x > W) { n.x = W; n.vx *= -1; }
                if (n.y < 0) { n.y = 0; n.vy *= -1; } if (n.y > H) { n.y = H; n.vy *= -1; }
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    if (d < CONNECT_DIST) drawLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, (1 - d / CONNECT_DIST) * 0.24);
                }
            }

            for (let i = stars.length - 1; i >= 0; i--) {
                const s = stars[i];
                s.trail.push({ x: s.x, y: s.y });
                if (s.trail.length > TAIL_LENGTH) s.trail.shift();
                s.x += s.vx; s.y += s.vy;
                if (s.fadeIn) { s.alpha = Math.min(1, s.alpha + 0.06); if (s.alpha >= 1) s.fadeIn = false; }
                if (s.x < -100 || s.x > W + 100 || s.y < -100 || s.y > H + 100) s.life -= 0.05;
                if (s.life <= 0) { stars.splice(i, 1); continue; }
                const ba = s.alpha * s.life;
                for (let t = 1; t < s.trail.length; t++) {
                    const p = t / s.trail.length, a = p * p * ba * 0.42;
                    ctx.beginPath(); ctx.moveTo(s.trail[t - 1].x, s.trail[t - 1].y); ctx.lineTo(s.trail[t].x, s.trail[t].y);
                    ctx.strokeStyle = `rgba(${palette.trailRgb},${a})`; ctx.lineWidth = p * 1.6; ctx.lineCap = 'round'; ctx.stroke();
                }
                const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 14);
                grd.addColorStop(0, `rgba(${palette.glowRgb},${ba * 0.2})`);
                grd.addColorStop(0.4, `rgba(${palette.trailRgb},${ba * 0.12})`);
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${palette.coreRgb},${ba * 0.58})`; ctx.fill();
            }

            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = palette.dot; ctx.fill();
            });
        }

        tick();

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(starInterval);
            cancelAnimationFrame(animFrame);
        };
    }, [theme]);

    return (
        <div
            className="fixed inset-0 z-[-1] font-mono overflow-hidden pointer-events-none"
            style={{ backgroundColor: 'var(--bg)', transition: 'background-color 0.25s ease' }}
        >
            <div
                ref={gridRef}
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(${palette.grid} 1px, transparent 1px),
                        linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)
                    `
                }}
            ></div>
            <canvas ref={canvasRef} className="block fixed inset-0 pointer-events-none"></canvas>
        </div>
    );
};

export default ParticleBackground;
