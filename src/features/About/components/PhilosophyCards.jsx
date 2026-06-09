import React, { useEffect, useRef } from 'react';
import './PremiumMotionCards.css';

const PhilosophyCards = () => {
    const initialized = useRef(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const lerp = (a, b, t) => a + (b - a) * t;

        // Card 1: How I Build (Data flow)
        function initCard1() {
            const zone = document.getElementById('phil-vz1');
            const card = document.getElementById('phil-card1');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%'); svg.setAttribute('height', '90'); svg.setAttribute('viewBox', '0 0 280 90');
            svg.style.overflow = 'visible';
            zone.appendChild(svg);

            // Flow nodes
            const nodes = [
                { x: 30, y: 45, color: 'rgba(56,139,229,0.9)', label: 'API' },
                { x: 140, y: 45, color: 'rgba(56,139,229,0.7)', label: 'Data Flow' },
                { x: 250, y: 45, color: 'rgba(56,139,229,0.5)', label: 'UI' }
            ];

            const els = [];
            nodes.forEach((n, i) => {
                if (i < 2) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', n.x + 25); line.setAttribute('y1', n.y); 
                    line.setAttribute('x2', nodes[i+1].x - 25); line.setAttribute('y2', nodes[i+1].y);
                    line.setAttribute('stroke', 'rgba(56,139,229,0.3)'); line.setAttribute('stroke-width', '1');
                    line.setAttribute('stroke-dasharray', '4 4');
                    svg.appendChild(line);

                    const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    packet.setAttribute('cx', n.x + 25); packet.setAttribute('cy', n.y); packet.setAttribute('r', '3');
                    packet.setAttribute('fill', 'rgba(56,139,229,0.8)');
                    packet.style.opacity = '0';
                    svg.appendChild(packet);
                    els.push({ packet, x1: n.x + 25, x2: nodes[i+1].x - 25, delay: i * 400 });
                }

                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', n.x - 25); r.setAttribute('y', n.y - 12); r.setAttribute('width', '50'); r.setAttribute('height', '24');
                r.setAttribute('rx', '4'); r.setAttribute('fill', n.color.replace('0.9', '0.1').replace('0.7', '0.1').replace('0.5', '0.1')); 
                r.setAttribute('stroke', n.color); r.setAttribute('stroke-width', '1');
                
                const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                tx.setAttribute('x', n.x); tx.setAttribute('y', n.y + 4);
                tx.setAttribute('text-anchor', 'middle');
                tx.setAttribute('fill', n.color); tx.setAttribute('font-size', '9'); tx.setAttribute('font-weight', '600'); tx.setAttribute('font-family', 'Inter,sans-serif');
                tx.textContent = n.label;
                
                g.appendChild(r); g.appendChild(tx); svg.appendChild(g);
            });

            let raf = null, active = false, start = null;
            function anim(ts) {
                if (!start) start = ts;
                const t = (ts - start) % 1500;
                
                els.forEach(el => {
                    let pt = (t - el.delay) / 800;
                    if (pt < 0) pt = 0; if (pt > 1) pt = 1;
                    if (pt > 0 && pt < 1) {
                        el.packet.style.opacity = '1';
                        el.packet.setAttribute('cx', lerp(el.x1, el.x2, easeInOut(pt)));
                    } else {
                        el.packet.style.opacity = '0';
                    }
                });
                if (active) raf = requestAnimationFrame(anim);
            }

            card.addEventListener('mouseenter', () => { active = true; start = null; raf = requestAnimationFrame(anim); });
            card.addEventListener('mouseleave', () => { active = false; cancelAnimationFrame(raf); els.forEach(el => el.packet.style.opacity='0'); });
        }

        // Card 2: Creative Philosophy (Motion)
        function initCard2() {
            const zone = document.getElementById('phil-vz2');
            const card = document.getElementById('phil-card2');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%'); svg.setAttribute('height', '90'); svg.setAttribute('viewBox', '0 0 280 90');
            zone.appendChild(svg);

            const boxes = [];
            for (let i = 0; i < 3; i++) {
                const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r.setAttribute('x', 70 + i * 50); r.setAttribute('y', 35); r.setAttribute('width', '40'); r.setAttribute('height', '20');
                r.setAttribute('rx', '4'); r.setAttribute('fill', 'rgba(110,200,120,0.15)');
                r.setAttribute('stroke', 'rgba(110,200,120,0.4)'); r.setAttribute('stroke-width', '1');
                r.style.transformOrigin = `${90 + i * 50}px 45px`;
                r.style.transition = `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms, fill 0.3s`;
                svg.appendChild(r);
                boxes.push(r);
            }

            card.addEventListener('mouseenter', () => {
                boxes.forEach((b, i) => {
                    b.style.transform = `translateY(-10px) scale(1.1)`;
                    b.setAttribute('fill', 'rgba(110,200,120,0.3)');
                });
            });
            card.addEventListener('mouseleave', () => {
                boxes.forEach((b, i) => {
                    b.style.transform = `translateY(0) scale(1)`;
                    b.setAttribute('fill', 'rgba(110,200,120,0.15)');
                });
            });
        }

        // Card 3: Always Learning (ML Loop)
        function initCard3() {
            const zone = document.getElementById('phil-vz3');
            const card = document.getElementById('phil-card3');
            if (!zone || !card) return;
            zone.innerHTML = '';
            
            const canvas = document.createElement('canvas');
            canvas.width = 300; canvas.height = 90; canvas.style.cssText = 'width:100%;height:90px;display:block';
            zone.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            let active = false, prog = 0;
            
            function draw() {
                ctx.clearRect(0, 0, 300, 90);
                
                // Draw neural net nodes
                const layers = [3, 4, 3];
                const startX = 60;
                const gapX = 90;
                
                for (let l = 0; l < layers.length; l++) {
                    const nodes = layers[l];
                    for (let n = 0; n < nodes; n++) {
                        const x = startX + l * gapX;
                        const y = 45 + (n - (nodes-1)/2) * 20;
                        
                        if (l < layers.length - 1) {
                            const nextNodes = layers[l+1];
                            for (let nn = 0; nn < nextNodes; nn++) {
                                const nx = startX + (l+1) * gapX;
                                const ny = 45 + (nn - (nextNodes-1)/2) * 20;
                                ctx.beginPath();
                                ctx.moveTo(x, y); ctx.lineTo(nx, ny);
                                ctx.strokeStyle = `rgba(160,130,230,${0.1 + prog * 0.3})`;
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        }
                        
                        ctx.beginPath();
                        ctx.arc(x, y, 3 + prog * 1.5, 0, Math.PI*2);
                        ctx.fillStyle = `rgba(160,130,230,${0.5 + prog * 0.5})`;
                        ctx.fill();
                    }
                }
            }

            function animate() {
                if (active && prog < 1) prog = Math.min(1, prog + 0.05);
                if (!active && prog > 0) prog = Math.max(0, prog - 0.04);
                draw();
                if (prog > 0 || active) requestAnimationFrame(animate);
            }
            
            draw();

            card.addEventListener('mouseenter', () => { active = true; animate(); });
            card.addEventListener('mouseleave', () => { active = false; animate(); });
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

        initCard1(); initCard2(); initCard3();
        initBgCanvas('phil-cv1', 'rgba(56,139,229)');
        initBgCanvas('phil-cv2', 'rgba(110,200,120)');
        initBgCanvas('phil-cv3', 'rgba(160,130,230)');
        entranceAnim();

    }, []);

    return (
        <div className="pmc-wrap ns-reveal" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: '2rem' }} ref={wrapRef}>
            
            <div className="pmc-card pmc-c1" id="phil-card1">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="phil-cv1"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim"></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b1">Methodology</span></div>
                <div className="pmc-viz-zone" id="phil-vz1"></div>
                <div>
                    <div className="pmc-title">How I Build</div>
                    <div className="pmc-desc">I design the data flow first, then build the interface around real user workflows with clear APIs and role-based structures.</div>
                </div>
            </div>

            <div className="pmc-card pmc-c2" id="phil-card2">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="phil-cv2"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim" style={{ background: 'linear-gradient(90deg,transparent,rgba(110,200,120,0.8),transparent)' }}></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b2">Design</span></div>
                <div className="pmc-viz-zone" id="phil-vz2"></div>
                <div>
                    <div className="pmc-title">Creative Philosophy</div>
                    <div className="pmc-desc">I treat motion as product feedback rather than decoration. My goal is a fast, readable UI that uses animation to guide attention.</div>
                </div>
            </div>

            <div className="pmc-card pmc-c3" id="phil-card3">
                <div className="pmc-bg-canvas"><canvas className="pmc-bg" id="phil-cv3"></canvas><div className="pmc-noise"></div><div className="pmc-line-anim" style={{ background: 'linear-gradient(90deg,transparent,rgba(160,130,230,0.8),transparent)' }}></div></div>
                <div className="pmc-top-row"><span className="pmc-badge pmc-b3">Engineering</span></div>
                <div className="pmc-viz-zone" id="phil-vz3"></div>
                <div>
                    <div className="pmc-title">Always Learning</div>
                    <div className="pmc-desc">My ML work is practical. I document model choices, feedback loops, and limits so reviewers see the actual engineering decisions.</div>
                </div>
            </div>

        </div>
    );
};

export default PhilosophyCards;
