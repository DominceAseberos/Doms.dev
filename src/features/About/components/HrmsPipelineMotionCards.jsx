import React, { useEffect, useRef } from 'react';

const HrmsPipelineMotionCards = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let isUnmounted = false;
        
        const wrapEl = (id) => {
            const el = document.getElementById(id);
            if (!el) {
                return { 
                    classList: { add: ()=>{}, remove: ()=>{} }, 
                    style: {}, 
                    textContent: '' 
                };
            }
            return el;
        };

        // We replace document.getElementById with wrapEl to avoid null reference errors
        // during fast reloads or unmounts

const phaseColors = ['#7C3AED','#3B82F6','#06B6D4','#F59E0B','#8B5CF6'];
const phaseTriggers = [0, 20, 40, 60, 80]; // % of line where each phase triggers

let progress = 0;
let currentPhase = -1;
let animInterval = null;
let phaseTimeouts = [];

function clearAllTimeouts() {
  phaseTimeouts.forEach(t => clearTimeout(t));
  phaseTimeouts = [];
}

function delay(ms) {
  return new Promise(r => {
    const t = setTimeout(r, ms);
    phaseTimeouts.push(t);
  });
}

function setProgress(pct) {
  wrapEl('flow-fill').style.width = pct + '%';
  wrapEl('flow-dot').style.left = pct + '%';
  // Color of dot blends through gradient
  const idx = Math.min(4, Math.floor(pct / 20));
  wrapEl('flow-dot').style.color = phaseColors[Math.min(idx, 4)];
  wrapEl('flow-dot').style.background = phaseColors[Math.min(idx, 4)];
}

function activatePhase(n) {
  const col = wrapEl('phase-' + n);
  const dot = wrapEl('dot' + n);
  col.classList.add('active');
  dot.classList.add('lit');
}

function resetAll() {
  for (let i = 1; i <= 5; i++) {
    const col = wrapEl('phase-' + i);
    col.classList.remove('active', 'done');
    wrapEl('dot' + i).classList.remove('lit');
  }
  // Reset phase 1
  ['sn1','sn2','sn3','sn4'].forEach(id => wrapEl(id).classList.remove('show'));
  // Reset phase 2
  ['er-user','er-role','er-dept','er-request','er-line1','er-line2','er-line3'].forEach(id => wrapEl(id).classList.remove('show'));
  // Reset phase 3
  ['api-admin','api-emp'].forEach(id => wrapEl(id).classList.remove('show'));
  ['a1','a2','a3','a4','b1','b2','b3'].forEach(id => wrapEl(id).classList.remove('show'));
  // Reset phase 4
  ['fne1','fne2','fne3','fae1','fae2','fna1','fna2','fna3','fna4','faa1','faa2','faa3'].forEach(id => wrapEl(id).classList.remove('show'));
  wrapEl('flow-emp-label').style.opacity = '0';
  wrapEl('flow-adm-label').style.opacity = '0';
  // Reset phase 5
  wrapEl('dash-main').classList.remove('show');
  ['tr1','tr2','tr3','tr4'].forEach(id => wrapEl(id).classList.remove('show'));
  wrapEl('stat-total').textContent = '0';
  wrapEl('stat-pending').textContent = '0';
  wrapEl('stat-approved').textContent = '0';
  setProgress(0);
}

async function animatePhase1() {
  activatePhase(1);
  await delay(100);
  wrapEl('sn1').classList.add('show');
  await delay(200);
  wrapEl('sn2').classList.add('show');
  await delay(200);
  wrapEl('sn3').classList.add('show');
  await delay(200);
  wrapEl('sn4').classList.add('show');
}

async function animatePhase2() {
  activatePhase(2);
  await delay(100);
  wrapEl('er-user').classList.add('show');
  await delay(150);
  wrapEl('er-line1').classList.add('show');
  await delay(150);
  wrapEl('er-role').classList.add('show');
  await delay(150);
  wrapEl('er-line2').classList.add('show');
  await delay(150);
  wrapEl('er-dept').classList.add('show');
  await delay(150);
  wrapEl('er-line3').classList.add('show');
  await delay(150);
  wrapEl('er-request').classList.add('show');
}

async function animatePhase3() {
  activatePhase(3);
  await delay(100);
  wrapEl('api-emp').classList.add('show');
  const empRows = ['b1','b2','b3'];
  for (let id of empRows) {
    await delay(120);
    wrapEl(id).classList.add('show');
  }
  await delay(200);
  wrapEl('api-admin').classList.add('show');
  const admRows = ['a1','a2','a3','a4'];
  for (let id of admRows) {
    await delay(120);
    wrapEl(id).classList.add('show');
  }
}

async function animatePhase4() {
  activatePhase(4);
  await delay(100);
  
  // EMP Flow
  wrapEl('flow-emp-label').style.opacity = '1';
  await delay(150);
  wrapEl('fne1').classList.add('show');
  await delay(150);
  wrapEl('fae1').classList.add('show');
  await delay(80);
  wrapEl('fne2').classList.add('show');
  await delay(150);
  wrapEl('fae2').classList.add('show');
  await delay(80);
  wrapEl('fne3').classList.add('show');

  await delay(300);

  // ADM Flow
  wrapEl('flow-adm-label').style.opacity = '1';
  await delay(150);
  wrapEl('fna1').classList.add('show');
  await delay(150);
  wrapEl('faa1').classList.add('show');
  await delay(80);
  wrapEl('fna2').classList.add('show');
  await delay(150);
  wrapEl('faa2').classList.add('show');
  await delay(80);
  wrapEl('fna3').classList.add('show');
  await delay(150);
  wrapEl('faa3').classList.add('show');
  await delay(80);
  wrapEl('fna4').classList.add('show');
}

function countUp(el, target, duration) {
  let start = 0;
  const step = Math.ceil(target / (duration / 50));
  const iv = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(iv);
  }, 50);
}

async function animatePhase5() {
  activatePhase(5);
  await delay(100);
  wrapEl('dash-main').classList.add('show');
  await delay(300);
  countUp(wrapEl('stat-total'), 128, 800);
  await delay(150);
  countUp(wrapEl('stat-pending'), 32, 600);
  await delay(150);
  countUp(wrapEl('stat-approved'), 96, 700);
  await delay(400);
  for (let id of ['tr1','tr2','tr3','tr4']) {
    await delay(120);
    wrapEl(id).classList.add('show');
  }
}

