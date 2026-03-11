import React, { useEffect, useRef } from 'react';
import './AnimatedNavBarLogo.css';

const AnimatedNavBarLogo = ({ className = "w-8 h-auto" }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Intro drop-in
        const introSeq = [
            ['p20-nav', 0, -18], ['p19-nav', 80, -15], ['p18-nav', 180, -20], ['p17-nav', 260, -14],
            ['p0-nav', 360, -25], ['p1-nav', 430, -20], ['p2-nav', 500, -12], ['p3-nav', 560, -10],
            ['p4-nav', 620, -15], ['p5-nav', 700, -14], ['p6-nav', 760, -12], ['p7-nav', 820, -12],
            ['p8-nav', 900, -16], ['p9-nav', 970, -14], ['p10-nav', 1060, -18], ['p11-nav', 1130, -15],
            ['p12-nav', 1220, -18], ['p13-nav', 1290, -15], ['p21-nav', 1370, -22], ['p22-nav', 1460, -28],
            ['p23-nav', 1530, -22], ['p15-nav', 1640, -20], ['p14-nav', 1730, -18], ['p16-nav', 1870, -24],
        ];

        function introIn(id, dropY) {
            const el = svgRef.current?.querySelector(`#${id}`);
            if (!el) return;
            el.style.transition = 'none';
            el.style.opacity = '0';
            el.style.transform = `translateY(${dropY}px)`;
            el.getBoundingClientRect(); // force reflow
            el.style.transition = 'opacity 0.3s ease-out, transform 0.35s cubic-bezier(0.22,0.61,0.36,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0px)';
        }

        // Idle float config
        const pieces = [
            { id: 'p20-nav', fy: 1.2, fs: 0.55, dx: 0.6, ds: 0.42, ra: 0.25, rs: 0.38, ph: 0.00 },
            { id: 'p19-nav', fy: 1.4, fs: 0.48, dx: 0.8, ds: 0.37, ra: 0.20, rs: 0.31, ph: 0.72 },
            { id: 'p18-nav', fy: 2.0, fs: 0.62, dx: 1.0, ds: 0.50, ra: 0.35, rs: 0.44, ph: 1.40 },
            { id: 'p17-nav', fy: 1.6, fs: 0.57, dx: 0.9, ds: 0.45, ra: 0.28, rs: 0.40, ph: 2.10 },
            { id: 'p0-nav', fy: 1.8, fs: 0.44, dx: 0.5, ds: 0.33, ra: 0.18, rs: 0.28, ph: 0.35 },
            { id: 'p1-nav', fy: 1.5, fs: 0.51, dx: 0.7, ds: 0.40, ra: 0.22, rs: 0.35, ph: 1.05 },
            { id: 'p2-nav', fy: 1.0, fs: 0.47, dx: 0.4, ds: 0.36, ra: 0.15, rs: 0.30, ph: 1.80 },
            { id: 'p3-nav', fy: 1.2, fs: 0.53, dx: 0.5, ds: 0.41, ra: 0.20, rs: 0.33, ph: 2.60 },
            { id: 'p4-nav', fy: 1.6, fs: 0.60, dx: 0.8, ds: 0.48, ra: 0.30, rs: 0.42, ph: 3.30 },
            { id: 'p5-nav', fy: 1.3, fs: 0.67, dx: 0.6, ds: 0.52, ra: 0.22, rs: 0.45, ph: 0.55 },
            { id: 'p6-nav', fy: 1.5, fs: 0.58, dx: 0.7, ds: 0.44, ra: 0.25, rs: 0.38, ph: 1.30 },
            { id: 'p7-nav', fy: 1.4, fs: 0.63, dx: 0.6, ds: 0.49, ra: 0.20, rs: 0.41, ph: 2.05 },
            { id: 'p8-nav', fy: 2.2, fs: 0.42, dx: 1.1, ds: 0.32, ra: 0.30, rs: 0.27, ph: 0.90 },
            { id: 'p9-nav', fy: 2.0, fs: 0.46, dx: 1.0, ds: 0.35, ra: 0.28, rs: 0.30, ph: 1.65 },
            { id: 'p10-nav', fy: 2.5, fs: 0.39, dx: 1.2, ds: 0.29, ra: 0.35, rs: 0.25, ph: 2.40 },
            { id: 'p11-nav', fy: 2.2, fs: 0.43, dx: 1.0, ds: 0.33, ra: 0.30, rs: 0.28, ph: 3.20 },
            { id: 'p12-nav', fy: 2.8, fs: 0.36, dx: 1.4, ds: 0.27, ra: 0.40, rs: 0.23, ph: 0.20 },
            { id: 'p13-nav', fy: 2.5, fs: 0.40, dx: 1.2, ds: 0.30, ra: 0.35, rs: 0.26, ph: 1.10 },
            { id: 'p21-nav', fy: 3.0, fs: 0.55, dx: 1.5, ds: 0.42, ra: 0.50, rs: 0.37, ph: 0.65 },
            { id: 'p22-nav', fy: 3.5, fs: 0.62, dx: 1.8, ds: 0.48, ra: 0.60, rs: 0.44, ph: 1.50 },
            { id: 'p23-nav', fy: 3.2, fs: 0.58, dx: 1.6, ds: 0.45, ra: 0.55, rs: 0.40, ph: 2.35 },
            { id: 'p15-nav', fy: 2.8, fs: 0.38, dx: 1.3, ds: 0.28, ra: 0.38, rs: 0.24, ph: 1.85 },
            { id: 'p14-nav', fy: 3.0, fs: 0.41, dx: 1.5, ds: 0.31, ra: 0.42, rs: 0.27, ph: 2.70 },
            { id: 'p16-nav', fy: 3.5, fs: 0.35, dx: 1.7, ds: 0.26, ra: 0.48, rs: 0.22, ph: 3.50 },
        ];

        const pieceMap = {};
        pieces.forEach(p => pieceMap[p.id] = p);

        // Breakout config
        const breakoutDefs = [
            { id: 'p22-nav', dir: -55, dist: 160, breakDur: 520, returnDur: 700, minInt: 3200, maxInt: 5500 },
            { id: 'p23-nav', dir: -30, dist: 130, breakDur: 480, returnDur: 680, minInt: 4000, maxInt: 7000 },
            { id: 'p16-nav', dir: 40, dist: 170, breakDur: 560, returnDur: 750, minInt: 3800, maxInt: 6500 },
            { id: 'p14-nav', dir: 55, dist: 150, breakDur: 500, returnDur: 720, minInt: 5000, maxInt: 8500 },
            { id: 'p0-nav', dir: -140, dist: 120, breakDur: 460, returnDur: 660, minInt: 4500, maxInt: 7500 },
            { id: 'p1-nav', dir: -110, dist: 110, breakDur: 440, returnDur: 640, minInt: 5500, maxInt: 9000 },
            { id: 'p12-nav', dir: 150, dist: 140, breakDur: 490, returnDur: 700, minInt: 4200, maxInt: 7200 },
            { id: 'p10-nav', dir: 170, dist: 130, breakDur: 470, returnDur: 680, minInt: 6000, maxInt: 9500 },
            { id: 'p21-nav', dir: -20, dist: 145, breakDur: 510, returnDur: 730, minInt: 3500, maxInt: 6000 },
            { id: 'p18-nav', dir: -80, dist: 120, breakDur: 450, returnDur: 650, minInt: 5000, maxInt: 8000 },
        ];

        let breakoutState = {};
        breakoutDefs.forEach(b => { breakoutState[b.id] = { active: false, bx: 0, by: 0 }; });

        function rand(min, max) { return min + Math.random() * (max - min); }

        let schedules = [];
        function scheduleBreakout(def) {
            const delay = rand(def.minInt, def.maxInt);
            const timer = setTimeout(() => triggerBreakout(def), delay);
            schedules.push(timer);
        }

        let idleStart = null;
        function triggerBreakout(def) {
            const el = svgRef.current?.querySelector(`#${def.id}`);
            if (!el) return;

            const state = breakoutState[def.id];
            if (state.active) {
                scheduleBreakout(def);
                return;
            }

            const angle = (def.dir + rand(-15, 15)) * Math.PI / 180;
            const dist = def.dist * rand(0.85, 1.15);
            const bx = Math.cos(angle) * dist;
            const by = Math.sin(angle) * dist;
            const rot = rand(-25, 25);

            state.active = true;
            state.bx = bx;
            state.by = by;

            el.dataset.breaking = '1';

            const p = pieceMap[def.id];
            const t = (performance.now() - (idleStart || 0)) / 1000;
            const { tx: itx, ty: ity } = idleTransform(p, t);

            el.style.transition = `transform ${def.breakDur}ms cubic-bezier(0.25,0.46,0.45,0.94), filter ${def.breakDur}ms ease`;
            el.style.transform = `translate(${(itx + bx).toFixed(1)}px, ${(ity + by).toFixed(1)}px) rotate(${rot}deg)`;
            el.style.filter = 'brightness(1.8) drop-shadow(0 0 18px rgba(180,220,255,0.7))';

            const timer = setTimeout(() => {
                if (!svgRef.current) return;
                el.style.transition = `transform ${def.returnDur}ms cubic-bezier(0.34,1.3,0.64,1), filter ${def.returnDur}ms ease`;
                el.style.filter = '';

                const t2 = (performance.now() - (idleStart || 0)) / 1000;
                const { tx: itx2, ty: ity2 } = idleTransform(p, t2);
                el.style.transform = `translate(${itx2.toFixed(1)}px, ${ity2.toFixed(1)}px) rotate(0deg)`;

                const timer2 = setTimeout(() => {
                    el.style.transition = '';
                    el.dataset.breaking = '0';
                    state.active = false;
                    state.bx = 0;
                    state.by = 0;

                    if (idleRunning) scheduleBreakout(def);
                }, def.returnDur + 80);
                schedules.push(timer2);

            }, def.breakDur + rand(120, 280));
            schedules.push(timer);
        }

        function idleTransform(p, t) {
            const ph = p.ph;
            const ty = p.fy * (Math.sin(p.fs * t + ph) * 0.65 + Math.sin(p.fs * 1.618 * t + ph + 1.1) * 0.35);
            const tx = p.dx * (Math.cos(p.ds * t + ph + 0.8) * 0.6 + Math.cos(p.ds * 2.414 * t + ph + 2.3) * 0.4);
            const rot = p.ra * Math.sin(p.rs * t + ph + 0.4);
            return { tx, ty, rot };
        }

        let idleRunning = false;
        let rAF;

        function idleLoop(ts) {
            if (!idleRunning) return;
            if (!idleStart) idleStart = ts;
            const t = (ts - idleStart) / 1000;

            pieces.forEach(p => {
                const el = svgRef.current?.querySelector(`#${p.id}`);
                if (!el) return;
                if (el.dataset.breaking === '1') return;

                const { tx, ty, rot } = idleTransform(p, t);
                const state = breakoutState[p.id];
                if (state && state.active) return;

                el.style.transform = `translate(${tx.toFixed(3)}px, ${ty.toFixed(3)}px) rotate(${rot.toFixed(3)}deg)`;
            });

            rAF = requestAnimationFrame(idleLoop);
        }

        function startIdle() {
            idleRunning = true;
            idleStart = null;
            rAF = requestAnimationFrame(idleLoop);

            breakoutDefs.forEach((def, i) => {
                const timer = setTimeout(() => scheduleBreakout(def), i * 420 + rand(600, 1800));
                schedules.push(timer);
            });
        }

        // Boot
        introSeq.forEach(([id]) => {
            const el = svgRef.current?.querySelector(`#${id}`);
            if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(0px)'; el.dataset.breaking = '0'; }
        });

        let bootTimers = [];
        const timer1 = setTimeout(() => {
            introSeq.forEach(([id, delay, dropY]) => {
                bootTimers.push(setTimeout(() => introIn(id, dropY), delay));
            });

            const lastDelay = introSeq[introSeq.length - 1][1] + 700;
            bootTimers.push(setTimeout(() => {
                introSeq.forEach(([id]) => {
                    const el = svgRef.current?.querySelector(`#${id}`);
                    if (el) el.style.transition = '';
                });
                bootTimers.push(setTimeout(startIdle, 50));
            }, lastDelay));
        }, 300);
        bootTimers.push(timer1);

        return () => {
            idleRunning = false;
            cancelAnimationFrame(rAF);
            bootTimers.forEach(clearTimeout);
            schedules.forEach(clearTimeout);
        };
    }, []);

    return (
        <div className={`animated-nav-logo-wrap ${className}`}>
            <div className="animated-nav-logo-glow-bg"></div>
            <svg id="logo-nav" ref={svgRef} width="100%" height="100%" viewBox="0 0 253 283" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                {/* Suffixed IDs to isolate them from global hero logo animations */}
                <path id="p0-nav" d="M0 0L8.09639 104H42L0 0Z" fill="url(#g4-nav)" />
                <path id="p1-nav" d="M77.75 90.5L40.75 104L0.25 0.5L77.75 90.5Z" fill="url(#g5-nav)" />
                <path id="p2-nav" d="M42.25 104H8.25L42.25 144V104Z" fill="url(#g6-nav)" />
                <path id="p3-nav" d="M63.25 147.5L42.25 104.5V144.5L57.75 155.5L63.25 147.5Z" fill="url(#g7-nav)" />
                <path id="p4-nav" d="M77.25 90L41.25 103.5L63.25 148L82.25 122.625L77.25 90Z" fill="url(#g8-nav)" />
                <path id="p5-nav" d="M10.25 200V130L29.25 163.19L10.25 200Z" fill="url(#g9-nav)" />
                <path id="p6-nav" d="M29.45 163L10.25 130L46.25 163H29.45Z" fill="url(#g10-nav)" />
                <path id="p7-nav" d="M10.25 200L29.45 163H46.25L10.25 200Z" fill="url(#g11-nav)" />
                <path id="p8-nav" d="M83.75 138.5L43.25 215L37.25 182.5L83.75 138.5Z" fill="url(#g14-nav)" />
                <path id="p9-nav" d="M84.25 210.5V137.5L42.75 216L84.25 210.5Z" fill="url(#g15-nav)" />
                <path id="p10-nav" d="M11.25 209.5L37.25 183L43.25 214.5L14.25 282.5L11.25 209.5Z" fill="url(#g12-nav)" />
                <path id="p11-nav" d="M42.75 215.5L14.25 282L84.25 210.5L42.75 215.5Z" fill="url(#g13-nav)" />
                <path id="p12-nav" d="M28.25 282L95.7206 249L102.25 282H28.25Z" fill="url(#g0-nav)" />
                <path id="p13-nav" d="M29.25 283L96.25 249L93.5264 215L29.25 283Z" fill="url(#g1-nav)" />
                <path id="p14-nav" d="M101.396 280.173L95.3963 248.746C95.3103 248.296 95.5236 247.853 95.9393 247.659C100.805 245.389 130.062 231.661 139.63 225.3C150.079 218.354 156.112 214.595 165.608 206.4C175.105 198.205 180.4 191.961 188.34 183.18C196.279 174.399 201.149 169.733 207.823 159.96C214.294 150.486 226.53 121.827 227.272 120.083C227.296 120.027 227.314 119.97 227.327 119.91L232.688 95.5976C232.887 94.696 234.08 94.5247 234.507 95.3434C236.558 99.2793 240.603 107.388 242.461 113.52C244.776 121.156 246.012 137.656 246.219 140.604C246.239 140.896 246.13 141.177 245.921 141.381L103.076 280.701C102.506 281.258 101.545 280.956 101.396 280.173Z" fill="url(#g2-nav)" />
                <path id="p15-nav" d="M95.8268 247.487L93.3452 216.2C93.2957 215.576 93.8052 215.055 94.4287 215.108C101.085 215.665 134.245 217.757 150.423 205.825C166.011 194.329 174.802 163.498 175.698 160.233C175.751 160.038 175.856 159.882 176.009 159.75L226.82 115.956C227.632 115.257 228.881 116.172 228.476 117.163C227.721 119.009 226.813 121.322 225.935 123.794C221.951 135.006 217.607 144.961 211.372 155.095C205.801 164.15 198.427 172.905 198.427 172.905C198.427 172.905 185.372 187.619 178.47 194.492C171.243 201.691 166.236 206.463 159.053 212.302C151.108 218.76 136.939 227.413 136.939 227.413L97.2897 248.293C96.6542 248.628 95.8836 248.203 95.8268 247.487Z" fill="url(#g3-nav)" />
                <path id="p16-nav" fillRule="evenodd" clipRule="evenodd" d="M249.35 156.462C250.27 155.561 251.875 156.032 251.989 157.402C252.827 167.458 253.995 211.694 214.529 245.885C175.695 279.527 136.442 280.327 126.717 279.948C125.29 279.892 124.786 278.225 125.736 277.296L249.35 156.462ZM234.017 189.362C233.465 189.035 232.714 189.063 232.145 189.593L156.974 259.66C156.395 260.201 156.327 260.96 156.632 261.532C156.94 262.108 157.615 262.469 158.389 262.262C166.891 259.99 188.445 253.091 205.936 237.838C223.756 222.3 232.044 199.649 234.669 191.124C234.901 190.369 234.573 189.691 234.017 189.362Z" fill="url(#g16-nav)" />
                <path id="p17-nav" d="M79.9697 36.8798L84.1056 72.2652C84.1677 72.7968 84.6363 73.1864 85.1706 73.1541C91.1872 72.7908 124.098 71.1902 138.803 78.5899C149.486 83.9653 159.738 99.3549 165.492 109.236C166.1 110.279 167.16 109.814 166.645 108.723C161.96 98.7775 151.937 82.5171 132.277 68.4389C106.428 49.9287 87.022 38.963 81.4071 35.8928C80.7022 35.5073 79.8764 36.0817 79.9697 36.8798Z" fill="url(#g17-nav)" />
                <path id="p18-nav" d="M132.713 54.2611C175.895 98.3695 167.614 124 167.614 124C167.614 124 167.614 94.7931 138.037 75.1231C108.46 55.4532 81.25 36.9754 81.25 36.9754V3C81.25 3 89.5314 10.1527 132.713 54.2611Z" fill="url(#g18-nav)" />
                <path id="p19-nav" d="M84.25 74L80.6907 35.2185L14.25 3L84.25 74Z" fill="url(#g19-nav)" />
                <path id="p20-nav" d="M82.25 36L14.25 3H82.25V36Z" fill="url(#g20-nav)" />
                <path id="p21-nav" d="M180.808 97.6601C180.808 120.382 169.364 147 169.364 147C169.364 147 184.311 97.6601 153.941 65.05C123.57 32.4398 92.25 1.99997 92.25 1.99997C92.25 1.99997 110.189 -0.021071 121.25 1.00005C132.311 2.02117 156.891 6.77096 156.891 6.77096C156.891 6.77096 173.816 14.0652 184.04 20.4035C194.264 26.7418 209.25 39.2314 209.25 39.2314L197.615 45.0743C197.615 45.0743 178.5 30.4602 164.001 24.2996C149.503 18.139 125.217 13.263 125.217 13.263C125.217 13.263 143.316 32.7393 156.891 48.3203C170.465 63.9013 180.808 74.9379 180.808 97.6601Z" fill="url(#g16-nav)" opacity="0.6" />
                <path id="p22-nav" d="M179.25 48L188.25 79.5L177.75 121.5L172.25 140.5L237.75 21L197.75 61.5L179.25 48Z" fill="url(#g22-nav)" />
                <path id="p23-nav" d="M237.25 22L172.25 140.5L222.25 89L237.25 22Z" fill="url(#g23-nav)" />
                <defs>
                    <linearGradient id="g0-nav" x1="82.6929" y1="245.769" x2="82.7936" y2="278.309" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g1-nav" x1="78.5429" y1="208.343" x2="79.0154" y2="275.392" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g2-nav" x1="237.049" y1="123.78" x2="107.4" y2="275.649" gradientUnits="userSpaceOnUse"><stop stopColor="#CEE2F0" /><stop offset="0.504248" stopColor="#A4BACD" /><stop offset="1" stopColor="#BAC9DA" /></linearGradient>
                    <linearGradient id="g3-nav" x1="250.746" y1="103.825" x2="96.9365" y2="240.265" gradientUnits="userSpaceOnUse"><stop stopColor="#D4E3EE" /><stop offset="0.695116" stopColor="#7D9DBA" /><stop offset="1" stopColor="#AABACC" /></linearGradient>
                    <linearGradient id="g4-nav" x1="1.38689e-06" y1="-44.932" x2="20.9049" y2="104.013" gradientUnits="userSpaceOnUse"><stop stopColor="#18366D" /><stop offset="1" stopColor="#9ABFD8" /></linearGradient>
                    <linearGradient id="g5-nav" x1="3.75" y1="-8.5" x2="38" y2="104" gradientUnits="userSpaceOnUse"><stop stopColor="#3477A4" /><stop offset="1" stopColor="#9ABFD8" /></linearGradient>
                    <linearGradient id="g6-nav" x1="42.25" y1="98" x2="31.202" y2="130.484" gradientUnits="userSpaceOnUse"><stop stopColor="#9DADC4" /><stop offset="1" stopColor="#7F9BC3" /></linearGradient>
                    <linearGradient id="g7-nav" x1="52.75" y1="104.5" x2="52.75" y2="155.5" gradientUnits="userSpaceOnUse"><stop stopColor="#A5BBD9" /><stop offset="1" stopColor="#6E8B9F" /></linearGradient>
                    <linearGradient id="g8-nav" x1="61.75" y1="90" x2="65.25" y2="171.5" gradientUnits="userSpaceOnUse"><stop stopColor="#A6C8DF" /><stop offset="1" stopColor="#728FA4" /></linearGradient>
                    <linearGradient id="g9-nav" x1="15.5938" y1="165" x2="0.75" y2="165" gradientUnits="userSpaceOnUse"><stop stopColor="#A0AEC0" /><stop offset="1" stopColor="#737373" /></linearGradient>
                    <linearGradient id="g10-nav" x1="19.85" y1="134.8" x2="34.85" y2="163.6" gradientUnits="userSpaceOnUse"><stop stopColor="#7A9EBE" /><stop offset="1" stopColor="#C5CFD5" /></linearGradient>
                    <linearGradient id="g11-nav" x1="39.65" y1="155.721" x2="21.3349" y2="191.955" gradientUnits="userSpaceOnUse"><stop stopColor="#D9D9D9" /><stop offset="1" stopColor="#8DABC4" /></linearGradient>
                    <linearGradient id="g12-nav" x1="27.25" y1="183" x2="27.25" y2="282.5" gradientUnits="userSpaceOnUse"><stop stopColor="#89A2C4" /><stop offset="1" stopColor="#6486AC" /></linearGradient>
                    <linearGradient id="g13-nav" x1="65.75" y1="203.5" x2="66.25" y2="274" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g14-nav" x1="71.4607" y1="131.01" x2="72.3223" y2="206.435" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g15-nav" x1="73.2821" y1="129.815" x2="72.0519" y2="216.011" gradientUnits="userSpaceOnUse"><stop stopColor="#C9E9FF" /><stop offset="1" stopColor="#91A9C5" /></linearGradient>
                    <linearGradient id="g16-nav" x1="252.25" y1="147.5" x2="136.665" y2="279.926" gradientUnits="userSpaceOnUse"><stop stopColor="#D1DBE2" /><stop offset="0.5" stopColor="#B4BBC2" /><stop offset="1" stopColor="#9FBCDD" /></linearGradient>
                    <linearGradient id="g17-nav" x1="123.97" y1="15.8921" x2="137.034" y2="123.373" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g18-nav" x1="92.4891" y1="12.5369" x2="189.201" y2="138.965" gradientUnits="userSpaceOnUse"><stop stopColor="#B0D8F3" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g19-nav" x1="103.826" y1="27.4622" x2="27.2871" y2="18.0278" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g20-nav" x1="89.4712" y1="14.1964" x2="32.303" y2="30.6962" gradientUnits="userSpaceOnUse"><stop stopColor="#9FC1D9" /><stop offset="1" stopColor="#6C8CB1" /></linearGradient>
                    <linearGradient id="g22-nav" x1="237.25" y1="11" x2="181.172" y2="116.988" gradientUnits="userSpaceOnUse"><stop stopColor="#D4EEFF" /><stop offset="1" stopColor="#A9B8C9" /></linearGradient>
                    <linearGradient id="g23-nav" x1="238.75" y1="23.5" x2="179.699" y2="132.016" gradientUnits="userSpaceOnUse"><stop stopColor="#C6D2DA" /><stop offset="1" stopColor="#9DB7D5" /></linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default AnimatedNavBarLogo;
