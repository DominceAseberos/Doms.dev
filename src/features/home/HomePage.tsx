import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import portfolioJson from '../../data/portfolioData.json';
import landingJson from '../../data/landingData.json';
import aboutData from '../../data/aboutData.json';
import type { PortfolioData } from '../../types/content';
import PolygonPreloader from './PolygonPreloader';
import GlobalHeader from '../../components/GlobalHeader';
import GlobalFooter from '../../components/GlobalFooter';
import './home.css';

const portfolio = portfolioJson as PortfolioData;
const featured = portfolio.projects.filter(project => project.featuredInTunnel && project.mainImage);
const services = aboutData.services.slice(0, 6);



function AnimatedGlobe() { return <svg className="globe" viewBox="0 0 64 64" role="img" aria-label="Animated globe"><circle cx="32" cy="32" r="25" /><ellipse cx="32" cy="32" rx="11" ry="25" /><path d="M7 32h50M11 20h42M11 44h42" /><g className="globe__orbit"><circle cx="54" cy="23" r="3" /></g></svg> }
function GlassDebrisD({ active, onEntranceComplete }: { active: boolean; onEntranceComplete: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = canvas.current; if (!cv) return; const context = cv.getContext('2d'); if (!context) return;
    context.clearRect(0, 0, cv.width, cv.height);
    if (!active) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const imageUrls = [
      '/assets/uploads/broken-memory/memory_1.webp',
      '/assets/uploads/broken-memory/memory_2.webp',
      '/assets/uploads/broken-memory/memory_5.webp',
      '/assets/uploads/broken-memory/memory_6.webp',
      '/assets/uploads/broken-memory/memory_7.webp',
      '/assets/uploads/broken-memory/memory_8.webp',
    ];
    const memoryImages = imageUrls.map(() => new Image());
    type GlassShard = {
      x: number; y: number; points: [number, number][]; phase: number; speed: number; depth: number; rotation: number; color: string;
      magnetX: number; magnetY: number; featured: boolean; imageIndex: number; baseSize: number; hover: number; select: number;
      screenX: number; screenY: number; screenRadius: number; orbitWeight: number; reveal: number; revealDelay: number;
    };
    let width = 0, height = 0, frame = 0, letter: GlassShard[] = [], debris: GlassShard[] = [], hoveredIndex = -1, selectedIndex = -1, selectionOpen = false;
    let entranceStartedAt = -1, lastFrameAt = 0, finalRevealDelay = 0, entranceCompleteSent = false;
    const pointer = { x: 0, y: 0, active: false };
    const letterHotZone = { minX: .375, maxX: .635, minY: .09, maxY: .76 };
    const letterMagnetRange = 172;
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
    const traceShard = (shard: GlassShard) => { context.beginPath(); shard.points.forEach(([px, py], index) => index ? context.lineTo(px, py) : context.moveTo(px, py)); context.closePath() };
    const drawMemory = (shard: GlassShard) => {
      const img = memoryImages[shard.imageIndex]; if (!img?.complete || !img.naturalWidth) return false;
      const xs = shard.points.map(([x]) => x), ys = shard.points.map(([, y]) => y), minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const boxW = Math.max(1, maxX - minX), boxH = Math.max(1, maxY - minY), destAspect = boxW / boxH, imageAspect = img.naturalWidth / img.naturalHeight;
      const parallax = (1 - shard.select) * .13, focusX = clamp(.5 + (pointer.x / Math.max(width, 1) - .5) * parallax, .34, .66), focusY = clamp(.5 + (pointer.y / Math.max(height, 1) - .5) * parallax, .34, .66);
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imageAspect > destAspect) { sw = sh * destAspect; sx = (img.naturalWidth - sw) * focusX } else { sh = sw / destAspect; sy = (img.naturalHeight - sh) * focusY }
      context.globalAlpha = .62 + shard.hover * .12 + shard.select * .25; context.drawImage(img, sx, sy, sw, sh, minX, minY, boxW, boxH); context.globalAlpha = 1;
      const glass = context.createLinearGradient(minX, minY, maxX, maxY); glass.addColorStop(0, 'rgba(255,255,255,.34)'); glass.addColorStop(.32, `rgba(69,92,233,${.12 - shard.select * .07})`); glass.addColorStop(1, 'rgba(20,35,120,.24)'); context.fillStyle = glass; context.fillRect(minX, minY, boxW, boxH);
      return true;
    };
    const drawShard = (shard: GlassShard, time: number, isDebris = false) => {
      const focusShard = isDebris && selectedIndex >= 0 && debris[selectedIndex] === shard, focusProgress = selectedIndex >= 0 ? (debris[selectedIndex]?.select ?? 0) : 0;
      const drift = isDebris ? (shard.featured ? 3 + shard.depth * 5 : 2.5 + shard.depth * 5) : .18 + shard.depth * .35;
      let sourceX = shard.x + Math.sin(time * shard.speed + shard.phase) * drift, sourceY = shard.y + Math.cos(time * shard.speed * .73 + shard.phase) * drift * .72;
      const range = shard.featured ? 180 : 145;
      const distance = isDebris && pointer.active ? Math.hypot(pointer.x - sourceX, pointer.y - sourceY) : Infinity;
      const influence = isDebris && pointer.active && distance < range ? Math.pow(1 - distance / range, 2) : 0;
      if (!isDebris) {
        const dx = pointer.x - shard.x, dy = pointer.y - shard.y, baseDistance = Math.hypot(dx, dy);
        const canMagnetize = pointer.active && !selectionOpen && hoveredIndex < 0 && shard.reveal > .86 && inLetterHotZone(shard) && baseDistance < letterMagnetRange;
        const letterInfluence = canMagnetize ? Math.pow(1 - baseDistance / letterMagnetRange, 1.55) : 0;
        if (letterInfluence > 0) {
          const pull = .9, maxDetach = Math.min(78, shard.baseSize * 1.85);
          const targetX = clamp(dx * letterInfluence * pull, -maxDetach, maxDetach), targetY = clamp(dy * letterInfluence * pull, -maxDetach, maxDetach);
          const follow = reduced ? 1 : .17;
          shard.magnetX += (targetX - shard.magnetX) * follow; shard.magnetY += (targetY - shard.magnetY) * follow;
        } else {
          const settle = reduced ? 1 : .12;
          shard.magnetX += (0 - shard.magnetX) * settle; shard.magnetY += (0 - shard.magnetY) * settle;
        }
      } else if (!shard.featured) {
        const pull = .16, targetX = (pointer.x - sourceX) * influence * pull, targetY = (pointer.y - sourceY) * influence * pull;
        shard.magnetX += (targetX - shard.magnetX) * (influence ? .1 : .06); shard.magnetY += (targetY - shard.magnetY) * (influence ? .1 : .06);
      } else { shard.magnetX *= .88; shard.magnetY *= .88 }
      sourceX += shard.magnetX; sourceY += shard.magnetY;
      if (isDebris && shard.featured && shard.hover > .001 && !focusShard) {
        const awayX = sourceX - pointer.x, awayY = sourceY - pointer.y, length = Math.hypot(awayX, awayY) || 1, escape = 5.5 * shard.hover;
        const jitterX = (Math.sin(time * 8.4 + shard.phase) + Math.sin(time * 13.1 + shard.phase * .7) * .45) * 5.2 * shard.hover;
        const jitterY = (Math.cos(time * 9.7 + shard.phase * .8) + Math.sin(time * 11.3 + shard.phase) * .4) * 4.4 * shard.hover;
        sourceX += awayX / length * escape + jitterX; sourceY += awayY / length * escape + jitterY;
      }
      if (isDebris && selectedIndex >= 0 && !focusShard && focusProgress > .001) {
        const orbitAngle = time * (.16 + shard.depth * .07) + shard.phase, orbitRadiusX = width * (.14 + shard.depth * .07), orbitRadiusY = height * (.12 + shard.depth * .055), orbitMix = focusProgress * (.1 + shard.orbitWeight * .46);
        const targetX = width * .5 + Math.cos(orbitAngle) * orbitRadiusX, targetY = height * .48 + Math.sin(orbitAngle) * orbitRadiusY;
        sourceX = lerp(sourceX, targetX, orbitMix); sourceY = lerp(sourceY, targetY, orbitMix);
      }
      const selectEase = easeOutCubic(shard.select); if (focusShard) { sourceX = lerp(sourceX, width * .5, selectEase); sourceY = lerp(sourceY, height * .48, selectEase) }
      let angle = isDebris ? shard.rotation + Math.sin(time * .22 + shard.phase) * .28 : Math.sin(time * .18 + shard.phase) * .006;
      if (isDebris && selectedIndex >= 0 && !focusShard && focusProgress > .001 && shard.orbitWeight > .05) {
        const pointAngle = Math.atan2(height * .48 - sourceY, width * .5 - sourceX) + Math.PI * .5; angle = lerp(angle, pointAngle, focusProgress * shard.orbitWeight * .38);
      }
      if (focusShard) angle = lerp(angle, 0, selectEase) + Math.PI * 2 * selectEase;
      const letterLift = !isDebris ? clamp(Math.hypot(shard.magnetX, shard.magnetY) / 58, 0, 1) : 0;
      if (letterLift > .001) angle += (shard.magnetX / 76) * .035;
      const revealEase = easeOutCubic(shard.reveal), scale = isDebris ? (1 + shard.hover * .1 + shard.select * 2.35) : 1 + letterLift * .055;
      sourceY += (1 - revealEase) * (isDebris ? 10 : 5); shard.screenX = sourceX; shard.screenY = sourceY; shard.screenRadius = shard.baseSize * scale * 1.05;
      context.save(); context.globalAlpha = revealEase * (isDebris && !shard.featured ? .52 : 1); context.translate(sourceX, sourceY); context.rotate(angle); context.scale(scale * (.72 + revealEase * .28), scale * (.72 + revealEase * .28)); if (isDebris && !focusShard && focusProgress > .001) context.globalAlpha *= 1 - focusProgress * (.12 + shard.orbitWeight * .18);
      traceShard(shard); context.save(); context.shadowColor = focusShard ? 'rgba(32,49,139,.34)' : letterLift > .01 ? `rgba(32,49,139,${.12 + letterLift * .2})` : shard.featured ? 'rgba(32,49,139,.14)' : 'rgba(32,49,139,.08)'; context.shadowBlur = focusShard ? 22 : letterLift > .01 ? 4 + letterLift * 14 : shard.featured ? 6 : 2; context.shadowOffsetY = focusShard ? 9 : letterLift > .01 ? 2 + letterLift * 7 : shard.featured ? 3 : 1; context.fillStyle = shard.featured ? 'rgba(69,92,233,.18)' : shard.color; context.fill(); context.restore();
      if (isDebris && shard.featured) { traceShard(shard); context.save(); context.clip(); drawMemory(shard); context.restore(); traceShard(shard); context.fillStyle = `rgba(69,92,233,${.12 - shard.select * .07})`; context.fill() }
      traceShard(shard); context.strokeStyle = focusShard ? 'rgba(250,252,255,.98)' : 'rgba(236,245,255,.84)'; context.lineWidth = isDebris ? (focusShard ? 1.4 : 1) : .55; context.stroke();
      context.beginPath(); context.moveTo(...shard.points[0]); context.lineTo(...shard.points[1]); context.strokeStyle = focusShard ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.8)'; context.lineWidth = focusShard ? 1.8 : 1.15; context.stroke(); context.restore();
    };
    const build = () => {
      const bounds = (cv.parentElement ?? cv).getBoundingClientRect(); const nextWidth = Math.min(1920, Math.max(280, bounds.width)), nextHeight = Math.min(900, Math.max(360, bounds.height));
      if (Math.abs(nextWidth - width) < 1 && Math.abs(nextHeight - height) < 1) return; width = nextWidth; height = nextHeight; const maxRatio = width > 1200 ? 1.25 : 1.5, ratio = Math.min(devicePixelRatio || 1, maxRatio);
      cv.width = Math.round(width * ratio); cv.height = Math.round(height * ratio); context.setTransform(ratio, 0, 0, ratio, 0, 0); letter = []; debris = []; hoveredIndex = -1; selectedIndex = -1; selectionOpen = false;
      const mask = document.createElement('canvas'); mask.width = Math.round(width); mask.height = Math.round(height); const maskContext = mask.getContext('2d'); if (!maskContext) return;
      const fontSize = Math.min(height * .78, width * .38); maskContext.font = `800 ${fontSize}px Manrope, Arial, sans-serif`; maskContext.textAlign = 'center'; maskContext.textBaseline = 'middle'; maskContext.fillStyle = '#fff'; maskContext.fillText('D', width * .5, height * .49);
      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data, hit = (x: number, y: number) => { const px = x | 0, py = y | 0; return px >= 0 && px < mask.width && py >= 0 && py < mask.height && pixels[(py * mask.width + px) * 4 + 3] > 120 };
      const step = Math.max(32, Math.min(46, Math.min(width, height) / 17));
      for (let row = 0; row <= height / step; row++)for (let column = 0; column <= width / step; column++) {
        const left = column * step, top = row * step, right = left + step, bottom = top + step, cx = left + step * (.25 + Math.random() * .5), cy = top + step * (.25 + Math.random() * .5), corners: [[number, number], [number, number], [number, number], [number, number]] = [[left, top], [right, top], [right, bottom], [left, bottom]];
        for (let side = 0; side < 4; side++) { const [ax, ay] = corners[side], [bx, by] = corners[(side + 1) % 4], centerX = (ax + bx + cx) / 3, centerY = (ay + by + cy) / 3; if (!hit(centerX, centerY)) continue; letter.push({ x: centerX, y: centerY, points: [[ax - centerX, ay - centerY], [bx - centerX, by - centerY], [cx - centerX, cy - centerY]], phase: Math.random() * Math.PI * 2, speed: .2 + Math.random() * .24, depth: Math.random(), rotation: 0, magnetX: 0, magnetY: 0, color: `hsla(${202 + Math.random() * 28},${68 + Math.random() * 22}%,${55 + Math.random() * 24}%,${.48 + Math.random() * .34})`, featured: false, imageIndex: -1, baseSize: step, hover: 0, select: 0, screenX: centerX, screenY: centerY, screenRadius: step, orbitWeight: 0, reveal: reduced ? 1 : 0, revealDelay: .04 }); }
      }
      const targetZones = [
        [.18, .19], [.27, .31], [.79, .20], [.86, .35], [.17, .72], [.81, .74],
      ] as const;
      const reflectionCount = memoryImages.length, totalDebris = 22;
      for (let index = 0; index < totalDebris; index++) {
        const featuredShard = index < reflectionCount;
        let x: number, y: number;
        if (featuredShard) {
          const [zoneX, zoneY] = targetZones[index]; x = width * zoneX + (Math.random() - .5) * width * .025; y = height * zoneY + (Math.random() - .5) * height * .035;
        } else {
          const zone = targetZones[Math.floor(Math.random() * targetZones.length)];
          if (Math.random() < .72) { x = width * zone[0] + (Math.random() - .5) * width * .19; y = height * zone[1] + (Math.random() - .5) * height * .22 }
          else { x = width * (.06 + Math.random() * .88); y = height * (.08 + Math.random() * .82) }
          const centerDistance = Math.pow((x - width * .5) / (width * .19), 2) + Math.pow((y - height * .49) / (height * .35), 2);
          if (centerDistance < 1.05) { const direction = x < width * .5 ? -1 : 1; x += direction * width * (.13 + Math.random() * .08) }
          x = clamp(x, width * .035, width * .965); y = clamp(y, height * .055, height * .94);
        }
        const size = featuredShard ? clamp(Math.min(width, height) * (.07 + Math.random() * .016), 50, 74) : 6 + Math.random() * 11;
        const pointsCount = featuredShard ? 5 + Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 4), points: [number, number][] = [];
        for (let point = 0; point < pointsCount; point++) { const pointAngle = point / pointsCount * Math.PI * 2 + (Math.random() - .5) * (featuredShard ? .34 : .55), pointRadius = size * (featuredShard ? .68 + Math.random() * .48 : .5 + Math.random() * .72); points.push([Math.cos(pointAngle) * pointRadius, Math.sin(pointAngle) * pointRadius]) }
        const revealDelay = featuredShard ? .48 + index * .15 : 1.38 + (index - reflectionCount) * .07;
        debris.push({ x, y, points, phase: Math.random() * Math.PI * 2, speed: featuredShard ? .13 + Math.random() * .14 : .12 + Math.random() * .22, depth: Math.random(), rotation: Math.random() * Math.PI * 2, magnetX: 0, magnetY: 0, color: `hsla(${196 + Math.random() * 42},78%,${57 + Math.random() * 20}%,${.24 + Math.random() * .26})`, featured: featuredShard, imageIndex: featuredShard ? index : -1, baseSize: size, hover: 0, select: 0, screenX: x, screenY: y, screenRadius: size, orbitWeight: 0, reveal: reduced ? 1 : 0, revealDelay });
      }
      finalRevealDelay = debris.reduce((latest, shard) => Math.max(latest, shard.revealDelay), 0);
    };
    const findFeatured = (x: number, y: number) => { let hitIndex = -1, best = Infinity; debris.forEach((shard, index) => { if (!shard.featured || shard.reveal < .72) return; const distance = Math.hypot(x - shard.screenX, y - shard.screenY), radius = Math.max(28, shard.screenRadius * 1.18); if (distance < radius && distance < best) { best = distance; hitIndex = index } }); return hitIndex };
    const inLetterHotZone = (shard: GlassShard) => shard.x >= width * letterHotZone.minX && shard.x <= width * letterHotZone.maxX && shard.y >= height * letterHotZone.minY && shard.y <= height * letterHotZone.maxY;
    const hasLetterMagnet = (x: number, y: number) => !selectionOpen && hoveredIndex < 0 && letter.some(shard => shard.reveal > .86 && inLetterHotZone(shard) && Math.hypot(x - shard.x, y - shard.y) < letterMagnetRange);
    const selectShard = (index: number) => { const focus = debris[index]; if (!focus) return; selectedIndex = index; selectionOpen = true; hoveredIndex = -1; const range = Math.max(220, Math.min(width, height) * .72); debris.forEach((shard, shardIndex) => { shard.orbitWeight = shardIndex === index ? 0 : clamp(1 - Math.hypot(shard.x - focus.x, shard.y - focus.y) / range, 0, 1) }) };
    const render = (milliseconds = performance.now()) => {
      if (!reduced && milliseconds - lastFrameAt < 1000 / 50) { frame = requestAnimationFrame(render); return; }
      lastFrameAt = milliseconds;
      const time = milliseconds * .001; if (entranceStartedAt < 0) entranceStartedAt = time; const entranceElapsed = time - entranceStartedAt;
      letter.forEach(shard => { const target = reduced || entranceElapsed >= shard.revealDelay ? 1 : 0; shard.reveal += (target - shard.reveal) * (reduced ? 1 : .14) });
      debris.forEach((shard, index) => { const revealTarget = reduced || entranceElapsed >= shard.revealDelay ? 1 : 0, hoverTarget = !selectionOpen && index === hoveredIndex && shard.featured ? 1 : 0, selectTarget = selectionOpen && index === selectedIndex ? 1 : 0; shard.reveal += (revealTarget - shard.reveal) * (reduced ? 1 : shard.featured ? .16 : .14); shard.hover += (hoverTarget - shard.hover) * (reduced ? 1 : .18); shard.select += (selectTarget - shard.select) * (reduced ? 1 : .075) });
      if (!entranceCompleteSent && (reduced || entranceElapsed >= finalRevealDelay + .48)) { entranceCompleteSent = true; onEntranceComplete(); }
      if (!selectionOpen && selectedIndex >= 0 && (debris[selectedIndex]?.select ?? 0) < .012) selectedIndex = -1;
      context.clearRect(0, 0, width, height); letter.forEach(shard => drawShard(shard, time)); debris.forEach((shard, index) => { if (index !== selectedIndex) drawShard(shard, time, true) }); if (selectedIndex >= 0 && debris[selectedIndex]) drawShard(debris[selectedIndex], time, true); if (!reduced && !document.hidden) frame = requestAnimationFrame(render);
    };
    const pointToCanvas = (point: PointerEvent) => { const bounds = cv.getBoundingClientRect(); pointer.x = (point.clientX - bounds.left) * (width / Math.max(bounds.width, 1)); pointer.y = (point.clientY - bounds.top) * (height / Math.max(bounds.height, 1)); pointer.active = true };
    const surface = cv.closest('.hero') ?? cv;
    const move = (event: Event) => { pointToCanvas(event as PointerEvent); hoveredIndex = selectionOpen ? -1 : findFeatured(pointer.x, pointer.y); const letterMagnetActive = hasLetterMagnet(pointer.x, pointer.y); cv.style.cursor = hoveredIndex >= 0 ? 'pointer' : letterMagnetActive ? 'grab' : selectionOpen ? 'zoom-out' : 'default'; if (reduced) render() };
    const leave = () => { pointer.active = false; hoveredIndex = -1; cv.style.cursor = selectionOpen ? 'zoom-out' : 'default'; if (reduced) render() };
    const down = (event: PointerEvent) => { if (!selectionOpen && event.target !== cv) return; pointToCanvas(event); const hitIndex = findFeatured(pointer.x, pointer.y); if (hitIndex >= 0) { if (!(selectionOpen && hitIndex === selectedIndex)) selectShard(hitIndex) } else if (selectionOpen) { selectionOpen = false; hoveredIndex = -1 } if (reduced) render() };
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape' && selectionOpen) { selectionOpen = false; hoveredIndex = -1; if (reduced) render() } };
    build(); memoryImages.forEach((img, index) => { img.decoding = 'async'; img.onload = () => { if (reduced) render() }; img.src = imageUrls[index] }); render(performance.now());
    const visibility = () => { if (!document.hidden && !reduced) { cancelAnimationFrame(frame); frame = requestAnimationFrame(render) } };
    const observer = new ResizeObserver(() => { build(); if (reduced) render() }); observer.observe(cv.parentElement ?? cv); surface.addEventListener('pointermove', move); surface.addEventListener('pointerleave', leave); document.addEventListener('pointerdown', down); document.addEventListener('visibilitychange', visibility); window.addEventListener('keydown', keydown);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave); document.removeEventListener('pointerdown', down); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('keydown', keydown) };
  }, [active, onEntranceComplete]);
  return <canvas className="glass-debris-d" ref={canvas} role="img" aria-label="An interactive glass letter D with floating memory shards" />;
}
function RoleGlyph({ role }: { role: string }) {
  return <span className="motion-glyph" aria-hidden="true" key={role}>
    {role === 'Frontend' ? <svg viewBox="0 0 64 64"><rect x="8" y="11" width="48" height="35" rx="4" /><path d="M8 20h48M24 54h16M32 46v8M25 27l-7 6 7 6M39 27l7 6-7 6" /><circle cx="14" cy="15.5" r="1" /></svg> : <svg viewBox="0 0 64 64"><ellipse cx="32" cy="14" rx="21" ry="8" /><path d="M11 14v14c0 4.4 9.4 8 21 8s21-3.6 21-8V14M11 28v14c0 4.4 9.4 8 21 8s21-3.6 21-8V28" /><circle cx="45" cy="26" r="1.5" /><circle cx="45" cy="40" r="1.5" /></svg>}
  </span>
}
function SplitFlapRole() {
  const roles = ['Frontend', 'Backend'];
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive(value => (value + 1) % roles.length), 2800); return () => window.clearInterval(timer) }, []);
  return <><RoleGlyph role={roles[active]} /><div className="split-flap" aria-live="polite" aria-label={`${roles[active]} Developer`}>
    <span className="split-flap__word-window"><span className="split-flap__word" key={active}>{roles[active]}</span></span>
    <span className="split-flap__suffix">Developer</span>
  </div></>
}
function HeroMarquee() {
  const loop = useRef<HTMLSpanElement>(null); const firstItem = useRef<HTMLSpanElement>(null);
  useGSAP(() => { if (!loop.current || !firstItem.current) return; const distance = firstItem.current.getBoundingClientRect().width; const tween = gsap.to(loop.current, { x: -distance, duration: distance / 45, ease: 'none', repeat: -1 }); const container = loop.current.parentElement; const pause = () => tween.pause(); const play = () => tween.play(); container?.addEventListener('mouseenter', pause); container?.addEventListener('mouseleave', play); container?.addEventListener('focusin', pause); container?.addEventListener('focusout', play); return () => { tween.kill(); container?.removeEventListener('mouseenter', pause); container?.removeEventListener('mouseleave', play); container?.removeEventListener('focusin', pause); container?.removeEventListener('focusout', play) } }, { scope: loop });
  return <h1 className="hero__name-track" id="hero-title" data-hero-marquee><span className="hero__name-loop" ref={loop}><span className="hero__name-item" ref={firstItem}><span>Domince</span> <em>Aseberos</em> <i>✦</i></span><span className="hero__name-item" aria-hidden="true"><span>Domince</span> <em>Aseberos</em> <i>✦</i></span><span className="hero__name-item" aria-hidden="true"><span>Domince</span> <em>Aseberos</em> <i>✦</i></span><span className="hero__name-item" aria-hidden="true"><span>Domince</span> <em>Aseberos</em> <i>✦</i></span></span></h1>
}