const phaseAnimators = [animatePhase1, animatePhase2, animatePhase3, animatePhase4, animatePhase5];

async function runLoop() {
  if (isUnmounted) return;
  resetAll();

  // Slight pause before starting
  await delay(300);

  if (isUnmounted) return;
  await animatePhase1();

  await delay(150); // Quick gap between cards
  if (isUnmounted) return;
  await animatePhase2();

  await delay(150);
  if (isUnmounted) return;
  await animatePhase3();

  await delay(150);
  if (isUnmounted) return;
  await animatePhase4();

  await delay(150);
  if (isUnmounted) return;
  await animatePhase5();
}

// Start

        let hasRun = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasRun) {
                hasRun = true;
                if (!isUnmounted) runLoop();
            }
        }, { threshold: 0.3 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        // --- PHASE 5 INTERACTIONS ---
        const initPhase5Interactions = () => {
            if (isUnmounted) return;
            const dashWrap = document.querySelector('.dash-wrap');
            if (!dashWrap) return;

            // 1. Tabs
            const tabs = document.querySelectorAll('.dash-item');
            const dashMain = document.querySelector('.dash-main');
            const tabContents = [
                `
                <div style="font-size:12.8px; color:#9aa0cc; font-weight:600; margin-bottom:8px;">Dashboard</div>
                <div class="stat-grid">
                  <div class="stat-card"><div class="stat-label">Total</div><div class="stat-val" style="color:#8B5CF6;">128</div></div>
                  <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-val" style="color:#F59E0B;">32</div></div>
                  <div class="stat-card"><div class="stat-label">Approved</div><div class="stat-val" style="color:#85e09a;">96</div></div>
                </div>
                <div style="font-size:11.2px; color:#4a5080; margin-bottom:4.8px; font-weight:600;">RECENT REQUESTS</div>
                <div style="overflow:hidden;">
                  <div class="table-row show" style="color:#4a5080;"><span class="col-id">ID</span><span class="col-type">Type</span><span class="col-emp">Employee</span><span class="col-status">Status</span></div>
                  <div class="table-row show action-row" style="cursor:pointer;"><span class="col-id">#1024</span><span class="col-type">Leave</span><span class="col-emp">John D.</span><span class="col-status status-pending">Pending</span></div>
                  <div class="table-row show action-row" style="cursor:pointer;"><span class="col-id">#1023</span><span class="col-type">Expense</span><span class="col-emp">Jane S.</span><span class="col-status status-approved">Approved</span></div>
                  <div class="table-row show action-row" style="cursor:pointer;"><span class="col-id">#1022</span><span class="col-type">Leave</span><span class="col-emp">R. Brown</span><span class="col-status status-pending">Pending</span></div>
                  <div class="table-row show action-row" style="cursor:pointer;"><span class="col-id">#1021</span><span class="col-type">Expense</span><span class="col-emp">E. Davis</span><span class="col-status status-approved">Approved</span></div>
                  <div class="table-row show action-row" style="cursor:pointer;"><span class="col-id">#1020</span><span class="col-type">Leave</span><span class="col-emp">M. Smith</span><span class="col-status status-pending">Pending</span></div>
                  <div class="table-row show action-row" style="cursor:pointer;"><span class="col-id">#1019</span><span class="col-type">Expense</span><span class="col-emp">L. Chen</span><span class="col-status status-approved">Approved</span></div>
                </div>
                `,
                `
                <div style="font-size:12.8px; color:#9aa0cc; font-weight:600; margin-bottom:8px;">Employees</div>
                <div style="color:#6b7098; font-size:11.2px;">Select an employee to manage their profile and permissions.</div>
                <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
                  <div class="stat-card" style="display:flex; justify-content:space-between; align-items:center; padding:12px; cursor:pointer;"><span>John D.</span><span style="color:#85e09a;">Active</span></div>
                  <div class="stat-card" style="display:flex; justify-content:space-between; align-items:center; padding:12px; cursor:pointer;"><span>Jane S.</span><span style="color:#85e09a;">Active</span></div>
                  <div class="stat-card" style="display:flex; justify-content:space-between; align-items:center; padding:12px; cursor:pointer;"><span>R. Brown</span><span style="color:#f0c27f;">On Leave</span></div>
                </div>
                `,
                `
                <div style="font-size:12.8px; color:#9aa0cc; font-weight:600; margin-bottom:8px;">Settings</div>
                <div style="color:#6b7098; font-size:11.2px;">Configure system parameters.</div>
                <div style="margin-top:16px; background:#1a1c34; padding:16px; border-radius:6.4px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px; align-items:center;"><span style="color:#9aa0cc; font-size:12px;">Enable Auto-Approve</span><input type="checkbox" checked style="accent-color:#8B5CF6; cursor:pointer; width:16px; height:16px;" /></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px; align-items:center;"><span style="color:#9aa0cc; font-size:12px;">Email Notifications</span><input type="checkbox" checked style="accent-color:#8B5CF6; cursor:pointer; width:16px; height:16px;" /></div>
                    <div style="display:flex; justify-content:space-between; align-items:center;"><span style="color:#9aa0cc; font-size:12px;">Dark Mode Default</span><input type="checkbox" checked style="accent-color:#8B5CF6; cursor:pointer; width:16px; height:16px;" /></div>
                </div>
                `,
                `
                <div style="font-size:12.8px; color:#9aa0cc; font-weight:600; margin-bottom:8px; flex-shrink:0;">Analytics</div>
                <div style="color:#6b7098; font-size:11.2px; margin-bottom:16px; flex-shrink:0;">Request trends over the last 30 days.</div>
                <div id="analytics-chart" style="flex:1; margin-bottom:-9.6px; margin-left:-11.2px; width:calc(100% + 22.4px); min-height:100px; background:transparent; border-bottom:2px solid #8B5CF6; position:relative; overflow:hidden; cursor:crosshair;">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%; height:100%; position:absolute; bottom:0; left:0;">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(139,92,246,0.5)" />
                        <stop offset="100%" stop-color="rgba(139,92,246,0.0)" />
                      </linearGradient>
                    </defs>
                    <path class="anim-area" d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" fill="url(#chart-grad)" />
                    <path class="anim-line" d="M0,50 Q25,20 50,60 T100,30" fill="none" stroke="#8B5CF6" stroke-width="3" vector-effect="non-scaling-stroke" />
                  </svg>
                  <div id="chart-tracker" style="position:absolute; top:0; bottom:0; width:1px; background:rgba(139,92,246,0.5); left:50%; pointer-events:none; opacity:0; transition:opacity 0.2s ease;">
                    <div id="chart-dot" style="position:absolute; width:8px; height:8px; background:#fff; border:2px solid #8B5CF6; border-radius:50%; transform:translate(-4px, -4px); box-shadow:0 0 8px #8B5CF6;"></div>
                    <div id="chart-tooltip" style="position:absolute; background:#1e2255; color:#fff; font-size:9px; padding:4px 8px; border-radius:4px; top:10px; transform:translateX(-50%); white-space:nowrap; border:1px solid #2a2d50;">Req: 120</div>
                  </div>
                </div>
                <style>
                  .anim-line {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: drawLine 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                  }
                  .anim-area {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeUp 0.8s ease forwards 0.3s;
                  }
                  @keyframes drawLine { to { stroke-dashoffset: 0; } }
                  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
                </style>
                `
            ];

            const bindRowActions = () => {
                const rows = document.querySelectorAll('.action-row');
                rows.forEach(row => {
                    row.addEventListener('click', () => {
                        const idEl = row.querySelector('.col-id');
                        const id = idEl ? idEl.innerText : 'Item';
                        
                        let toast = document.getElementById('dash-toast');
                        if (toast) toast.remove();
                        
                        toast = document.createElement('div');
                        toast.id = 'dash-toast';
                        toast.style.cssText = 'position:absolute; bottom:16px; left:50%; transform:translateX(-50%) translateY(20px); background:#85e09a; color:#0f1023; padding:8px 16px; border-radius:16px; font-size:11px; font-weight:bold; opacity:0; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow:0 4px 12px rgba(133,224,154,0.3); z-index:100; pointer-events:none;';
                        toast.innerText = 'Opened details for ' + id;
                        document.querySelector('.dash-wrap').appendChild(toast);
                        
                        setTimeout(() => {
                            toast.style.transform = 'translateX(-50%) translateY(0)';
                            toast.style.opacity = '1';
                        }, 10);
                        
                        setTimeout(() => {
                            toast.style.transform = 'translateX(-50%) translateY(20px)';
                            toast.style.opacity = '0';
                            setTimeout(() => toast?.remove(), 300);
                        }, 2000);
                    });
                });
            };

            const bindAnalytics = () => {
                const chart = document.getElementById('analytics-chart');
                if (!chart) return;
                const tracker = document.getElementById('chart-tracker');
                const dot = document.getElementById('chart-dot');
                const tooltip = document.getElementById('chart-tooltip');
                const path = chart.querySelector('.anim-line');
                
                if(!path || !tracker || !dot || !tooltip) return;
                
                // Use a basic mathematical approximation of the path curve for perfectly smooth tracking
                const getPathY = (xPct) => {
                    // M0,50 Q25,20 50,60 T100,30
                    // Approximated by a combination of sine waves
                    const y = 50 - Math.sin(xPct * Math.PI * 2) * 20 + Math.sin(xPct * Math.PI) * 10;
                    return y;
                };
                
                chart.addEventListener('mousemove', (e) => {
                    const rect = chart.getBoundingClientRect();
                    let xPct = (e.clientX - rect.left) / rect.width;
                    xPct = Math.max(0, Math.min(1, xPct));
                    
                    tracker.style.opacity = '1';
                    tracker.style.left = (xPct * 100) + '%';
                    
                    const mathY = getPathY(xPct);
                    dot.style.top = mathY + '%';
                    
                    const day = Math.max(1, Math.ceil(xPct * 30));
                    tooltip.innerText = 'Day ' + day + ': ' + Math.floor(150 - mathY);
                });
                
                chart.addEventListener('mouseleave', () => {
                    tracker.style.opacity = '0';
                });
            };

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active-nav'));
                    tab.classList.add('active-nav');
                    if (dashMain && tabContents[index]) {
                        dashMain.innerHTML = tabContents[index];
                        bindRowActions();
                        if (index === 3) bindAnalytics();
                    }
                });
            });

            // 2. Notification Bell
            const bell = document.querySelector('.bell-icon');
            if (bell) {
                bell.addEventListener('click', () => {
                    let notif = document.getElementById('dash-notif-popup');
                    if (!notif) {
                        notif = document.createElement('div');
                        notif.id = 'dash-notif-popup';
                        notif.style.cssText = 'position:absolute; top:40px; right:12.8px; background:#1e2255; border:1px solid #2a2d50; border-radius:8px; padding:12px; box-shadow:0 8px 24px rgba(0,0,0,0.5); z-index:100; font-size:11px; color:#a0a8d0; width:220px; transform:translateY(-10px); opacity:0; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);';
                        notif.innerHTML = '<div style="font-weight:bold; margin-bottom:8px; color:#fff; display:flex; justify-content:space-between;"><span>Notifications</span><span style="background:#e07878; color:#fff; padding:2px 6px; border-radius:8px; font-size:9px;">3 New</span></div><div style="line-height:1.4;">You have 3 pending leave requests requiring admin approval.</div>';
                        document.querySelector('.dash-wrap').appendChild(notif);
                        
                        setTimeout(() => {
                            notif.style.transform = 'translateY(0)';
                            notif.style.opacity = '1';
                        }, 10);
                    } else {
                        notif.style.transform = 'translateY(-10px)';
                        notif.style.opacity = '0';
                        setTimeout(() => notif?.remove(), 300);
                    }
                });
            }
            
            // Re-bind initial rows
            bindRowActions();
        };

        setTimeout(initPhase5Interactions, 1000);

        return () => {
            isUnmounted = true;
            if (containerRef.current) observer.unobserve(containerRef.current);
            clearAllTimeouts();
        };


    }, []);

    return (
        <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pipeline-wrap {
    background: transparent;
    padding: 0;
    width: 100%;
    overflow: visible;
  }

  .phases-row {
    display: grid;
    align-items: start;
    gap: 16px;
    margin-bottom: 16px;
  }
  .row-2-col {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
  .row-3-col {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  @media (min-width: 1024px) {
    .row-2-col { grid-template-columns: repeat(2, 1fr); }
    .row-3-col { grid-template-columns: repeat(3, 1fr); }
  }

  .phase-col {
    z-index: 1;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 19.2px;
    border: 1px solid var(--border-color, rgba(160, 168, 208, 0.2));
    padding: 22.4px 16px 19.2px;
    min-height: 400px;
    position: relative;
    overflow: visible;
    opacity: 0.4;
    transition: opacity 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
  }

  .phase-col.active {
    opacity: 1;
    border-color: var(--border-color, rgba(160, 168, 208, 0.4));
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .phase-col.done { opacity: 1; }

  .phase-content {
    width: 100%;
    height: 100%;
    position: relative;
    min-height: 340px;
  }

  /* === PHASE 1: Sticky notes === */
  .sticky-note {
    background: rgba(30, 32, 56, 0.4);
    border: 1px solid rgba(160, 168, 208, 0.2);
    border-radius: 9.6px;
    padding: 9.6px 11.2px;
    font-size: 15.2px;
    font-weight: 500;
    line-height: 1.3;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0;
    transform: translateY(-25.6px);
    transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease; cursor: default;
    gap: 4.8px;
  }

  .sticky-note.show {
    opacity: 1;
    transform: translateY(0);
  }

  .sticky-note svg { flex-shrink: 0; }

  /* === PHASE 2: ER Diagram === */
  .er-table {
    background: rgba(30, 32, 56, 0.4);
    border: 1.6px solid rgba(42, 45, 80, 0.8);
    border-radius: 9.6px;
    font-size: 13.6px;
    width: max-content;
    overflow: hidden;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease;
    position: relative;
  }

  
  .er-table.show { opacity: 1; transform: translateY(0); }
  .er-table.show:hover { transform: translateY(-6px); border-color: #3B82F6; box-shadow: 0 16px 32px rgba(0,0,0,0.3); }
  html[data-theme='light'] .er-table.show:hover { box-shadow: 0 16px 32px rgba(0,0,0,0.1); border-color: #3B82F6; }


  .er-header {
    background: #2a2d50;
    padding: 6.4px 11.2px;
    font-weight: 600;
    font-size: 13.6px;
    color: #a0a8d0;
    display: flex;
    align-items: center;
    gap: 6.4px;
  }

  .er-row {
    padding: 4px 11.2px;
    color: #6b7098;
    font-size: 12px;
    border-top: 1.6px solid #1e2038;
    transition: padding-left 0.3s ease, background 0.3s ease, color 0.3s ease;
    cursor: default;
  }
  .er-row:hover {
    padding-left: 17.6px;
    background: rgba(59, 130, 246, 0.1);
    color: #93c5fd;
  }

  .er-connector {
    position: absolute;
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
  }

  .er-connector.show { opacity: 1; }

  /* === PHASE 3: API Table === */
  .api-section { position: absolute; width: 100%; opacity: 0; transform: translateX(-12.8px); transition: opacity 0.4s ease, transform 0.4s ease; }
  .api-section.show { opacity: 1; transform: translateX(0); }

  .api-role {
    font-size: 14.4px;
    font-weight: 700;
    margin-bottom: 6.4px;
    letter-spacing: 0.8px;
    display: flex;
    align-items: center;
    gap: 6.4px;
  }

  .api-row {
    display: flex;
    align-items: center;
    gap: 6.4px;
    font-size: 12.8px;
    padding: 4px 8px;
    border-radius: 6.4px;
    margin: 2px 0;
    opacity: 0;
    transform: translateX(-9.6px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease, padding-left 0.3s ease;
    cursor: default;
  }

  .api-row.show { opacity: 1; transform: translateX(0); }
  
  .api-row:hover {
    background: rgba(255, 255, 255, 0.05);
    padding-left: 14px;
  }
  
  html[data-theme='light'] .api-row:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .api-row:hover .method { text-shadow: 0 0 10px currentColor; }
  
  .api-row:has(.check[style*="#e07878"]):hover .endpoint {
    text-decoration: line-through;
    opacity: 0.5;
  }

  .method {
    font-weight: 700;
    font-size: 12px;
    min-width: 48px;
    color: #7ec8e3;
  }

  .method.post { color: #85e09a; }
  .method.put { color: #f0c27f; }
  .method.del { color: #e07878; }

  .endpoint { color: #8890b5; font-size: 12px; flex: 1; }

  .check { font-size: 14.4px; }

  /* === PHASE 4: Flowchart === */
  .flow-node {
    background: rgba(26, 28, 52, 0.4);
    border: 1.6px solid rgba(42, 45, 80, 0.8);
    border-radius: 9.6px;
    padding: 8px 12.8px; font-size: 13.6px; color: #9aa0cc;
    display: flex; align-items: center; gap: 8px; width: max-content; position: relative;
    opacity: 0; transform: translateY(12.8px);
    transition: opacity 0.35s ease, transform 0.35s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    cursor: default;
  }

  .flow-node.show { opacity: 1; transform: translateY(0); }

  .flow-node.show:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    border-color: #F59E0B;
  }
  
  html[data-theme='light'] .flow-node.show:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
  
  .flow-node.show:hover svg {
    animation: bounceIcon 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  @keyframes bounceIcon {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2) translateY(-2px); }
  }

  .flow-arrow {
    width: 24px; height: 3.2px; border-radius: 1.6px; position: relative;
    background: linear-gradient(90deg, #F59E0B, #fef08a);
    opacity: 0; transition: opacity 0.3s ease, width 0.3s ease, box-shadow 0.3s ease; left: 0; transform: none;
  }

  .flow-arrow.show { opacity: 1; }
  
  .flow-node.show:hover + .flow-arrow.show {
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
    background: linear-gradient(90deg, #F59E0B, #fef08a, #F59E0B);
    background-size: 200% 100%;
    animation: flowingLine 1s infinite linear;
  }

  /* === PHASE 5: Dashboard === */
  .er-connector.show { opacity: 1; }
  html[data-theme="light"] .er-connector { background: linear-gradient(90deg, #94a3b8, #cbd5e1) !important; }
  html[data-theme="light"] .flow-arrow { background: linear-gradient(90deg, #94a3b8, #cbd5e1) !important; }
  .dash-wrap {
    background: rgba(15, 16, 35, 0.4);
    border-radius: 12.8px;
    border: 1.6px solid rgba(42, 45, 80, 0.8);
    overflow: hidden;
    position: absolute;
    width: 100%;
    opacity: 0;
    transform: scale(0.96);
    transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease;
  }

  .dash-wrap.show { opacity: 1; transform: scale(1); }
  
  #phase-5:hover .dash-wrap.show {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
  }

  .dash-topbar {
    background: #1a1c34;
    padding: 8px 12.8px;
    font-size: 12.8px;
    color: #6b7098;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .dash-topbar svg {
    transition: transform 0.3s ease;
    transform-origin: top center;
    cursor: pointer;
  }
  .dash-topbar svg:hover {
    animation: ringBell 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  @keyframes ringBell {
    0% { transform: rotate(0); }
    25% { transform: rotate(15deg); }
    50% { transform: rotate(-10deg); }
    75% { transform: rotate(5deg); }
    100% { transform: rotate(0); }
  }

  .dash-sidebar {
    background: #141527;
    width: 73.6px;
    padding: 9.6px 0;
    position: absolute;
    top: 35.2px;
    bottom: 0;
    left: 0;
    border-right: 1.6px solid #1e2038;
  }

  .dash-item {
    padding: 6.4px 9.6px;
    font-size: 10.4px;
    color: #4a5080;
    display: flex;
    align-items: center;
    gap: 4.8px;
    cursor: default;
    border-radius: 6.4px;
    margin: 1.6px 6.4px;
    transition: background 0.2s ease, color 0.2s ease;
  }
  
  .dash-item:not(.active-nav):hover {
    background: rgba(255, 255, 255, 0.05);
    color: #9aa0cc;
  }

  .dash-item.active-nav { background: #1e2255; color: #7a80cc; }

  .dash-main {
    margin-left: 73.6px;
    padding: 9.6px 11.2px;
    height: calc(100% - 35.2px);
    overflow-y: auto;
    margin-top: 35.2px;
    display: flex;
    flex-direction: column;
  }
  
  /* Scrollbar styles for dash-main */
  .dash-main::-webkit-scrollbar { width: 4px; }
  .dash-main::-webkit-scrollbar-track { background: transparent; }
  .dash-main::-webkit-scrollbar-thumb { background: #2a2d50; border-radius: 4px; }
  html[data-theme='light'] .dash-main::-webkit-scrollbar-thumb { background: #cbd5e1; }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6.4px;
    margin-bottom: 9.6px;
  }

  .stat-card {
    background: #1a1c34;
    border-radius: 6.4px;
    padding: 6.4px 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .stat-card:hover .stat-val {
    transform: scale(1.1);
  }

  .stat-label { font-size: 9.6px; color: #4a5080; margin-bottom: 3.2px; }
  .stat-val { font-size: 19.2px; font-weight: 700; transition: transform 0.3s ease; display: inline-block; transform-origin: left bottom; }

  .table-row {
    display: flex;
    gap: 4.8px;
    font-size: 10.4px;
    padding: 4.8px 6.4px;
    margin-left: -6.4px;
    border-bottom: 1.6px solid #1a1c2e;
    color: #6b7098;
    opacity: 0;
    border-radius: 4px;
    transition: opacity 0.3s ease, background 0.2s ease, padding-left 0.2s ease;
    cursor: default;
  }

  .table-row.show { opacity: 1; }
  .table-row:first-child { color: #4a5080; font-size: 9.6px; }
  .table-row.show:first-child { opacity: 1; }
  
  .table-row.show:not(:first-child):hover {
    background: rgba(255, 255, 255, 0.05);
    padding-left: 12.8px;
  }
  .col-id { width: 32px; }
  .col-type { width: 44.8px; }
  .col-emp { flex: 1; }
  .col-status { width: 44.8px; }
  .status-pending { color: #f0c27f; }
  .status-approved { color: #85e09a; }

  /* === FLOW LINE === */
  .flow-line-container {
    position: relative;
    margin-top: 25.6px;
    height: 6.4px;
  }

  .flow-track {
    position: absolute;
    inset: 0;
    background: #1e2038;
    border-radius: 3.2px;
  }

  .flow-fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    border-radius: 3.2px;
    width: 0%;
    transition: width 0.05s linear;
    background: linear-gradient(90deg, #7C3AED, #3B82F6, #06B6D4, #F59E0B, #8B5CF6);
    background-size: 200% 100%;
  }

  .flow-dot {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    left: 0%;
    transition: left 0.05s linear, background 0.3s ease;
    box-shadow: 0 0 12.8px 3.2px currentColor;
  }

  .phase-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 19.2px;
  }

  .pdot {
    width: 9.6px;
    height: 9.6px;
    border-radius: 50%;
    background: #2a2d50;
    transition: background 0.3s ease;
  }

  .pdot.lit { background: var(--dot-color); }

  .counter-display {
    font-size: 14.4px;
    color: #4a5080;
    text-align: center;
    margin-top: 9.6px;
    letter-spacing: 1.6px;
  }

  .phase-header { background: transparent; color: var(--phase-color); font-size: 20px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; letter-spacing: -0.02em; }
  .phase-header svg { width: 28px !important; height: 28px !important; }

  /* === LIGHT THEME OVERRIDES === */
  html[data-theme='light'] .pipeline-wrap { background: transparent; }
  html[data-theme='light'] .phase-col { background: #ffffff; border-color: #e2e8f0; backdrop-filter: none; -webkit-backdrop-filter: none; }
  html[data-theme='light'] .phase-header { background: transparent; color: var(--phase-color); }
  
  /* Light theme sticky note overrides */
  html[data-theme='light'] #sn1 { background: #fef08a !important; color: #713f12 !important; border-color: #fef08a !important; }
  html[data-theme='light'] #sn1 svg { stroke: #a16207 !important; }
  html[data-theme='light'] #sn2 { background: #f9a8d4 !important; color: #831843 !important; border-color: #f9a8d4 !important; }
  html[data-theme='light'] #sn2 svg { stroke: #9d174d !important; }
  html[data-theme='light'] #sn3 { background: #86efac !important; color: #14532d !important; border-color: #86efac !important; }
  html[data-theme='light'] #sn3 svg { stroke: #166534 !important; }
  html[data-theme='light'] #sn4 { background: #93c5fd !important; color: #1e3a5f !important; border-color: #93c5fd !important; }
  html[data-theme='light'] #sn4 svg { stroke: #1e40af !important; }

  html[data-theme='light'] .er-table { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
  html[data-theme='light'] .er-header { background: #e2e8f0; color: #475569; }
  html[data-theme='light'] .er-row { border-color: #e2e8f0; color: #475569; }
  html[data-theme='light'] .er-row:hover { background: #eff6ff; color: #2563eb; }
  html[data-theme='light'] .endpoint { color: #64748b; }
  html[data-theme='light'] .flow-node { background: #ffffff; border-color: #cbd5e1; color: #475569; }
  html[data-theme='light'] .flow-arrow { background: #cbd5e1; }
  html[data-theme='light'] .dash-wrap { background: #ffffff; border-color: #e2e8f0; }
  html[data-theme='light'] .dash-topbar { background: #f1f5f9; color: #64748b; }
  html[data-theme='light'] .dash-sidebar { background: #f8fafc; border-color: #e2e8f0; }
  html[data-theme='light'] .dash-item { color: #94a3b8; }
  html[data-theme='light'] .dash-item.active-nav { background: #e2e8f0; color: #475569; }
  html[data-theme='light'] .dash-main { background: #ffffff; }
  html[data-theme='light'] .stat-card { background: #f1f5f9; }
  html[data-theme='light'] .stat-label { color: #64748b; }
  html[data-theme='light'] .table-row { border-color: #e2e8f0; color: #64748b; }
  html[data-theme='light'] .table-row:first-child { color: #475569; }
  
  html[data-theme='light'] #phase-5:hover .dash-wrap.show { box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.3); }
  html[data-theme='light'] .dash-item:not(.active-nav):hover { background: rgba(0, 0, 0, 0.04); color: #475569; }
  html[data-theme='light'] .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  html[data-theme='light'] .table-row.show:not(:first-child):hover { background: rgba(0, 0, 0, 0.03); }

  
  .sticky-note { cursor: pointer; z-index: 1; }
  .sticky-note:hover { z-index: 50; }
  .concept-branches {
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    z-index: -1;
    pointer-events: none;
  }
  .concept-branch {
    position: absolute;
    top: 0; left: 0;
    transform-origin: left center;
    transform: rotate(var(--angle));
    width: 0px;
    display: flex;
    align-items: center;
    transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) var(--delay-out, 0s);
  }
  .sticky-note:hover .concept-branch {
    width: var(--dist);
    transition-delay: var(--delay-in, 0s);
  }
  .concept-line {
    width: calc(100% - 64px);
    margin-left: 64px;
    height: 2px;
    background: repeating-linear-gradient(90deg, currentColor 0, currentColor 4px, transparent 4px, transparent 10px);
    opacity: 0;
    transition: opacity 0.4s ease var(--delay-out, 0s);
  }
  .sticky-note:hover .concept-line {
    opacity: 0.6;
    transition-delay: var(--delay-in, 0s);
  }
  .concept-node-wrap {
    position: absolute;
    left: 100%; 
    transform-origin: left center;
    transform: rotate(calc(-1 * var(--angle)));
  }
  .concept-node {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: #1e2038;
    color: #a0a8d0;
    border: 2px solid currentColor;
    padding: 9.6px 16px;
    border-radius: 24px;
    font-size: 14.4px;
    white-space: nowrap;
    font-weight: 600;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) var(--delay-out, 0s);
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  .sticky-note:hover .concept-node {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    transition-delay: var(--delay-in, 0s);
  }
  html[data-theme='light'] .concept-node { background: #ffffff; color: #475569; border-color: #cbd5e1; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }


  


  .bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    width: 100%;
    margin-top: 16px;
  }
  .sticky-note {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    width: 100% !important;
    height: 110px;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease, box-shadow 0.4s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .sticky-note:hover {
    transform: scale(1.05) !important;
    z-index: 100 !important;
    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
  }
  .sticky-note.show {
    opacity: 1;
    transform: scale(1);
  }
  /* Ensure the text is readable and centered */
  .sticky-note {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }


  .concept-branch:nth-child(1) { --delay-in: 0s; --delay-out: 0.3s; }
  .concept-branch:nth-child(2) { --delay-in: 0.1s; --delay-out: 0.2s; }
  .concept-branch:nth-child(3) { --delay-in: 0.2s; --delay-out: 0.1s; }
  .concept-branch:nth-child(4) { --delay-in: 0.3s; --delay-out: 0s; }

  .phase-col:hover { z-index: 10; }
</style>


<div class="pipeline-wrap">
  <div class="phases-row row-2-col" id="phases-row-1">

    <!-- PHASE 1 -->
    <div class="phase-col" id="phase-1" style="--phase-color:#7C3AED; --phase-color-glow:rgba(124,58,237,0.4)">
      <div class="phase-content" id="p1-content">
        <div class="phase-header"><svg width="19.2" height="19.2" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="5.1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>What problem are we solving?</div>
        <div class="bento-grid">
        <div class="sticky-note" id="sn1" style="background:rgba(254, 240, 138, 0.05); border: 1px solid rgba(254, 240, 138, 0.3); color:#fef08a;">
          <svg width="17.6" height="17.6" viewBox="0 0 24 24" fill="none" stroke="#fef08a" stroke-width="5.1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
          Business Goals
          <div class="concept-branches">
            <div class="concept-branch" style="--angle: -25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Reduce HR overhead</div></div></div>
            <div class="concept-branch" style="--angle: 25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Digitize records</div></div></div>
            <div class="concept-branch" style="--angle: 155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Automate payroll</div></div></div>
            <div class="concept-branch" style="--angle: -155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Centralize data</div></div></div>
          </div>
        </div>
        <div class="sticky-note" id="sn2" style="background:rgba(249, 168, 212, 0.05); border: 1px solid rgba(249, 168, 212, 0.3); color:#f9a8d4;">
          <svg width="17.6" height="17.6" viewBox="0 0 24 24" fill="none" stroke="#f9a8d4" stroke-width="5.1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
          User Needs
          <div class="concept-branches">
            <div class="concept-branch" style="--angle: -25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Self-service portal</div></div></div>
            <div class="concept-branch" style="--angle: 25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">View digital paystubs</div></div></div>
            <div class="concept-branch" style="--angle: 155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Request time off</div></div></div>
            <div class="concept-branch" style="--angle: -155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Update personal info</div></div></div>
          </div>
        </div>
        <div class="sticky-note" id="sn3" style="background:rgba(134, 239, 172, 0.05); border: 1px solid rgba(134, 239, 172, 0.3); color:#86efac;">
          <svg width="17.6" height="17.6" viewBox="0 0 24 24" fill="none" stroke="#86efac" stroke-width="5.1"><rect x="3" y="11" width="28.8" height="17.6" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Constraints
          <div class="concept-branches">
            <div class="concept-branch" style="--angle: -25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Strict budget limits</div></div></div>
            <div class="concept-branch" style="--angle: 25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Data privacy compliance</div></div></div>
            <div class="concept-branch" style="--angle: 155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Legacy integration</div></div></div>
            <div class="concept-branch" style="--angle: -155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Tight deadline</div></div></div>
          </div>
        </div>
        <div class="sticky-note" id="sn4" style="background:rgba(147, 197, 253, 0.05); border: 1px solid rgba(147, 197, 253, 0.3); color:#93c5fd;">
          <svg width="17.6" height="17.6" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="5.1"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Core Features
          <div class="concept-branches">
            <div class="concept-branch" style="--angle: -25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Role-based access</div></div></div>
            <div class="concept-branch" style="--angle: 25deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Leave management</div></div></div>
            <div class="concept-branch" style="--angle: 155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Automated approvals</div></div></div>
            <div class="concept-branch" style="--angle: -155deg; --dist: 150px;"><div class="concept-line"></div><div class="concept-node-wrap"><div class="concept-node">Reporting dashboard</div></div></div>
          </div>
        </div>
        </div>
        </div>
      </div>

    <!-- PHASE 2 -->
    <div class="phase-col" id="phase-2" style="--phase-color:#3B82F6; --phase-color-glow:rgba(59,130,246,0.4)">
      <div class="phase-content" id="p2-content" style="position:relative; display:flex; flex-direction:column;">
        <div class="phase-header"><svg width="19.2" height="19.2" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="5.1"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>Where does the data live?</div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:flex-start;">
        <div class="er-table" id="er-user">
          <div class="er-header">
            <svg width="14.4" height="14.4" viewBox="0 0 24 24" fill="none" stroke="#a0a8d0" stroke-width="6.4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Employee
          </div>
          <div class="er-row">id (PK)</div>
          <div class="er-row">name</div>
          <div class="er-row">email</div>
          <div class="er-row">dept_id (FK)</div>
          <div class="er-row">role_id (FK)</div>
        </div>
        <div class="er-connector" id="er-line1" style="width: 16px; height: 3.2px; border-radius: 1.6px; background: linear-gradient(90deg, #3B82F6, #93c5fd); opacity: 0; transition: opacity 0.5s ease; margin-top: 60px;"></div>
        <div class="er-table" id="er-role">
          <div class="er-header">
            <svg width="14.4" height="14.4" viewBox="0 0 24 24" fill="none" stroke="#a0a8d0" stroke-width="6.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Role
          </div>
          <div class="er-row">id (PK)</div>
          <div class="er-row">title</div>
          <div class="er-row">access_level</div>
        </div>
        <div class="er-connector" id="er-line2" style="width: 16px; height: 3.2px; border-radius: 1.6px; background: linear-gradient(90deg, #3B82F6, #93c5fd); opacity: 0; transition: opacity 0.5s ease; margin-top: 60px;"></div>
        <div class="er-table" id="er-dept">
          <div class="er-header">
            <svg width="14.4" height="14.4" viewBox="0 0 24 24" fill="none" stroke="#a0a8d0" stroke-width="6.4"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>
            Department
          </div>
          <div class="er-row">id (PK)</div>
          <div class="er-row">name</div>
          <div class="er-row">budget</div>
        </div>
        <div class="er-connector" id="er-line3" style="width: 16px; height: 3.2px; border-radius: 1.6px; background: linear-gradient(90deg, #3B82F6, #93c5fd); opacity: 0; transition: opacity 0.5s ease; margin-top: 60px;"></div>
        <div class="er-table" id="er-request">
          <div class="er-header">
            <svg width="14.4" height="14.4" viewBox="0 0 24 24" fill="none" stroke="#a0a8d0" stroke-width="6.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Request
          </div>
          <div class="er-row">id (PK)</div>
          <div class="er-row">emp_id (FK)</div>
          <div class="er-row">type (Leave/Expense)</div>
          <div class="er-row">status</div>
        </div>
        </div>
        
      </div>
    </div>
  </div>
  <div class="phases-row row-3-col" id="phases-row-2">

    <!-- PHASE 3 -->
    <div class="phase-col" id="phase-3" style="--phase-color:#06B6D4; --phase-color-glow:rgba(6,182,212,0.4)">
      <div class="phase-content" id="p3-content" style="position:relative; display:flex; flex-direction:column;">
        <div class="phase-header"><svg width="19.2" height="19.2" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="5.1"><rect x="3" y="11" width="28.8" height="17.6" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Who can access what?</div>
        <div class="api-section" id="api-admin" style="top:80px; right:0; width: 48%;">
          <div class="api-role" style="color:#06B6D4;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="6.4"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            ADMIN
          </div>
          <div class="api-row" id="a1"><span class="method">GET</span><span class="endpoint">/employees</span><span class="check" style="color:#85e09a">✓</span></div>
          <div class="api-row" id="a2"><span class="method post">POST</span><span class="endpoint">/employees</span><span class="check" style="color:#85e09a">✓</span></div>
          <div class="api-row" id="a3"><span class="method put">PUT</span><span class="endpoint">/employees/{id}</span><span class="check" style="color:#85e09a">✓</span></div>
          <div class="api-row" id="a4"><span class="method del">DELETE</span><span class="endpoint">/employees/{id}</span><span class="check" style="color:#85e09a">✓</span></div>
        </div>
        <div class="api-section" id="api-emp" style="top:80px; left:0; width: 48%;">
          <div class="api-role" style="color:#a78bfa;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="6.4"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            EMPLOYEE
          </div>
          <div class="api-row" id="b1"><span class="method">GET</span><span class="endpoint">/profile</span><span class="check" style="color:#85e09a">✓</span></div>
          <div class="api-row" id="b2"><span class="method put">PUT</span><span class="endpoint">/profile</span><span class="check" style="color:#85e09a">✓</span></div>
          <div class="api-row" id="b3"><span class="method del">DELETE</span><span class="endpoint">/employees</span><span class="check" style="color:#e07878">✗</span></div>
        </div>
        
      </div>
    </div>

    <!-- PHASE 4 -->
    <div class="phase-col" id="phase-4" style="--phase-color:#F59E0B; --phase-color-glow:rgba(245,158,11,0.4)">
      <div class="phase-content" id="p4-content" style="position:relative; display:flex; flex-direction:column;">
        <div class="phase-header"><svg width="19.2" height="19.2" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>How does work get done?</div>
        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
          <!-- EMPLOYEE ROW -->
          <div style="width: 100%; font-weight: bold; font-size: 14.4px; color: #a78bfa; display:flex; align-items:center; gap: 6.4px; opacity:0; transition: opacity 0.5s ease;" id="flow-emp-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="6.4"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            EMPLOYEE
          </div>
          <div class="flow-node" id="fne1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Login
          </div>
          <div class="flow-arrow" id="fae1"></div>
          <div class="flow-node" id="fne2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Draft Leave
          </div>
          <div class="flow-arrow" id="fae2"></div>
          <div class="flow-node" id="fne3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Submit
          </div>

          <!-- ADMIN ROW -->
          <div style="width: 100%; font-weight: bold; font-size: 14.4px; color: #06B6D4; display:flex; align-items:center; gap: 6.4px; margin-top: 16px; opacity:0; transition: opacity 0.5s ease;" id="flow-adm-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="6.4"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            ADMIN
          </div>
          <div class="flow-node" id="fna1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Review Request
          </div>
          <div class="flow-arrow" id="faa1"></div>
          <div class="flow-node" id="fna2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><polyline points="20 6 9 17 4 12"/></svg>
            Approve / Reject
          </div>
          <div class="flow-arrow" id="faa2"></div>
          <div class="flow-node" id="fna3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Update Payroll
          </div>
          <div class="flow-arrow" id="faa3"></div>
          <div class="flow-node" id="fna4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="5.1"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Notify Employee
          </div>
        </div>
        
      </div>
    </div>

    <!-- PHASE 5 -->
    <div class="phase-col" id="phase-5" style="--phase-color:#8B5CF6; --phase-color-glow:rgba(139,92,246,0.4)">
      <div class="phase-content" id="p5-content" style="position:relative; display:flex; flex-direction:column;">
        <div class="phase-header"><svg width="19.2" height="19.2" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="5.1"><rect x="2" y="3" width="32" height="22.4" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>Build the experience.</div>
        <div class="dash-wrap" id="dash-main" style="top:80px; bottom:0;">
          <div class="dash-topbar">
            <span style="color:#a0a8d0; font-weight:600; font-size:12.8px;">Acme HRMS</span>
            <svg class="bell-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7098" stroke-width="5.1"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
          </div>
          <div class="dash-sidebar">
            <div class="dash-item active-nav"><svg width="12.8" height="12.8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="6.4"><rect x="3" y="3" width="11.2" height="11.2"/><rect x="14" y="3" width="11.2" height="11.2"/><rect x="14" y="14" width="11.2" height="11.2"/><rect x="3" y="14" width="11.2" height="11.2"/></svg></div>
            <div class="dash-item"><svg width="12.8" height="12.8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5.1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
            <div class="dash-item"><svg width="12.8" height="12.8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5.1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div class="dash-item"><svg width="12.8" height="12.8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5.1"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          </div>
          <div class="dash-main">
            <div style="font-size:12.8px; color:#9aa0cc; font-weight:600; margin-bottom:8px;">Dashboard</div>
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-label">Total</div>
                <div class="stat-val" id="stat-total" style="color:#8B5CF6;">0</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Pending</div>
                <div class="stat-val" id="stat-pending" style="color:#F59E0B;">0</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Approved</div>
                <div class="stat-val" id="stat-approved" style="color:#85e09a;">0</div>
              </div>
            </div>
            <div style="font-size:11.2px; color:#4a5080; margin-bottom:4.8px; font-weight:600;">RECENT REQUESTS</div>
            <div style="overflow:hidden;">
              <div class="table-row show" style="color:#4a5080;">
                <span class="col-id">ID</span><span class="col-type">Type</span><span class="col-emp">Employee</span><span class="col-status">Status</span>
              </div>
              <div class="table-row action-row" id="tr1" style="cursor:pointer;"><span class="col-id">#1024</span><span class="col-type">Leave</span><span class="col-emp">John D.</span><span class="col-status status-pending">Pending</span></div>
              <div class="table-row action-row" id="tr2" style="cursor:pointer;"><span class="col-id">#1023</span><span class="col-type">Expense</span><span class="col-emp">Jane S.</span><span class="col-status status-approved">Approved</span></div>
              <div class="table-row action-row" id="tr3" style="cursor:pointer;"><span class="col-id">#1022</span><span class="col-type">Leave</span><span class="col-emp">R. Brown</span><span class="col-status status-pending">Pending</span></div>
              <div class="table-row action-row" id="tr4" style="cursor:pointer;"><span class="col-id">#1021</span><span class="col-type">Expense</span><span class="col-emp">E. Davis</span><span class="col-status status-approved">Approved</span></div>
              <div class="table-row action-row show" style="cursor:pointer;"><span class="col-id">#1020</span><span class="col-type">Leave</span><span class="col-emp">M. Smith</span><span class="col-status status-pending">Pending</span></div>
              <div class="table-row action-row show" style="cursor:pointer;"><span class="col-id">#1019</span><span class="col-type">Expense</span><span class="col-emp">L. Chen</span><span class="col-status status-approved">Approved</span></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

  </div>
</div>` }} />
    );
};

export default HrmsPipelineMotionCards;
