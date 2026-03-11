import React, { useEffect, useState, useRef, useCallback } from 'react';
import './ProjectSection.css';
import LabsSection from './LabsSection';

const projects = [
    { title: "Luminary OS", desc: "A next-gen design operating system for distributed creative teams. Built on real-time collaboration primitives with offline-first sync.", status: "live", tech: ["React", "WebRTC", "CRDT", "Electron"], emoji: ["🌟", "💡", "✨"], colors: [["#0d1b2a", "#16213e"], ["#162130", "#1e2a40"], ["#0a1520", "#12203a"]] },
    { title: "Vanta Protocol", desc: "Zero-knowledge authentication layer for web3 apps. Eliminates seed phrase UX while maintaining full self-custody.", status: "wip", tech: ["Rust", "zkSNARK", "TypeScript", "Solidity"], emoji: ["🔐", "⛓️", "🛡️"], colors: [["#1a0a0a", "#2a1010"], ["#200a0a", "#301515"], ["#150808", "#220e0e"]] },
    { title: "Atlas Dashboard", desc: "Multi-tenant SaaS analytics platform handling 50M+ events/day. Features custom query builder and AI-powered insights.", status: "live", tech: ["Vue", "ClickHouse", "Python", "Redis"], emoji: ["📊", "📈", "🗺️"], colors: [["#0a1a0a", "#0a2a10"], ["#0d1f0d", "#122515"], ["#081508", "#0a1e0d"]] },
    { title: "Resonance", desc: "AI-native music production tool that learns your style and generates stems, progressions, and arrangements in real-time.", status: "wip", tech: ["Python", "PyTorch", "WebAudio", "WASM"], emoji: ["🎵", "🎛️", "🎚️"], colors: [["#1a0a1a", "#2a0a2a"], ["#20102a", "#1a0820"], ["#150a20", "#1e1028"]] },
    { title: "Fieldwork CMS", desc: "A headless CMS built for performance journalists. Git-based content versioning with native structured data support.", status: "archived", tech: ["Go", "PostgreSQL", "Next.js", "S3"], emoji: ["📝", "🗂️", "📰"], colors: [["#1a1a0a", "#2a2a10"], ["#1e1e0d", "#282815"], ["#161608", "#201e0a"]] },
];

const feedSeed = [
    { type: "deploy", text: "Luminary OS v2.3.1 deployed to production", time: "2m ago" },
    { type: "commit", text: "feat: add zk-proof verification layer", time: "14m ago" },
    { type: "update", text: "Atlas Dashboard — 1.2M new events processed", time: "38m ago" },
    { type: "commit", text: "fix: carousel timing in mobile browsers", time: "1h ago" },
    { type: "deploy", text: "Resonance beta build pushed to staging", time: "2h ago" },
    { type: "update", text: "Portfolio site — 842 visitors today", time: "3h ago" },
    { type: "commit", text: "refactor: split auth module into microservices", time: "5h ago" },
];

const newFeedItems = [
    { type: "commit", text: "chore: security patch dependencies", time: "just now" },
    { type: "deploy", text: "Fieldwork CMS — staging refreshed", time: "just now" },
    { type: "update", text: "Vanta — 3 new beta testers onboarded", time: "just now" },
];

