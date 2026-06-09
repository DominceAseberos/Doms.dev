import React, { useEffect, useRef } from 'react';
import './PremiumMotionCards.css';

const PremiumMotionCards = () => {
    const initialized = useRef(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const lerp = (a, b, t) => a + (b - a) * t;

        // --- Card 1: 3-Tier Architecture ---
        function initCard1() {
            const zone = document.getElementById('pmc-vz1');
            const card = document.getElementById('pmc-card1');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%'); svg.setAttribute('height', '90'); svg.setAttribute('viewBox', '0 0 280 90');
            svg.style.overflow = 'visible';
            zone.appendChild(svg);

            const layers = [
                { y: 5, label: 'Presentation', color: 'rgba(56,139,229,0.9)', bg: 'rgba(56,139,229,0.12)', border: 'rgba(56,139,229,0.4)' },
                { y: 34, label: 'Business logic', color: 'rgba(56,139,229,0.7)', bg: 'rgba(56,139,229,0.08)', border: 'rgba(56,139,229,0.25)' },
                { y: 63, label: 'Data layer', color: 'rgba(56,139,229,0.5)', bg: 'rgba(56,139,229,0.05)', border: 'rgba(56,139,229,0.18)' }
            ];

            const rects = [], texts = [], connLines = [];
            layers.forEach((l, i) => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', '0'); r.setAttribute('y', l.y); r.setAttribute('width', '280'); r.setAttribute('height', '22');
                r.setAttribute('rx', '5'); r.setAttribute('fill', l.bg); r.setAttribute('stroke', l.border); r.setAttribute('stroke-width', '0.5');
                r.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                
                const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                tx.setAttribute('x', '14'); tx.setAttribute('y', l.y + 15);
                tx.setAttribute('fill', l.color); tx.setAttribute('font-size', '11'); tx.setAttribute('font-weight', '500'); tx.setAttribute('font-family', 'Inter,sans-serif');
                tx.textContent = l.label;
                
                g.appendChild(r); g.appendChild(tx); svg.appendChild(g);
                rects.push(r); texts.push(tx);

                if (i < 2) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', '140'); line.setAttribute('y1', l.y + 22); line.setAttribute('x2', '140'); line.setAttribute('y2', l.y + 29);
                    line.setAttribute('stroke', 'rgba(56,139,229,0.4)'); line.setAttribute('stroke-width', '0.5');
                    line.setAttribute('stroke-dasharray', '3 2');
                    line.style.transformOrigin = '140px ' + (l.y + 22) + 'px';
                    line.style.transform = 'scaleY(0)';
                    line.style.transition = 'transform 0.3s ease';
                    svg.appendChild(line); connLines.push(line);
                }

                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', '270'); dot.setAttribute('cy', l.y + 11); dot.setAttribute('r', '3');
                dot.setAttribute('fill', l.color); dot.setAttribute('opacity', '0.6');
                dot.style.transition = 'r 0.3s ease, opacity 0.3s ease';
                svg.appendChild(dot);
            });

            card.addEventListener('mouseenter', () => {
                rects[0].setAttribute('transform', 'translate(0,-7)'); texts[0].setAttribute('transform', 'translate(0,-7)');
                rects[2].setAttribute('transform', 'translate(0,7)'); texts[2].setAttribute('transform', 'translate(0,7)');
                connLines.forEach(l => l.style.transform = 'scaleY(1)');
                setTimeout(() => {
                    svg.querySelectorAll('circle').forEach(c => { c.setAttribute('r', '5'); c.setAttribute('opacity', '1') });
                }, 200);
            });
            card.addEventListener('mouseleave', () => {
                rects[0].setAttribute('transform', 'translate(0,0)'); texts[0].setAttribute('transform', 'translate(0,0)');
                rects[2].setAttribute('transform', 'translate(0,0)'); texts[2].setAttribute('transform', 'translate(0,0)');
                connLines.forEach(l => l.style.transform = 'scaleY(0)');
                svg.querySelectorAll('circle').forEach(c => { c.setAttribute('r', '3'); c.setAttribute('opacity', '0.6') });
            });
        }

        // --- Card 2: ML / AI ---
        function initCard2() {
            const zone = document.getElementById('pmc-vz2');
            const card = document.getElementById('pmc-card2');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const canvas = document.createElement('canvas');
            canvas.width = 300; canvas.height = 90; canvas.style.cssText = 'width:100%;height:90px;display:block';
            zone.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            const pts = [];
            const clusters = [
                { cx: 60, cy: 38, color: 'rgba(110,200,120,', r: 22, n: 9 },
                { cx: 150, cy: 55, color: 'rgba(56,139,229,', r: 20, n: 8 },
                { cx: 240, cy: 32, color: 'rgba(160,130,230,', r: 18, n: 7 }
            ];

            clusters.forEach(cl => {
                for (let i = 0; i < cl.n; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * cl.r;
                    pts.push({
                        ox: cl.cx + Math.cos(angle) * dist * 2.5,
                        oy: cl.cy + Math.sin(angle) * dist * 2.5,
                        tx: cl.cx + Math.cos(angle) * dist,
                        ty: cl.cy + Math.sin(angle) * dist,
                        x: 0, y: 0,
                        color: cl.color,
                        r: 2.5 + Math.random() * 1.5
                    });
                }
            });
            pts.forEach(p => { p.x = p.ox; p.y = p.oy });

            let prog = 0, active = false;

            function draw() {
                ctx.clearRect(0, 0, 300, 90);
                pts.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = p.color + '0.85)';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r + 2, 0, Math.PI * 2);
                    ctx.strokeStyle = p.color + '0.2)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            }

            function animate() {
                if (active && prog < 1) prog = Math.min(1, prog + 0.02);
                if (!active && prog > 0) prog = Math.max(0, prog - 0.015);
                const t = easeInOut(prog);
                pts.forEach(p => { p.x = lerp(p.ox, p.tx, t); p.y = lerp(p.oy, p.ty, t) });
                draw();
                requestAnimationFrame(animate);
            }
            animate();

            card.addEventListener('mouseenter', () => active = true);
            card.addEventListener('mouseleave', () => active = false);
        }

        // --- Card 3: NLP ---
        function initCard3() {
            const zone = document.getElementById('pmc-vz3');
            const card = document.getElementById('pmc-card3');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const words = [
                { text: 'salita', lang: 'tl', x: 0, y: 8 },
                { text: 'word', lang: 'en', x: 90, y: 8 },
                { text: 'pulong', lang: 'ceb', x: 168, y: 8 },
                { text: 'modelo', lang: 'tl', x: 8, y: 42 },
                { text: 'language', lang: 'en', x: 82, y: 42 },
                { text: 'bisaya', lang: 'ceb', x: 196, y: 42 },
                { text: 'saloobin', lang: 'tl', x: 0, y: 76 },
                { text: 'topic', lang: 'en', x: 108, y: 76 },
                { text: 'buhat', lang: 'ceb', x: 172, y: 76 },
            ];
            const colors = { tl: 'rgba(160,130,230,', en: 'rgba(100,170,240,', ceb: 'rgba(200,140,180,' };

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%'); svg.setAttribute('height', '90'); svg.setAttribute('viewBox', '0 0 280 90');
            zone.appendChild(svg);

            const els = [];
            words.forEach((w, i) => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                const tw = w.text.length * 7 + 16;
                r.setAttribute('x', w.x); r.setAttribute('y', w.y); r.setAttribute('width', tw); r.setAttribute('height', '20');
                r.setAttribute('rx', '10'); r.setAttribute('fill', colors[w.lang] + '0.1)'); r.setAttribute('stroke', colors[w.lang] + '0.3)'); r.setAttribute('stroke-width', '0.5');
                tx.setAttribute('x', w.x + tw / 2); tx.setAttribute('y', w.y + 14);
                tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('fill', colors[w.lang] + '0.9)');
                tx.setAttribute('font-size', '10'); tx.setAttribute('font-weight', '500'); tx.setAttribute('font-family', 'Inter,sans-serif');
                tx.textContent = w.text;
                g.appendChild(r); g.appendChild(tx);
                g.style.opacity = '0.6';
                g.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 40}ms`;
                svg.appendChild(g); els.push(g);
            });

            card.addEventListener('mouseenter', () => {
                els.forEach((el, i) => {
                    el.style.opacity = '0'; el.style.transform = 'translateY(-6px)';
                    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, i * 50 + 60);
                });
            });
            card.addEventListener('mouseleave', () => {
                els.forEach(el => { el.style.opacity = '0.6' });
            });
        }

        // --- Card 4: Mobile ---
        function initCard4() {
            const zone = document.getElementById('pmc-vz4');
            const card = document.getElementById('pmc-card4');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%'); svg.setAttribute('height', '90'); svg.setAttribute('viewBox', '0 0 280 90');
            zone.appendChild(svg);

            const phoneW = 44, phoneH = 78, phoneX = 118, phoneY = 6, rx = 7;
            const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            frame.setAttribute('x', phoneX); frame.setAttribute('y', phoneY); frame.setAttribute('width', phoneW); frame.setAttribute('height', phoneH);
            frame.setAttribute('rx', rx); frame.setAttribute('fill', 'rgba(240,170,60,0.07)');
            frame.setAttribute('stroke', 'rgba(240,170,60,0.5)'); frame.setAttribute('stroke-width', '1');
            frame.style.transition = 'stroke 0.3s ease';
            svg.appendChild(frame);

            const notch = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            notch.setAttribute('x', phoneX + 14); notch.setAttribute('y', phoneY + 4); notch.setAttribute('width', 16); notch.setAttribute('height', 4);
            notch.setAttribute('rx', '2'); notch.setAttribute('fill', 'rgba(240,170,60,0.3)');
            svg.appendChild(notch);

            const bars = [
                { x: phoneX + 6, y: phoneY + 18, w: 32, h: 5, delay: 0 },
                { x: phoneX + 6, y: phoneY + 29, w: 24, h: 4, delay: 80 },
                { x: phoneX + 6, y: phoneY + 39, w: 28, h: 4, delay: 160 },
                { x: phoneX + 6, y: phoneY + 49, w: 20, h: 4, delay: 240 },
            ];
            const barEls = [];
            bars.forEach(b => {
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', b.x); r.setAttribute('y', b.y); r.setAttribute('width', 0); r.setAttribute('height', b.h);
                r.setAttribute('rx', '2'); r.setAttribute('fill', 'rgba(240,170,60,0.55)');
                r.style.transition = `width 0.4s cubic-bezier(0.34,1.56,0.64,1) ${b.delay}ms`;
                svg.appendChild(r); barEls.push({ el: r, w: b.w });
            });

            const homeBtn = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            homeBtn.setAttribute('cx', phoneX + phoneW / 2); homeBtn.setAttribute('cy', phoneY + phoneH - 7); homeBtn.setAttribute('r', 0);
            homeBtn.setAttribute('fill', 'rgba(240,170,60,0.4)'); homeBtn.setAttribute('stroke', 'rgba(240,170,60,0.6)'); homeBtn.setAttribute('stroke-width', '0.5');
            homeBtn.style.transition = 'r 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.35s';
            svg.appendChild(homeBtn);

            const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ripple.setAttribute('cx', phoneX + phoneW / 2); ripple.setAttribute('cy', phoneY + phoneH / 2); ripple.setAttribute('r', 0);
            ripple.setAttribute('fill', 'none'); ripple.setAttribute('stroke', 'rgba(240,170,60,0.2)'); ripple.setAttribute('stroke-width', '1');
            svg.appendChild(ripple);

            const leftBars = [];
            [[0, 20, 5], [0, 32, 5], [0, 44, 5], [0, 56, 5]].forEach((b, i) => {
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', b[0]); r.setAttribute('y', b[1]); r.setAttribute('width', 0); r.setAttribute('height', b[2]);
                r.setAttribute('rx', '2'); r.setAttribute('fill', 'rgba(240,170,60,0.2)');
                r.style.transition = `width 0.35s ease ${i * 60 + 300}ms`;
                svg.appendChild(r); leftBars.push({ el: r, w: 60 + Math.random() * 40 });
            });
            const rightBars = [];
            [[220, 20, 5], [220, 32, 5], [220, 44, 5]].forEach((b, i) => {
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', b[0]); r.setAttribute('y', b[1]); r.setAttribute('width', 0); r.setAttribute('height', b[2]);
                r.setAttribute('rx', '2'); r.setAttribute('fill', 'rgba(240,170,60,0.15)');
                r.style.transition = `width 0.3s ease ${i * 50 + 400}ms`;
                svg.appendChild(r); rightBars.push({ el: r, w: 40 + Math.random() * 30 });
            });

            let rippleRaf = null;
            card.addEventListener('mouseenter', () => {
                frame.setAttribute('stroke', 'rgba(240,170,60,0.9)');
                barEls.forEach(b => b.el.setAttribute('width', b.w));
                homeBtn.setAttribute('r', 4);
                leftBars.forEach(b => b.el.setAttribute('width', b.w));
                rightBars.forEach(b => b.el.setAttribute('width', b.w));
                let rr = 0, maxR = 70, start = null;
                function animRipple(ts) {
                    if (!start) start = ts;
                    rr = ((ts - start) / 800) * maxR;
                    const op = Math.max(0, 0.3 - (rr / maxR) * 0.3);
                    ripple.setAttribute('r', rr); ripple.setAttribute('stroke-width', 1 - rr / maxR);
                    ripple.setAttribute('opacity', op);
                    if (rr < maxR) rippleRaf = requestAnimationFrame(animRipple);
                }
                rippleRaf = requestAnimationFrame(animRipple);
            });
            card.addEventListener('mouseleave', () => {
                frame.setAttribute('stroke', 'rgba(240,170,60,0.5)');
                barEls.forEach(b => b.el.setAttribute('width', 0));
                homeBtn.setAttribute('r', 0);
                leftBars.forEach(b => b.el.setAttribute('width', 0));
                rightBars.forEach(b => b.el.setAttribute('width', 0));
                cancelAnimationFrame(rippleRaf);
                ripple.setAttribute('r', 0);
            });
        }

        // --- Background Canvas ---
        function initBgCanvas(id, color) {
            const cv = document.getElementById(id);
            if (!cv) return;
            const card = cv.parentElement.parentElement;
            const W = card.offsetWidth || 320, H = card.offsetHeight || 260;
            cv.width = W; cv.height = H;
            const ctx = cv.getContext('2d');
            const pts = [];
            for (let i = 0; i < 12; i++) {
                pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 1.5 });
            }
            let active = false;
            card.addEventListener('mouseenter', () => active = true);
            card.addEventListener('mouseleave', () => active = false);

            function tick() {
                if (!active) { requestAnimationFrame(tick); return }
                ctx.clearRect(0, 0, W, H);
                pts.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > W) p.vx *= -1;
                    if (p.y < 0 || p.y > H) p.vy *= -1;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = color.replace(')', ',0.6)'); ctx.fill();
                });
                pts.forEach((p, i) => {
                    pts.forEach((q, j) => {
                        if (j <= i) return;
                        const d = Math.hypot(p.x - q.x, p.y - q.y);
                        if (d < 100) {
                            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                            ctx.strokeStyle = color.replace(')', ',' + (0.08 * (1 - d / 100)) + ')');
                            ctx.lineWidth = 0.5; ctx.stroke();
                        }
                    });
                });
                requestAnimationFrame(tick);
            }
            tick();
        }

        function entranceAnim() {
            if(!wrapRef.current) return;
            const cards = wrapRef.current.querySelectorAll('.pmc-card');
            cards.forEach((c, i) => {
                c.style.opacity = '0'; c.style.transform = 'translateY(28px) scale(0.97)';
                setTimeout(() => {
                    c.style.transition = 'opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)';
                    c.style.opacity = '1'; c.style.transform = 'translateY(0) scale(1)';
                    setTimeout(() => {
                        c.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), border-color 0.4s ease';
                    }, 620);
                }, i * 110 + 80);
            });
        }

        initCard1(); initCard2(); initCard3(); initCard4();
        initBgCanvas('pmc-cv1', 'rgba(56,139,229)');
        initBgCanvas('pmc-cv2', 'rgba(110,200,120)');
        initBgCanvas('pmc-cv3', 'rgba(160,130,230)');
        initBgCanvas('pmc-cv4', 'rgba(240,170,60)');
        entranceAnim();

    }, []);

    return (
        <div className="pmc-wrap" id="pmc-wrap" ref={wrapRef}>
            
            <div className="pmc-card pmc-c1" id="pmc-card1">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="pmc-cv1"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim"></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b1">Architecture</span><span className="pmc-num">01 / 04</span></div>
                <div className="pmc-viz-zone" id="pmc-vz1"></div>
                <div>
                    <div className="pmc-title">3-tier system</div>
                    <div className="pmc-desc">Fullstack architecture with presentation, business logic, and data layers each independently deployable.</div>
                    <div className="pmc-tags"><span className="pmc-tag">Frontend</span><span className="pmc-tag">Backend</span><span className="pmc-tag">Database</span><span className="pmc-tag">REST API</span></div>
                </div>
            </div>

            <div className="pmc-card pmc-c2" id="pmc-card2">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="pmc-cv2"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim" style={{ background: 'linear-gradient(90deg,transparent,rgba(110,200,120,0.8),transparent)' }}></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b2">ML / AI</span><span className="pmc-num">02 / 04</span></div>
                <div className="pmc-viz-zone" id="pmc-vz2"></div>
                <div>
                    <div className="pmc-title">Machine learning</div>
                    <div className="pmc-desc">KNN and CNN models trained on real-world samples for visual disease classification.</div>
                    <div className="pmc-tags"><span className="pmc-tag">KNN</span><span className="pmc-tag">CNN</span><span className="pmc-tag">Computer vision</span><span className="pmc-tag">Dataset</span></div>
                </div>
            </div>

            <div className="pmc-card pmc-c3" id="pmc-card3">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="pmc-cv3"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim" style={{ background: 'linear-gradient(90deg,transparent,rgba(160,130,230,0.8),transparent)' }}></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b3">NLP</span><span className="pmc-num">03 / 04</span></div>
                <div className="pmc-viz-zone" id="pmc-vz3"></div>
                <div>
                    <div className="pmc-title">NLP &amp; language modeling</div>
                    <div className="pmc-desc">Topic modeling across Tagalog, English, and Bisaya with multilingual token processing.</div>
                    <div className="pmc-tags"><span className="pmc-tag">Tagalog</span><span className="pmc-tag">English</span><span className="pmc-tag">Bisaya</span><span className="pmc-tag">Topic model</span></div>
                </div>
            </div>

            <div className="pmc-card pmc-c4" id="pmc-card4">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="pmc-cv4"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim" style={{ background: 'linear-gradient(90deg,transparent,rgba(240,170,60,0.8),transparent)' }}></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b4">Mobile</span><span className="pmc-num">04 / 04</span></div>
                <div className="pmc-viz-zone" id="pmc-vz4"></div>
                <div>
                    <div className="pmc-title">Mobile app</div>
                    <div className="pmc-desc">Native mobile experience with fluid navigation, gesture-driven UI, and responsive components.</div>
                    <div className="pmc-tags"><span className="pmc-tag">UI / UX</span><span className="pmc-tag">Native</span><span className="pmc-tag">Gestures</span><span className="pmc-tag">Responsive</span></div>
                </div>
            </div>

        </div>
    );
};

export default PremiumMotionCards;
