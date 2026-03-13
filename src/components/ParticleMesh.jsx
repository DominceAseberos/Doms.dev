import React, { useRef, useEffect, useMemo } from 'react';

const ParticleMesh = ({ mouseX, mouseY, isHovered }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const animationFrameId = useRef(null);

    // Grid configuration
    const rows = 20;
    const cols = 25;
    const padding = 20;

    // Initialize particles
    useEffect(() => {
        const initParticles = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;

            const cellWidth = canvas.width / cols;
            const cellHeight = canvas.height / rows;

            particles.current = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const bx = c * cellWidth + cellWidth / 2;
                    const by = r * cellHeight + cellHeight / 2;
                    particles.current.push({
                        bx, by, // base x, y
                        x: bx, y: by, // current x, y
                        vx: 0, vy: 0 // velocity
                    });
                }
            }
        };

        initParticles();
        window.addEventListener('resize', initParticles);
        return () => window.removeEventListener('resize', initParticles);
    }, []);

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = devicePixelRatio;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = mouseX * dpr;
            const my = mouseY * dpr;
            const forceRadius = 150 * dpr;
            const friction = 0.92;
            const spring = 0.08;

            particles.current.forEach(p => {
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (isHovered && dist < forceRadius) {
                    // Attraction force
                    const force = (forceRadius - dist) / forceRadius;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 1.5;
                    p.vy += Math.sin(angle) * force * 1.5;
                }

                // Spring back to base position
                const dxBase = p.bx - p.x;
                const dyBase = p.by - p.y;
                p.vx += dxBase * spring;
                p.vy += dyBase * spring;

                p.vx *= friction;
                p.vy *= friction;
                p.x += p.vx;
                p.y += p.vy;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.2 * dpr, 0, Math.PI * 2);
                ctx.fillStyle = isHovered && dist < forceRadius
                    ? `rgba(200, 255, 62, ${0.4 + (1 - dist / forceRadius) * 0.6})`
                    : 'rgba(255, 255, 255, 0.2)';
                ctx.fill();
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [mouseX, mouseY, isHovered]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    );
};

export default ParticleMesh;
