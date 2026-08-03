import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import * as opentype from 'opentype.js';
import gsap from 'gsap';

const fontPromises = {};

function getFont(url) {
    if (!fontPromises[url]) {
        fontPromises[url] = fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => opentype.parse(buffer));
    }
    return fontPromises[url];
}

/**
 * AnimatedHandwritingText
 *
 * Props:
 *   sharedTimeline  — a gsap.timeline() instance from the parent. If provided,
 *                     tweens are added to it at `timelinePosition` instead of a
 *                     standalone timeline with a delay.
 *   timelinePosition — where on the shared timeline to insert this animation (seconds)
 *   delay            — used only when sharedTimeline is NOT provided
 */
export default function AnimatedHandwritingText({ 
    text, 
    fontUrl, 
    className, 
    strokeWidth = 2, 
    strokeColor = 'currentColor',
    fillColor = 'transparent',
    duration = 2,
    delay = 0,
    sharedTimeline = null,
    timelinePosition = 0,
}) {
    const [pathData, setPathData] = useState(null);
    const [viewBox, setViewBox] = useState('0 0 1000 200');
    const svgRef  = useRef(null);
    const tlRef   = useRef(null);
    const lenRef  = useRef(0);

    // ── Fetch & parse font ─────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;
        getFont(fontUrl)
            .then(font => {
                if (!isMounted) return;
                try {
                    const fontSize = 100;
                    const path = font.getPath(text, 0, fontSize, fontSize);
                    const bbox = path.getBoundingBox();
                    const pad  = 10;
                    const w    = bbox.x2 - bbox.x1 + pad * 2;
                    const h    = bbox.y2 - bbox.y1 + pad * 2;
                    setViewBox(`${bbox.x1 - pad} ${bbox.y1 - pad} ${w} ${h}`);
                    setPathData(path.toPathData(2));
                } catch (err) {
                    console.error('AnimatedHandwritingText: parse error', err);
                }
            })
            .catch(err => console.error('AnimatedHandwritingText: fetch error', err));
        return () => { isMounted = false; };
    }, [text, fontUrl]);

    // ── Set hidden initial state BEFORE browser paints ────────────────
    useLayoutEffect(() => {
        if (!pathData || !svgRef.current) return;
        const pathEl = svgRef.current.querySelector('path');
        if (!pathEl) return;
        const len = pathEl.getTotalLength();
        if (len <= 0) return;
        lenRef.current = len;
        // Inline styles override SVG presentation attributes and survive React re-renders
        pathEl.style.fill             = fillColor;
        pathEl.style.stroke           = 'transparent';
        pathEl.style.strokeDasharray  = String(len);
        pathEl.style.strokeDashoffset = String(len);
    }, [pathData, fillColor]);

    // ── Add GSAP tween to shared or standalone timeline ───────────────
    useEffect(() => {
        if (!pathData || !svgRef.current) return;
        const pathEl = svgRef.current.querySelector('path');
        if (!pathEl) return;
        const len = lenRef.current;
        if (len <= 0) return;

        // Kill any previous standalone tween
        tlRef.current?.kill();

        // Use the shared timeline if the parent provided one,
        // otherwise fall back to a standalone timeline with a delay.
        const tl  = sharedTimeline ?? gsap.timeline({ delay });
        const pos = sharedTimeline ? timelinePosition : 0;

        // Store reference only for standalone timelines (shared ones are owned by parent)
        if (!sharedTimeline) tlRef.current = tl;

        // Instantly reveal stroke colour at the start position, then draw
        tl.set(pathEl, { stroke: strokeColor }, pos);
        tl.fromTo(
            pathEl,
            { strokeDashoffset: len },   // explicit from — zero timing ambiguity
            { strokeDashoffset: 0, duration, ease: 'power2.inOut' },
            pos
        );

        return () => {
            // Only kill standalone timelines; shared ones are managed by the parent
            if (!sharedTimeline) {
                tlRef.current?.kill();
                tlRef.current = null;
            }
        };
    }, [pathData, sharedTimeline, timelinePosition, delay, duration, strokeColor]);

    if (!pathData) {
        return (
            <span
                className={className}
                style={{ opacity: 0, display: 'block', height: '1em', minWidth: '1em' }}
            />
        );
    }

    return (
        <svg
            ref={svgRef}
            viewBox={viewBox}
            className={className}
            aria-label={text}
            preserveAspectRatio="xMidYMid meet"
            style={{ height: '1em', width: 'auto', display: 'block', overflow: 'visible', margin: '0' }}
        >
            <path
                d={pathData}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={fillColor}
                stroke="transparent"
            />
        </svg>
    );
}
