import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Motion-graphic mini-visuals for each service ────────────────────────────

const MobileViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 64 100" width="44" height="68" aria-hidden="true">
        {/* Phone mockup */}
        <g className="ns-svc-mobile-phone">
            <rect x="2" y="2" width="60" height="96" rx="12" fill="none" stroke="currentColor" strokeWidth="3" />
            <line x1="24" y1="91" x2="40" y2="91" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Animated screen */}
        <g className="ns-svc-mobile-screen">
            <rect x="12" y="16" width="40" height="7" rx="3.5" fill="currentColor" opacity="0.9" />
            <rect className="ns-svc-bar" x="12" y="29" width="30" height="7" rx="3.5" fill="currentColor" opacity="0.75" />
            <rect className="ns-svc-bar ns-svc-bar2" x="12" y="42" width="22" height="7" rx="3.5" fill="currentColor" opacity="0.6" />
            <rect className="ns-svc-bar ns-svc-bar3" x="12" y="55" width="34" height="7" rx="3.5" fill="currentColor" opacity="0.5" />
        </g>
        {/* Signal waves */}
        <g className="ns-svc-signal" style={{ transformOrigin: '32px 76px' }}>
            <circle cx="32" cy="76" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="32" cy="76" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
        </g>
    </svg>
);

const WebViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 84 70" width="60" height="50" aria-hidden="true">
        <rect x="1" y="1" width="82" height="68" rx="7" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="1" y1="18" x2="83" y2="18" stroke="currentColor" strokeWidth="3" />
        <circle cx="12" cy="9.5" r="3.5" fill="currentColor" opacity="0.9" />
        <circle cx="24" cy="9.5" r="3.5" fill="currentColor" opacity="0.6" />
        <circle cx="36" cy="9.5" r="3.5" fill="currentColor" opacity="0.4" />
        <rect className="ns-svc-line" x="10" y="28" width="52" height="5" rx="2.5" fill="currentColor" opacity="0.7" />
        <rect className="ns-svc-line ns-svc-line2" x="18" y="40" width="40" height="5" rx="2.5" fill="currentColor" opacity="0.5" />
        <rect className="ns-svc-line ns-svc-line3" x="10" y="52" width="58" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
        <rect className="ns-svc-cursor" x="62" y="52" width="4" height="8" rx="1" fill="currentColor" />
    </svg>
);

const SeoViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 84 76" width="58" height="52" aria-hidden="true">
        <g className="ns-svc-sweep" style={{ transformOrigin: '38px 40px' }}>
            <circle cx="38" cy="40" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
            <line x1="50" y1="52" x2="62" y2="64" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="ns-svc-trend">
            <polyline points="12,58 30,46 44,50 58,36" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            <circle className="ns-svc-dot" cx="58" cy="36" r="4" fill="currentColor" />
        </g>
    </svg>
);

const AiViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 80 80" width="54" height="54" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="2.5" opacity="0.6">
            <line x1="40" y1="18" x2="18" y2="52" />
            <line x1="40" y1="18" x2="62" y2="52" />
            <line x1="18" y1="52" x2="62" y2="52" />
        </g>
        <circle className="ns-svc-node ns-svc-node1" cx="40" cy="18" r="7" fill="currentColor" />
        <circle className="ns-svc-node ns-svc-node2" cx="18" cy="52" r="7" fill="currentColor" />
        <circle className="ns-svc-node ns-svc-node3" cx="62" cy="52" r="7" fill="currentColor" />
        <circle className="ns-svc-orbit" cx="40" cy="52" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
);

const CmsViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 80 64" width="58" height="46" aria-hidden="true">
        <g>
            <rect className="ns-svc-block ns-svc-block1" x="6" y="10" width="52" height="12" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect className="ns-svc-block ns-svc-block2" x="14" y="26" width="46" height="12" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect className="ns-svc-block ns-svc-block3" x="6" y="42" width="52" height="12" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <g className="ns-svc-gear" style={{ transformOrigin: '68px 38px' }}>
                <circle cx="68" cy="38" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M68 23 v6 M68 47 v6 M53 38 h6 M77 38 h6 M57 27 l4 4 M79 49 l-4 -4 M79 27 l-4 4 M57 49 l4 -4"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </g>
        </g>
    </svg>
);

const DesignViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 84 70" width="60" height="50" aria-hidden="true">
        {/* UI frame */}
        <rect x="3" y="6" width="52" height="52" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="3" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="3" />
        <circle className="ns-svc-layout ns-svc-layout1" cx="12" cy="13" r="3" fill="currentColor" />
        <rect className="ns-svc-layout ns-svc-layout2" x="8" y="26" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect className="ns-svc-layout ns-svc-layout3" x="28" y="26" width="20" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect className="ns-svc-layout ns-svc-layout4" x="28" y="38" width="20" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
        {/* Pen */}
        <g className="ns-svc-pen" style={{ transformOrigin: '66px 40px' }}>
            <rect x="60" y="30" width="4" height="26" rx="2" fill="currentColor" />
            <polygon points="58,56 66,56 62,64" fill="currentColor" />
        </g>
    </svg>
);

const ApiViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 84 70" width="60" height="50" aria-hidden="true">
        {/* Connection */}
        <line x1="20" y1="35" x2="68" y2="35" stroke="currentColor" strokeWidth="3" opacity="0.5" />
        {/* Client */}
        <rect x="2" y="20" width="26" height="30" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="15" cy="31" r="3" fill="currentColor" />
        <rect className="ns-svc-node-pulse" x="8" y="38" width="14" height="4" rx="2" fill="currentColor" opacity="0.7" />
        {/* Server */}
        <rect x="62" y="14" width="20" height="42" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="66" y1="24" x2="78" y2="24" stroke="currentColor" strokeWidth="3" />
        <line x1="66" y1="34" x2="78" y2="34" stroke="currentColor" strokeWidth="3" />
        <line x1="66" y1="44" x2="78" y2="44" stroke="currentColor" strokeWidth="3" />
        {/* Data packet */}
        <circle className="ns-svc-packet" cx="20" cy="35" r="5" fill="currentColor" />
    </svg>
);

const ShopViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 84 70" width="60" height="50" aria-hidden="true">
        {/* Bag/cart */}
        <path d="M28 30 h30 v28 a6 6 0 0 1 -6 6 h-18 a6 6 0 0 1 -6 -6 z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M34 30 v-8 a8 8 0 0 1 16 0 v8" fill="none" stroke="currentColor" strokeWidth="3" />
        {/* Falling item */}
        <rect className="ns-svc-item" x="40" y="10" width="10" height="10" rx="2" fill="currentColor" />
        {/* Price tag */}
        <g className="ns-svc-tag" style={{ transformOrigin: '74px 20px' }}>
            <polygon points="70,12 78,12 82,20 78,28 70,28 66,20" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </g>
    </svg>
);

const CloudViz = () => (
    <svg className="ns-svc-viz-svg" viewBox="0 0 84 70" width="60" height="50" aria-hidden="true">
        {/* Upload arrow */}
        <g className="ns-svc-upload" style={{ transformOrigin: '28px 20px' }}>
            <line x1="28" y1="30" x2="28" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="20" x2="28" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="36" y1="20" x2="28" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Cloud */}
        <path className="ns-svc-cloudpuf" d="M22 56 h40 a10 10 0 0 0 0 -20 a13 13 0 0 0 -25 -2 a11 11 0 0 0 -15 8 a9 9 0 0 0 0 14 z"
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        {/* Orbiting dot */}
        <circle className="ns-svc-orbit2" cx="20" cy="34" r="3.5" fill="currentColor" />
    </svg>
);

const VIZ_MAP = {
    mobile: MobileViz,
    web: WebViz,
    seo: SeoViz,
    ai: AiViz,
    cms: CmsViz,
    design: DesignViz,
    api: ApiViz,
    shop: ShopViz,
    cloud: CloudViz,
};

// ── Sticky-note tilt presets & palette ──────────────────────────────────────
const TILTS = [-3, 2, -2, 3, -1.5, 2.5, -2.5, 1.5, -1];
const HUE = ['#f6e58d', '#ffbe76', '#f8c291', '#c7ecee', '#eadcf5', '#d1f2eb', '#b8e6c8', '#ffd6e0', '#fff0ca'];

export default function ServicesSection({ services = [] }) {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || services.length === 0) return;

        const cards = root.querySelectorAll('.ns-service-note');
        gsap.set(cards, { opacity: 0, scale: 0.7, y: 24 });

        const ctx = gsap.context(() => {
            ScrollTrigger.batch(cards, {
                start: 'top 88%',
                onEnter: (batch) =>
                    gsap.to(batch, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'back.out(1.8)',
                        stagger: 0.12,
                    }),
            });
        }, root);

        return () => ctx.revert();
    }, [services.length]);

    if (!services || services.length === 0) return null;

    return (
        <section className="ns-section" id="services" style={{ overflowX: 'clip' }}>
            <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>What I Do</p>
            <h2 className="ns-section-heading ns-reveal">Services I Offer</h2>

            <div ref={rootRef} className="ns-services-wall">
                {services.map((svc, idx) => {
                    const Viz = VIZ_MAP[svc.viz] || MobileViz;
                    return (
                        <div key={svc.title} className="ns-service-note" style={{ '--tilt': `${TILTS[idx % TILTS.length]}deg` }}>
                            <div className="ns-service-note-inner" style={{ background: HUE[idx % HUE.length] }}>
                                <div className="ns-svc-tape" style={{ '--tape-rot': `${(TILTS[idx % TILTS.length] * -1) - 6}deg` }} />
                                <div className="ns-svc-viz">
                                    <Viz />
                                </div>
                                <h3 className="ns-svc-title">{svc.title}</h3>
                                <p className="ns-svc-desc">{svc.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