function ServiceIcon({ type }: { type: string }) {
  switch (type) {
    case 'mobile':
      return <svg className="service-icon service-icon--mobile" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line className="widget-1" x1="8" y1="6" x2="16" y2="6"></line>
        <rect className="widget-2" x="8" y="9" width="8" height="4" rx="1"></rect>
        <line className="widget-3" x1="8" y1="16" x2="16" y2="16"></line>
      </svg>;
    case 'web':
      return <svg className="service-icon service-icon--web" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <line x1="2" y1="8" x2="22" y2="8"></line>
        <circle cx="5" cy="6" r="0.5" fill="currentColor"></circle>
        <circle cx="7" cy="6" r="0.5" fill="currentColor"></circle>
        <rect className="web-btn" x="14" y="12" width="4" height="4" rx="1"></rect>
        <path className="web-cursor" d="M10 10l4 8-1.5-3.5L9 16z" fill="currentColor"></path>
      </svg>;
    case 'seo':
      return <svg className="service-icon service-icon--seo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="4" y1="20" x2="20" y2="20"></line>
        <rect className="chart-bar-1" x="6" y="14" width="3" height="6"></rect>
        <rect className="chart-bar-2" x="11" y="10" width="3" height="10"></rect>
        <rect className="chart-bar-3" x="16" y="6" width="3" height="14"></rect>
        <g className="seo-lens">
          <circle cx="10" cy="10" r="4"></circle>
          <line x1="12.8" y1="12.8" x2="16" y2="16"></line>
        </g>
      </svg>;
    case 'ai':
      return <svg className="service-icon service-icon--ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path className="ai-core" d="M12 8l4 4-4 4-4-4z"></path>
        <circle className="ai-node-1" cx="12" cy="3" r="1.5"></circle>
        <circle className="ai-node-2" cx="21" cy="12" r="1.5"></circle>
        <circle className="ai-node-3" cx="12" cy="21" r="1.5"></circle>
        <circle className="ai-node-4" cx="3" cy="12" r="1.5"></circle>
        <line className="ai-pulse-1" x1="12" y1="4.5" x2="12" y2="8"></line>
        <line className="ai-pulse-2" x1="19.5" y1="12" x2="16" y2="12"></line>
        <line className="ai-pulse-3" x1="12" y1="19.5" x2="12" y2="16"></line>
        <line className="ai-pulse-4" x1="4.5" y1="12" x2="8" y2="12"></line>
      </svg>;
    case 'cms':
      return <svg className="service-icon service-icon--cms" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="14" width="16" height="8" rx="1"></rect>
        <rect x="4" y="2" width="16" height="8" rx="1"></rect>
        <line className="cms-data-1" x1="8" y1="5" x2="16" y2="5"></line>
        <line className="cms-data-2" x1="8" y1="7" x2="12" y2="7"></line>
        <line className="cms-data-3" x1="8" y1="17" x2="14" y2="17"></line>
        <path className="cms-arrow" d="M12 10v4M10 12l2 2 2-2"></path>
      </svg>;
    case 'design':
      return <svg className="service-icon service-icon--design" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path className="design-curve" d="M4 16C6 8 14 6 20 13" pathLength="1"></path>
        <g className="design-pen">
          <path d="M0 0l3-3 7 7v3h-3l-7-7z"></path>
          <line x1="5" y1="-2" x2="3" y2="0"></line>
        </g>
        <circle className="design-point-1" cx="4" cy="16" r="1.5"></circle>
        <circle className="design-point-2" cx="20" cy="13" r="1.5"></circle>
      </svg>;
    default:
      return <svg className="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle></svg>;
  }
}

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null); const workGrid = useRef<HTMLDivElement>(null); const [loaded, setLoaded] = useState(false); const [heroCanvasReady, setHeroCanvasReady] = useState(false); const [visibleProjectCount, setVisibleProjectCount] = useState(() => Math.min(featured.length, 6)); const finishLoading = useCallback(() => setLoaded(true), []); const finishHeroCanvas = useCallback(() => setHeroCanvasReady(true), []);
  useEffect(() => {
    const grid = workGrid.current; if (!grid) return;
    let frame = 0;
    const updateVisibleProjects = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const template = getComputedStyle(grid).gridTemplateColumns;
        const columns = template === 'none' ? 1 : Math.max(1, template.split(' ').filter(Boolean).length);
        setVisibleProjectCount(Math.min(featured.length, columns * 2));
      });
    };
    updateVisibleProjects();
    const observer = new ResizeObserver(updateVisibleProjects); observer.observe(grid);
    return () => { cancelAnimationFrame(frame); observer.disconnect() };
  }, []);
  const visibleFeatured = featured.slice(0, visibleProjectCount);
  useGSAP(() => {
    if (!root.current) return;
    const location = root.current.querySelector<HTMLElement>('[data-hero-location]');
    const role = root.current.querySelector<HTMLElement>('[data-hero-role]');
    const marquee = root.current.querySelector<HTMLElement>('[data-hero-marquee]');
    const locationChildren = location ? Array.from(location.children) : [];
    const roleChildren = role ? Array.from(role.children) : [];
    if (!location || !role || !marquee) return;

    if (!loaded || !heroCanvasReady) {
      gsap.set([location, role], { autoAlpha: 0 });
      gsap.set([...locationChildren, ...roleChildren], { autoAlpha: 0, y: 10 });
      gsap.set(marquee, { autoAlpha: 0, yPercent: 105 });
      return;
    }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set([location, role, ...locationChildren, ...roleChildren, marquee], { autoAlpha: 1, clearProps: 'transform' });
      return;
    }

    const intro = gsap.timeline();
    intro
      .to(location, { autoAlpha: 1, duration: .22, ease: 'power2.out' })
      .to(locationChildren, { autoAlpha: 1, y: 0, duration: .38, stagger: .08, ease: 'power3.out' }, '<.03')
      .to(role, { autoAlpha: 1, duration: .18, ease: 'power2.out' }, '>.12')
      .to(roleChildren, { autoAlpha: 1, y: 0, duration: .42, stagger: .1, ease: 'power3.out' }, '<.02')
      .to(marquee, { autoAlpha: 1, yPercent: 0, duration: .9, ease: 'power4.out' }, '>.12');
  }, { scope: root, dependencies: [loaded, heroCanvasReady] });

  useGSAP(() => {
    if (!root.current || !loaded) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    if (!reduced) {
      gsap.to('.hero__portrait', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__name-window', { yPercent: -72, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } });
      gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current).forEach(element => gsap.from(element, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%' } }));
      gsap.fromTo('.gallery-row--one', { xPercent: 0 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'center bottom', end: 'center top', scrub: true } });
      gsap.fromTo('.gallery-row--two', { xPercent: 0 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'center bottom', end: 'center top', scrub: true } });
    }

    return () => { if (lenis && raf) { gsap.ticker.remove(raf); lenis.destroy() } }
  }, { scope: root, dependencies: [loaded] });

  const navigateWithBlob = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const href = target.href;
    const wrapper = target.closest('.intro__link-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.zIndex = '9999';
    }

    target.style.animation = 'none';
    target.style.transition = 'none';

    sessionStorage.setItem('transition_from_blob', 'true');

    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = href;
      }
    });

    tl.to(['.round-link__label', '.round-link__arrow', '.blobs'], {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out'
    })
      .to(target, {
        scale: 60,
        duration: 0.85,
        ease: 'power3.inOut'
      }, 0);
  };

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        gsap.set(['.round-link__label', '.round-link__arrow', '.blobs'], { clearProps: 'all' });
        gsap.set('.round-link', { clearProps: 'all' });

        const target = document.querySelector('.round-link') as HTMLElement;
        if (target) {
          target.style.animation = '';
          target.style.transition = '';
        }

        const wrapper = document.querySelector('.intro__link-wrapper') as HTMLElement;
        if (wrapper) {
          wrapper.style.zIndex = '';
        }
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return <div className="home" ref={root}>
    {!loaded && <PolygonPreloader onComplete={finishLoading} />}
    <GlobalHeader />
    <main>
      <section className="hero" aria-labelledby="hero-title"><div className="hero__location" data-hero-location><span className="hero__location-index">08° N · 125° E</span><strong>Based in<br />Davao, Philippines</strong><div className="hero__globe"><AnimatedGlobe /></div></div><div className="hero__portrait"><GlassDebrisD active={loaded} onEntranceComplete={finishHeroCanvas} /></div><div className="hero__role" data-hero-role><SplitFlapRole /></div><div className="hero__name-window"><HeroMarquee /></div></section>
      <section className="intro section-shell"><h2 data-reveal>I build digital experiences where systems, story, and interaction move as one.</h2><div data-reveal><p>{landingJson.hero.bio}</p></div><div data-reveal className="intro__link-wrapper"><div className="blobs" aria-hidden="true"><div className="blob blob--1" /><div className="blob blob--2" /><div className="blob blob--3" /><div className="blob blob--4" /><div className="blob blob--5" /><div className="blob blob--6" /><div className="blob blob--7" /><div className="blob blob--8" /></div><a className="round-link" href="/about" onClick={navigateWithBlob}><span className="round-link__label">Discover<br />my story</span><span className="round-link__arrow">↗</span></a></div></section>
      <section className="work section-shell" aria-labelledby="work-title"><div className="section-heading" data-reveal><span className="eyebrow">Selected work</span><h2 id="work-title">Built with intent.</h2></div><div className="work-grid" ref={workGrid}>{visibleFeatured.map((project, index) => <a className="project-card" href={`/projects/${project.id}`} key={project.id} data-reveal><div className={`project-card__media project-card__media--${index + 1}`}><img src={project.mainImage} alt={`${project.title} project preview`} loading="lazy" /><b>{String(index + 1).padStart(2, '0')}</b></div><h3>{project.title}</h3><div><span>{project.projectType}</span><time>{project.dateCreated?.slice(0, 4)}</time></div></a>)}</div><a className="pill-link" href="/projects">View all projects <span>↗</span></a></section>
      <section className="gallery" aria-label="Services Offered">{[0, 1].map(row => <div className={`gallery-row gallery-row--${row ? 'two' : 'one'}`} key={row}>{services.slice(row * 3, row * 3 + 3).map((service, index) => <div className={`gallery-placeholder gallery-placeholder--${row}-${index}`} key={service.title}><ServiceIcon type={service.viz} /><span>{service.title}</span><p>{service.desc}</p></div>)}</div>)}</section>
    </main>
    <GlobalFooter />
  </div>
}
