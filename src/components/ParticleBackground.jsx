import React, { useEffect, useRef, useState } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const gridRef = useRef(null);
    const inputRef = useRef(null);
    const clearBtnRef = useRef(null);
    const inputWrapRef = useRef(null);

    const [inputText, setInputText] = useState('');
    const [inputActive, setInputActive] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const offC = document.createElement('canvas');
        const offCtx = offC.getContext('2d');

        let W, H, DPR;
        let COUNT, CONNECT_DIST, MOUSE_DIST, TAIL_LENGTH, SPEED, DOT_RADIUS, GRID_SIZE;
        const DOT_COLOR = '#e8004d';

        function getConfig() {
            const w = window.innerWidth;
            if (w < 480) {
                COUNT = 40; DOT_RADIUS = 1.8; CONNECT_DIST = 80; MOUSE_DIST = 100; SPEED = 0.3; TAIL_LENGTH = 60; GRID_SIZE = 40;
            } else if (w < 768) {
                COUNT = 60; DOT_RADIUS = 2; CONNECT_DIST = 100; MOUSE_DIST = 130; SPEED = 0.35; TAIL_LENGTH = 80; GRID_SIZE = 50;
            } else if (w < 1280) {
                COUNT = 120; DOT_RADIUS = 2.2; CONNECT_DIST = 120; MOUSE_DIST = 160; SPEED = 0.4; TAIL_LENGTH = 100; GRID_SIZE = 60;
            } else {
                COUNT = 160; DOT_RADIUS = 2.2; CONNECT_DIST = 140; MOUSE_DIST = 180; SPEED = 0.45; TAIL_LENGTH = 120; GRID_SIZE = 60;
            }
        }

        let nodes = [];
        function syncNodes() {
            while (nodes.length < COUNT) {
                nodes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
                    tx: null, ty: null, locked: false
                });
            }
            if (nodes.length > COUNT) nodes.length = COUNT;
        }

        let currentText = '';

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
            if (currentText) sampleText(currentText);
        }

        resize();
        let resizeTimer;
        const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); };
        window.addEventListener('resize', handleResize);

        function sampleText(text) {
            if (!text) {
                nodes.forEach(n => { n.tx = null; n.ty = null; n.locked = false; });
                return;
            }

            const zone = { x: W * 0.04, y: H * 0.08, w: W * 0.92, h: H * 0.6 };
            offC.width = Math.floor(zone.w);
            offC.height = Math.floor(zone.h);
            offCtx.clearRect(0, 0, offC.width, offC.height);

            const fontSize = Math.min(zone.h * 0.75, zone.w / (text.length * 0.58));
            offCtx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
            offCtx.fillStyle = '#fff';
            offCtx.textBaseline = 'middle';
            offCtx.textAlign = 'center';
            offCtx.fillText(text.toUpperCase(), offC.width / 2, offC.height / 2);

            const imgData = offCtx.getImageData(0, 0, offC.width, offC.height).data;
            const step = Math.max(3, Math.floor(Math.sqrt((offC.width * offC.height) / (COUNT * 2))));
            const pts = [];
            for (let py = 0; py < offC.height; py += step) {
                for (let px = 0; px < offC.width; px += step) {
                    const idx = (py * offC.width + px) * 4;
                    if (imgData[idx + 3] > 100) {
                        pts.push({ x: zone.x + px, y: zone.y + py });
                    }
                }
            }

            for (let i = pts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pts[i], pts[j]] = [pts[j], pts[i]];
            }

            const used = Math.min(COUNT, pts.length);
            nodes.forEach((n, i) => {
                if (i < used) {
                    n.tx = pts[i].x;
                    n.ty = pts[i].y;
                    n.locked = false;
                } else {
                    n.tx = null; n.ty = null; n.locked = false;
                }
            });
        }

        let typeTimer;
        const handleInput = (e) => {
            clearTimeout(typeTimer);
            typeTimer = setTimeout(() => {
                currentText = e.target.value.trim();
                sampleText(currentText);
            }, 100);
        };

        const handleFocus = () => {
            setInputActive(true);
        };

        const handleBlur = () => {
            setInputActive(false);
            currentText = '';
            setInputText(''); // React state
            sampleText('');
        };

        const handleClear = () => {
            currentText = '';
            setInputText('');
            sampleText('');
            if (inputRef.current) inputRef.current.focus();
        };

        const inputEl = inputRef.current;
        const clearBtnEl = clearBtnRef.current;

        if (inputEl) {
            inputEl.addEventListener('focus', handleFocus);
            inputEl.addEventListener('blur', handleBlur);
            inputEl.addEventListener('input', handleInput);
        }
        if (clearBtnEl) {
            clearBtnEl.addEventListener('click', handleClear);
        }

        const stars = [];
        function spawnStar() {
            const fromTop = Math.random() < 0.5;
            const sx = fromTop ? Math.random() * W * 0.8 : 0;
            const sy = fromTop ? 0 : Math.random() * H * 0.4;
            const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
            const spd = 6 + Math.random() * 6;
            stars.push({ x: sx, y: sy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, trail: [], alpha: 0, fadeIn: true, life: 1 });
        }
        const maxStars = () => W < 768 ? 2 : 4;
        const starInterval = setInterval(() => { if (stars.length < maxStars()) spawnStar(); }, 2400);
        spawnStar();

        let mouse = { x: -9999, y: -9999 };
        let pulling = false, pullStrength = 0, longPressTimer = null;
        const PULL_RADIUS = 220, PULL_FORCE = 0.18;

        const handleMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const handleMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; pulling = false; pullStrength = 0; };
        const handleMouseDown = e => { if (e.target !== inputEl && e.target !== clearBtnEl) pulling = true; };
        const handleMouseUp = () => { pulling = false; pullStrength = 0; };

        const handleTouchMove = e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; };
        const handleTouchStart = e => {
            if (e.target === inputEl || e.target === clearBtnEl) return;
            mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY;
            longPressTimer = setTimeout(() => { pulling = true; }, 350);
        };
        const handleTouchEnd = () => {
            clearTimeout(longPressTimer); pulling = false; pullStrength = 0;
            mouse.x = -9999; mouse.y = -9999;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);


        const dist = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); };
        function drawLine(x1, y1, x2, y2, alpha, w = 0.8) {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(232,0,77,${alpha})`; ctx.lineWidth = w; ctx.stroke();
        }

        let animFrame;
        function tick() {
            animFrame = requestAnimationFrame(tick);
            ctx.clearRect(0, 0, W, H);

            const hasText = currentText.length > 0;

            if (pulling) pullStrength = Math.min(1, pullStrength + 0.04);
            else pullStrength = Math.max(0, pullStrength - 0.06);

            nodes.forEach(n => {
                if (n.tx !== null) {
                    const dx = n.tx - n.x, dy = n.ty - n.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d > 1.5) { n.vx += dx * 0.06; n.vy += dy * 0.06; }
                    else { n.locked = true; }
                }

                if (n.tx === null && hasText) {
                    const zx = W * 0.04 + W * 0.92 * 0.5;
                    const zy = H * 0.08 + H * 0.6 * 0.5;
                    const zw = W * 0.92 * 0.52;
                    const zh = H * 0.6 * 0.52;
                    const dx = n.x - zx, dy = n.y - zy;
                    if (Math.abs(dx) < zw && Math.abs(dy) < zh) {
                        const depthX = 1 - Math.abs(dx) / zw;
                        const depthY = 1 - Math.abs(dy) / zh;
                        const strength = Math.max(depthX, depthY) * 0.55;
                        const px = dx / zw, py = dy / zh;
                        const mag = Math.sqrt(px * px + py * py) || 1;
                        n.vx += (px / mag) * strength;
                        n.vy += (py / mag) * strength;
                    }
                }

                if (pullStrength > 0 && mouse.x > -999) {
                    const dx = mouse.x - n.x, dy = mouse.y - n.y;
                    const d = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (d < PULL_RADIUS) {
                        const force = PULL_FORCE * pullStrength * (1 - d / PULL_RADIUS);
                        n.vx += (dx / d) * force; n.vy += (dy / d) * force;
                        if (n.locked && pullStrength > 0.3) n.locked = false;
                    }
                }

                const damp = (n.tx !== null && !pulling) ? 0.70 : 0.98;
                n.vx *= damp; n.vy *= damp;

                if (!n.locked) { n.x += n.vx; n.y += n.vy; }

                if (n.tx === null) {
                    if (n.x < 0) { n.x = 0; n.vx *= -1; } if (n.x > W) { n.x = W; n.vx *= -1; }
                    if (n.y < 0) { n.y = 0; n.vy *= -1; } if (n.y > H) { n.y = H; n.vy *= -1; }
                }
            });

            const cd = hasText ? CONNECT_DIST * 0.65 : CONNECT_DIST;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                    if (d < cd) drawLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, (1 - d / cd) * (hasText ? 0.75 : 0.55));
                }
            }

            nodes.forEach(n => {
                const d = dist(mouse.x, mouse.y, n.x, n.y);
                if (d < MOUSE_DIST) drawLine(mouse.x, mouse.y, n.x, n.y, (1 - d / MOUSE_DIST) * 0.9);
            });

            for (let i = stars.length - 1; i >= 0; i--) {
                const s = stars[i];
                s.trail.push({ x: s.x, y: s.y });
                if (s.trail.length > TAIL_LENGTH) s.trail.shift();
                s.x += s.vx; s.y += s.vy;
                if (s.fadeIn) { s.alpha = Math.min(1, s.alpha + 0.06); if (s.alpha >= 1) s.fadeIn = false; }
                if (s.x > W + 100 || s.y > H + 100) s.life -= 0.05;
                if (s.life <= 0) { stars.splice(i, 1); continue; }
                const ba = s.alpha * s.life;
                for (let t = 1; t < s.trail.length; t++) {
                    const p = t / s.trail.length, a = p * p * ba * 0.85;
                    ctx.beginPath(); ctx.moveTo(s.trail[t - 1].x, s.trail[t - 1].y); ctx.lineTo(s.trail[t].x, s.trail[t].y);
                    ctx.strokeStyle = `rgba(232,0,77,${a})`; ctx.lineWidth = p * 2.2; ctx.lineCap = 'round'; ctx.stroke();
                }
                const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 14);
                grd.addColorStop(0, `rgba(255,80,120,${ba * 0.6})`);
                grd.addColorStop(0.4, `rgba(232,0,77,${ba * 0.2})`);
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,200,210,${ba})`; ctx.fill();
            }

            nodes.forEach(n => {
                const onTarget = n.tx !== null;
                if (onTarget) {
                    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 7);
                    g.addColorStop(0, 'rgba(232,0,77,0.4)'); g.addColorStop(1, 'transparent');
                    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, Math.PI * 2); ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(n.x, n.y, onTarget ? DOT_RADIUS * 1.4 : DOT_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = DOT_COLOR; ctx.fill();
            });

            if (mouse.x > -999) {
                if (pullStrength > 0) {
                    const rR = PULL_RADIUS * pullStrength;
                    const gR = ctx.createRadialGradient(mouse.x, mouse.y, rR * 0.7, mouse.x, mouse.y, rR);
                    gR.addColorStop(0, `rgba(232,0,77,${0.12 * pullStrength})`); gR.addColorStop(1, 'transparent');
                    ctx.fillStyle = gR; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, rR, 0, Math.PI * 2); ctx.fill();
                    ctx.save(); ctx.beginPath(); ctx.arc(mouse.x, mouse.y, rR, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(232,0,77,${0.35 * pullStrength})`;
                    ctx.lineWidth = 0.8; ctx.setLineDash([6, 8]); ctx.lineDashOffset = -Date.now() * 0.04; ctx.stroke(); ctx.restore();
                }
                ctx.beginPath(); ctx.arc(mouse.x, mouse.y, pulling ? 5 : 3.5, 0, Math.PI * 2);
                ctx.fillStyle = pulling ? '#e8004d' : '#fff'; ctx.fill();
                ctx.beginPath(); ctx.arc(mouse.x, mouse.y, pulling ? 16 : 12, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(232,0,77,${pulling ? 0.7 : 0.35})`; ctx.lineWidth = 1; ctx.stroke();
            }
        }

        tick();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);

            if (inputEl) {
                inputEl.removeEventListener('focus', handleFocus);
                inputEl.removeEventListener('blur', handleBlur);
                inputEl.removeEventListener('input', handleInput);
            }
            if (clearBtnEl) {
                clearBtnEl.removeEventListener('click', handleClear);
            }

            clearInterval(starInterval);
            cancelAnimationFrame(animFrame);
        };
    }, []);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    return (
        <div className="fixed inset-0 z-0 bg-black font-mono overflow-hidden" style={{ cursor: 'none' }}>
            <div
                ref={gridRef}
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                    `
                }}
            ></div>
            <canvas ref={canvasRef} className="block fixed inset-0 z-10"></canvas>

            <div
                ref={inputWrapRef}
                className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-[min(480px,90vw)] transition-opacity duration-400 ${inputActive ? 'opacity-75' : 'opacity-35 hover:opacity-75'}`}
            >
                <div className={`text-[10px] tracking-[0.2em] uppercase text-center transition-colors duration-300 ${inputActive ? 'text-white/20' : 'text-white/10'}`}>
                    Type anything — dots will form your <span className={inputActive ? 'text-[#e8004d]/60' : 'text-[#e8004d]/30'}>text</span>
                </div>
                <div className={`flex w-full border border-white/10 bg-black/60 backdrop-blur-[12px] overflow-hidden transition-all duration-300 ${inputActive ? 'border-[#e8004d]/50 shadow-[0_0_24px_rgba(232,0,77,0.08)]' : ''}`}>
                    <input
                        ref={inputRef}
                        type="text"
                        maxLength="12"
                        placeholder="Type here..."
                        autoComplete="off"
                        spellCheck="false"
                        value={inputText}
                        onChange={handleInputChange}
                        onMouseDown={e => e.stopPropagation()}
                        className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 font-mono text-[13px] tracking-[0.12em] text-[#f2f0ed] caret-[#e8004d] placeholder-white/20"
                    />
                    <button
                        ref={clearBtnRef}
                        onMouseDown={e => e.stopPropagation()}
                        className="px-[18px] bg-transparent border-none border-l border-white/5 text-[#e8004d]/50 text-base cursor-pointer transition-colors duration-200 hover:text-[#e8004d]"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticleBackground;