const ProjectSection = () => {
    const [feed, setFeed] = useState(feedSeed);
    const [sidebarFixed, setSidebarFixed] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const section1Ref = useRef(null);
    const containerRef = useRef(null);

    // Carousel state
    const [ovVisible, setOvVisible] = useState(false);
    const [ovPos, setOvPos] = useState({ x: 0, y: 0 });
    const [activeProj, setActiveProj] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const reqRef = useRef(null);

    // Feed ticker
    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            const newItem = { ...newFeedItems[count % newFeedItems.length], id: Math.random() };
            setFeed(prev => [newItem, ...prev].slice(0, 14));
            count++;
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    // Track sidebar visible state in ref to avoid stale closure + enable hysteresis
    const sidebarVisibleRef = useRef(false);

    // Scroll listener for sidebar visibility and position
    useEffect(() => {
        const handleScroll = () => {
            if (!section1Ref.current || !containerRef.current) return;

            const section1Top = section1Ref.current.getBoundingClientRect().top;
            const section1Bottom = section1Ref.current.getBoundingClientRect().bottom;
            const viewportHeight = window.innerHeight;

            // Hysteresis: show when section1Top crosses 50%, hide only when it goes above 65%
            // This prevents rapid blinking at the threshold boundary
            const shouldShow = sidebarVisibleRef.current
                ? section1Top < viewportHeight * 0.65  // stay visible until 65%
                : section1Top < viewportHeight * 0.5;  // appear at 50%

            if (shouldShow !== sidebarVisibleRef.current) {
                sidebarVisibleRef.current = shouldShow;
                setSidebarVisible(shouldShow);
            }

            setSidebarFixed(shouldShow && section1Bottom > viewportHeight * 0.1);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hover Carousel logic
    const updateOvPos = useCallback(() => {
        if (!ovVisible) return;
        const vw = window.innerWidth, vh = window.innerHeight;
        const ow = 248, oh = 190;
        let lx = mouseRef.current.x + 22;
        let ly = mouseRef.current.y - 80;

        if (lx + ow > vw - 10) lx = mouseRef.current.x - ow - 14;
        ly = Math.max(10, Math.min(ly, vh - oh - 10));

        setOvPos({ x: lx, y: ly });
        reqRef.current = requestAnimationFrame(updateOvPos);
    }, [ovVisible]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            if (ovVisible && !reqRef.current) {
                reqRef.current = requestAnimationFrame(updateOvPos);
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [ovVisible, updateOvPos]);

    const handleMouseEnterRow = (p) => {
        setActiveProj(p);
        setCurrentSlide(0);
        setOvVisible(true);
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        reqRef.current = requestAnimationFrame(updateOvPos);

        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % 3);
        }, 800);
    };

    const handleMouseLeaveRow = () => {
        clearInterval(timerRef.current);
        setOvVisible(false);
        setActiveProj(null);
    };

    return (
        <section className="proj-sec-container" ref={containerRef}>
            {/* Carousel overlay */}
            <div className={`proj-ov ${ovVisible ? 'vis' : ''}`} style={{ left: ovPos.x, top: ovPos.y }}>
                <div style={{ position: 'relative' }}>
                    <div className="proj-ov-track" style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}>
                        {[0, 1, 2].map(i => (
                            <div className="proj-ov-slide" key={i}>
                                <div className="proj-ov-img" style={{
                                    background: activeProj ? `linear-gradient(135deg, ${activeProj.colors[i][0]}, ${activeProj.colors[i][1]})` : ''
                                }}>
                                    {activeProj?.emoji[i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="proj-ov-foot">
                    <span className="proj-ov-name">{activeProj ? activeProj.title : '—'}</span>
                    <div className="proj-ov-dots">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`proj-ov-dot ${currentSlide === i ? 'a' : ''}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="proj-sec-wrap">
                {/* ════ LEFT SIDEBAR ════ */}
                <aside className={`proj-col-left z-[100] ${sidebarFixed ? 'sidebar-fixed' : 'sidebar-absolute'} ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                    <div className="proj-profile-sec">
                        <div className="proj-img">
                            <div className="proj-img-ph">
                                <div className="proj-av-ring">
                                    <div className="proj-av-inner">DA</div>
                                    <div className="proj-ondot"></div>
                                </div>
                            </div>
                            <div className="proj-name-ov">
                                <h2>Domince Aseberos</h2>
                                <p>Creative Developer</p>
                            </div>
                        </div>
                        <div className="proj-bio-area">
                            <div className="proj-blabel">About</div>
                            <div className="proj-btext">Crafting digital experiences at the intersection of code and design. I build things that feel as good as they look.</div>
                            <div className="proj-btags">
                                <span className="proj-btag">React</span>
                                <span className="proj-btag">GSAP</span>
                                <span className="proj-btag">UI/UX</span>
                                <span className="proj-btag">Motion</span>
                                <span className="proj-btag">WebGL</span>
                            </div>
                        </div>
                    </div>

                    <div className="proj-feed-sec">
                        <div className="proj-feed-hd">
                            <span className="proj-feed-ttl">Activity</span>
                            <div className="proj-live-badge"><div className="proj-ldot"></div>Live</div>
                        </div>
                        <div className="proj-feed-list">
                            {feed.map((f, i) => (
                                <div key={f.id || i} className={`proj-fi ${f.id ? 'proj-fi-new' : ''}`}>
                                    <div className={`proj-fi-type ${f.type}`}>{f.type}</div>
                                    <div className="proj-fi-txt">{f.text}</div>
                                    <div className="proj-fi-time">{f.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ════ RIGHT SIDE STACK ════ */}
                <div className="proj-right-wrapper">
                    {/* SECTION 1: PROJECTS */}
                    <div className="section-container" ref={section1Ref}>
                        <section className="proj-col-right" id="sec0">
                            <div className="proj-rs-head z-[100] sticky top-0">
                                <h1>Pro<em>jects</em></h1>
                                <div className="proj-hicons">
                                    <button className="proj-ibtn" title="Filter">⚙</button>
                                    <button className="proj-ibtn" title="Sort">↕</button>
                                    <button className="proj-ibtn" title="Grid">▦</button>
                                    <div className="proj-orbit">
                                        <div className="proj-or proj-or1"></div>
                                        <div className="proj-or proj-or2"></div>
                                        <div className="proj-oc"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="proj-rs-body z-[100] relative">
                                <div className="proj-list">
                                    {projects.map((p, i) => (
                                        <div className="proj-prow" key={i} onMouseEnter={() => handleMouseEnterRow(p)} onMouseLeave={handleMouseLeaveRow}>
                                            <div className="proj-pinfo">
                                                <div className="proj-pmeta">
                                                    <span className="proj-pidx">{String(i + 1).padStart(2, '0')}</span>
                                                    <span className={`proj-pstat ${p.status === 'live' ? 'proj-s-live' : p.status === 'wip' ? 'proj-s-wip' : 'proj-s-arch'}`}>
                                                        {p.status === 'wip' ? 'In Progress' : p.status}
                                                    </span>
                                                </div>
                                                <div className="proj-ptitle">{p.title}</div>
                                                <div className="proj-pdesc">{p.desc}</div>
                                                <div className="proj-ptech">
                                                    {p.tech.map(t => <span className="proj-ttag" key={t}>{t}</span>)}
                                                </div>
                                            </div>
                                            <div className="proj-pacts z-20 relative">
                                                <button className="proj-abtn pr"><span>↗</span> Live Preview</button>
                                                <button className="proj-abtn"><span>≡</span> Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="proj-sarrow">
                                <span>next</span>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 2v10M3 8l4 4 4-4" />
                                </svg>
                            </div>
                        </section>
                    </div>

                    {/* ── SECTION DIVIDER (Projects -> Labs) ── */}
                    <div className="proj-divider">
                        <div className="proj-div-line"></div>
                        <div className="proj-div-badge">
                            <span className="proj-div-dot"></span>
                            <span className="proj-div-num">02</span>
                            <span className="proj-div-label">Labs</span>
                            <span className="proj-div-dot"></span>
                        </div>
                        <div className="proj-div-line"></div>
                    </div>

                    {/* SECTION 2: LABS */}
                    <div className="section-container">
                        <section className="proj-col-right" id="sec1">
                            {/* We omit proj-rs-head here since LabsSection has its own custom header */}
                            <div className="proj-rs-body z-[100] relative">
                                <LabsSection />
                            </div>
                        </section>
                    </div>

                    {/* ── SECTION DIVIDER (Labs -> About) ── */}
                    <div className="proj-divider">
                        <div className="proj-div-line"></div>
                        <div className="proj-div-badge">
                            <span className="proj-div-dot"></span>
                            <span className="proj-div-num">03</span>
                            <span className="proj-div-label">About</span>
                            <span className="proj-div-dot"></span>
                        </div>
                        <div className="proj-div-line"></div>
                    </div>

                    {/* SECTION 3: ABOUT */}
                    <div className="section-container">
                        <section className="proj-col-right" id="sec2">
                            <div className="proj-rs-head z-[100] sticky top-0">
                                <h1>A<em>bout</em></h1>
                                <div className="proj-hicons">
                                    <button className="proj-ibtn" title="Download CV">↓</button>
                                    <button className="proj-ibtn" title="Contact">✉</button>
                                </div>
                            </div>
                            <div className="proj-rs-body z-[100] relative">
                                <div className="proj-about-pad">
                                    <div className="proj-agrid">
                                        <div className="proj-acard"><h3>Frontend Architecture</h3><p>Component-driven systems built for scale, performance, and developer ergonomics.</p><span className="proj-cnum">01</span></div>
                                        <div className="proj-acard"><h3>API Integration</h3><p>RESTful & GraphQL patterns. Real-time data with WebSockets and SSE.</p><span className="proj-cnum">02</span></div>
                                        <div className="proj-acard"><h3>Motion Design</h3><p>Physics-based animations, gesture-driven UX, cinematic page transitions.</p><span className="proj-cnum">03</span></div>
                                        <div className="proj-acard"><h3>Performance</h3><p>Core Web Vitals obsession. Lazy loading, code splitting, edge caching.</p><span className="proj-cnum">04</span></div>
                                    </div>

                                    <div className="proj-ctablock">
                                        <h2>Let's Build Something.</h2>
                                        <p>Open to freelance, contracts, and interesting full-time roles.</p>
                                        <button className="proj-ctabtn">→ Get In Touch</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectSection;
