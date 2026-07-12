import React, { forwardRef, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope } from 'react-icons/fa6';
import { fetchAboutData } from '../../../shared/aboutService';
import githubSvg from '../../../assets/github.svg';
import linkedinSvg from '../../../assets/linkedin.svg';
import emailSvg from '../../../assets/email.svg';
import xSvg from '../../../assets/X.svg';
import threadsSvg from '../../../assets/threads.svg';
import instagramSvg from '../../../assets/instagram.svg';
import facebookSvg from '../../../assets/facebook.svg';
import { fetchPortfolioData } from '../../../shared/portfolioService';
import portfolioDataDefault from '../../../data/portfolioData.json';
import aboutDataDefault from '../../../data/aboutData.json';
import ProfileMorphCard from '../../../components/ProfileMorphCard';
import EducationSection from './EducationSection';
import GithubContributionSection from './GithubContributionSection';
import FeedSection from './FeedSection';
import PremiumMotionCards from './PremiumMotionCards';
import PhilosophyCards from './PhilosophyCards';
import HrmsPipelineMotionCards from './HrmsPipelineMotionCards';
import ScrollTypewriter from './ui/ScrollTypewriter';
import LyricsScrubText from './ui/LyricsScrubText';
import DocViewerModal from '../../../components/DocViewerModal';
import SafeErrorBoundary from '../../../components/SafeErrorBoundary';
import SectionProgressIndicator from '../../../components/SectionProgressIndicator';
import useLoadingStore from '../../../store/useLoadingStore';
import useLogoStore from '../../../store/useLogoStore';
import useThemeStore from '../../../store/useThemeStore';
import AnimatedHandwritingText from '../../../components/AnimatedHandwritingText';
import AnimatedDivider from './ui/AnimatedDivider';
import AnimatedFace from './ui/AnimatedFace';
import ScrollyTellingSection from './sections/ScrollyTellingSection';
import { ABOUT_SEQUENCES } from '../data/scrollyTellingData';
import HeroPaperPlane from './ui/HeroPaperPlane';

import HoverDrawBorder from './ui/HoverDrawBorder';
import './NarrativeSection.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ABOUT_SECTIONS = [
    { id: 'about', label: 'About' },
    { id: 'workflow', label: 'Process' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'feed', label: 'Dev Feed' },
    { id: 'github', label: 'GitHub' },
    { id: 'testimonials', label: 'Testimonials' },
];

// ── Scrub reveal — re-registers whenever dataReady flips true ────────────
function useScrubReveal(containerRef, dataReady) {
    useEffect(() => {
        if (!dataReady || !containerRef.current) return;

        // Small RAF delay so the DOM has fully painted before measuring
        const raf = requestAnimationFrame(() => {
            const ctx = gsap.context(() => {
                const els = gsap.utils.toArray('.ns-reveal', containerRef.current);

                // Force initial hidden state in JS (not CSS) so GSAP owns it
                gsap.set(els, { opacity: 0, y: 36, immediateRender: true });

                ScrollTrigger.batch(els, {
                    start: 'top 92%',
                    onEnter: (batch) => {
                        gsap.to(batch, {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'power2.out',
                            stagger: 0.1,
                        });
                    },
                });
                ScrollTrigger.refresh();
            }, containerRef);
            return () => ctx.revert();
        });

        return () => cancelAnimationFrame(raf);
    }, [dataReady, containerRef]);
}

// ── Icons ─────────────────────────────────────────────────────────────────
const getSocialIcon = (label, theme) => {
    const l = label.toLowerCase();
    const style = { width: '100%', height: '100%', filter: theme === 'dark' ? 'invert(1)' : 'invert(0)' };

    if (l === 'linkedin') return <img src={typeof linkedinSvg === 'object' ? linkedinSvg.src : linkedinSvg} alt="LinkedIn" style={style} />;
    if (l === 'github') return <img src={typeof githubSvg === 'object' ? githubSvg.src : githubSvg} alt="GitHub" style={style} />;
    if (l === 'email') return <img src={typeof emailSvg === 'object' ? emailSvg.src : emailSvg} alt="Email" style={style} />;

    if (l === 'x' || l === 'twitter') return <img src={typeof xSvg === 'object' ? xSvg.src : xSvg} alt="X" style={style} />;
    if (l === 'threads') return <img src={typeof threadsSvg === 'object' ? threadsSvg.src : threadsSvg} alt="Threads" style={style} />;
    if (l === 'instagram') return <img src={typeof instagramSvg === 'object' ? instagramSvg.src : instagramSvg} alt="Instagram" style={style} />;
    if (l === 'facebook') return <img src={typeof facebookSvg === 'object' ? facebookSvg.src : facebookSvg} alt="Facebook" style={style} />;
    return <span className="ns-arrow">↗</span>;
};

// ── Configuration for Face Drawing ───────────────────────────────────────
// Easily configure the position, size, and animation settings of the face drawing
const FACE_CONFIG = {
    top: '25%', // Adjust vertical position: move up (e.g. '15%') or down (e.g. '30%')
    right: '5%', // Adjust horizontal position
    maxWidth: '320px', // Adjust size of the face drawing
    delay: 0.2, // Start delay of the drawing animation (seconds)
    duration: 5.0 // Duration of the drawing animation (seconds)
};

// ── Main component ────────────────────────────────────────────────────────
const AboutDeepDive = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const bioRef = useRef(null);
    const stripesRef = useRef([]);
    const isLoading = useLoadingStore((state) => state.isLoading);
    const themeStoreVal = useThemeStore((state) => state.theme);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Ensure server and first client render both use 'dark' to prevent hydration mismatches
    const theme = isMounted ? themeStoreVal : 'dark';

    // All content from aboutData.json — bundled default, refreshed from server
    const [data, setData] = useState(() => aboutDataDefault);
    const [dataReady, setDataReady] = useState(false);

    useScrubReveal(containerRef, dataReady);


    // ── Data fetch ────────────────────────────────────────────────────────
    useEffect(() => {
        fetchAboutData()
            .then((d) => setData(d))
            .catch(() => {/* keep bundled default */ })
            .finally(() => setDataReady(true));
    }, []);

    // ── Dedicated Hero Bio Reveal ──────────────────────────────────────────
    // Waits ~1s for GlobalLoader to fade out, then reveals after handwriting finishes
    useEffect(() => {
        if (!bioRef.current) return;

        // GlobalLoader takes ~500ms to fade + 0.5s buffer + 3s for handwriting = ~4s total
        gsap.fromTo(bioRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, delay: 4, ease: 'power2.out' }
        );
    }, []);

    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

    // ── Destructure with safe fallbacks ───────────────────────────────────
    const about = data.about || {};
    const experience = data.experience || [];
    const testimonials = data.testimonials || [];
    const socials = data.socials || [];

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section" style={{ overflowX: 'hidden' }} suppressHydrationWarning>

            {/* ══ HERO ═════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="ns-hero-section" id="hero" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div className="ns-hero-inner" style={{ textAlign: 'center', position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="ns-hero-text lit-content-block lit-transparent" suppressHydrationWarning>
                        <h1 className="ns-hero-name ns-reveal" suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <AnimatedHandwritingText
                                text="How I"
                                className="name-first"
                                fontUrl="/fonts/PermanentMarker.ttf"
                                strokeWidth={3}
                                duration={2}
                            />
                            <AnimatedHandwritingText
                                text="Got Here"
                                className="name-last"
                                fontUrl="/fonts/PermanentMarker.ttf"
                                strokeWidth={3}
                                duration={2}
                                delay={1}
                            />
                        </h1>
                        <p ref={bioRef} className="ns-hero-bio ui-body-copy" style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0', opacity: 0 }} suppressHydrationWarning>
                            The path that got me here - experience, education, what I work on day to day, and what people say about working with me.
                        </p>
                    </div>
                </div>

                {/* The Paper Plane Animation */}
                <SafeErrorBoundary>
                    <HeroPaperPlane />
                </SafeErrorBoundary>

                {/* Face Drawing - Positioned absolutely and animated to grow/reveal on load */}
                <SafeErrorBoundary>
                    <AnimatedFace
                        className="ns-reveal ns-hero-face"
                        alt="Face Drawing"
                        delay={FACE_CONFIG.delay}
                        duration={FACE_CONFIG.duration}
                        style={{
                            position: 'absolute',
                            right: FACE_CONFIG.right,
                            top: FACE_CONFIG.top,
                            transform: 'translateY(-50%)',
                            width: '100%',
                            maxWidth: FACE_CONFIG.maxWidth,
                            opacity: 0.8,
                            pointerEvents: 'none',
                            zIndex: 0
                        }}
                    />
                </SafeErrorBoundary>
            </section>

            <AnimatedDivider
                style={{ marginTop: '-1rem', zIndex: 0, position: 'relative' }}
                scrollStart="top 100%"
                scrollEnd="bottom 15%"
                scrub={0.5}
                maskMaxSize={120}
                tailFadeStart={25}
                headThickness={5}
            />

            {/* ══ ABOUT ═══════════════════════════════════════════════ */}
            <section className="ns-section" id="about" style={{ borderTop: 'none', paddingTop: '0', position: 'relative' }}>
                <ScrollyTellingSection sequences={ABOUT_SEQUENCES} sectionLabel="About" />
            </section>

            <AnimatedDivider />

            {/* ══ WORKFLOW ═════════════════════════════════════════════════ */}
            <section className="ns-section" id="workflow" style={{ borderTop: 'none', paddingTop: '40px' }}>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '10vh' }}>
                    <div className="ns-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                        <div style={{ flex: '1 1 400px' }}>
                            <p className="ui-sub-label ns-section-label" suppressHydrationWarning>Process</p>
                            <LyricsScrubText
                                text="I don't just write code. I design systems. Here is my step-by-step pipeline for turning complex problems into working software."
                                highlights={['design', 'systems', 'step-by-step', 'pipeline', 'complex', 'problems', 'working', 'software']}
                                style={{ marginTop: '0.5rem', maxWidth: '500px' }}
                            />
                        </div>

                        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', height: '60px', padding: '0 10px' }}>
                            <div style={{ position: 'absolute', left: '20px', right: '20px', top: '24px', height: '2px', background: 'var(--border-color, rgba(160, 168, 208, 0.2))', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', left: '20px', right: '20px', top: '24px', height: '2px', overflow: 'hidden', zIndex: 1 }}>
                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, #3B82F6, #7C3AED, transparent)', animation: 'flowingLine 2.5s infinite linear' }}></div>
                            </div>

                            {[
                                { name: 'Plan', color: '#7C3AED', delay: '0.41s' },
                                { name: 'Data', color: '#3B82F6', delay: '0.69s' },
                                { name: 'Logic', color: '#06B6D4', delay: '0.97s' },
                                { name: 'Build', color: '#8B5CF6', delay: '1.25s' }
                            ].map((phase) => (
                                <div key={phase.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                                    <div style={{
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '50%',
                                        border: '3px solid var(--bg-main, #ffffff)',
                                        '--dot-color': phase.color,
                                        '--dot-glow': `${phase.color}66`,
                                        animation: `pulseDot 2.5s infinite linear ${phase.delay}`
                                    }}></div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{phase.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="ns-reveal" style={{ marginTop: '3rem' }}>
                        <HrmsPipelineMotionCards />
                    </div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ══ EXPERIENCE ═══════════════════════════════════════════════ */}
            {experience.length > 0 && (
                <section className="ns-section" id="experience" style={{ borderTop: 'none', paddingTop: '40px' }}>
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Work History</p>
                    <h2 className="ns-section-heading ns-reveal">Experience</h2>
                    <div className="ns-timeline">
                        {experience.map((item, i) => (
                            <div key={i} className="ns-timeline-item ns-reveal ns-sketch-box lit-content-block lit-transparent" style={{ padding: '2rem' }}>
                                <HoverDrawBorder />
                                <div className="ns-timeline-dot" />
                                <div className="ns-timeline-body">
                                    <div className="ns-timeline-header">
                                        <h3 className="ns-timeline-role">{item.role}</h3>
                                        <span className="ns-timeline-period ui-sub-label">{item.period}</span>
                                    </div>
                                    <p className="ns-timeline-company">{item.company}</p>
                                    <p className="ns-timeline-desc ui-body-copy">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <AnimatedDivider />

            {/* ══ EDUCATION ════════════════════════════════════════════════ */}
            <EducationSection />

            <AnimatedDivider />

            {/* ══ FEED ═════════════════════════════════════════════════════ */}
            <FeedSection />

            <AnimatedDivider />

            {/* ══ GITHUB ═══════════════════════════════════════════════════ */}
            <GithubContributionSection />

            <AnimatedDivider />

            {/* ══ TESTIMONIALS ═════════════════════════════════════════════ */}
            {testimonials.length > 0 && (
                <section className="ns-section" id="testimonials" style={{ borderTop: 'none', paddingTop: '40px' }}>
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Endorsements</p>
                    <h2 className="ns-section-heading ns-reveal">Testimonials</h2>
                    <div className="ns-testimonials-wrapper ns-reveal">
                        <div className="ns-testimonials-track">
                            {[...testimonials, ...testimonials].map((t, i) => (
                                <div key={i} className="ns-testimonial-card ns-sketch-box lit-content-block" style={{ padding: '2rem' }}>
                                    <HoverDrawBorder />
                                    <p className="ns-testimonial-quote">“{t.quote}”</p>
                                    <div className="ns-testimonial-author">
                                        <p className="ns-testimonial-name">{t.author}</p>
                                        <p className="ns-testimonial-role ui-sub-label">
                                            {t.role}{t.company ? `, ${t.company}` : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ CONNECT ═══════════════════════════════════════════════════ */}
            {socials.length > 0 && (
                <section className="ns-section" id="connect" style={{ borderTop: 'none', paddingTop: '40px', paddingBottom: '10vh' }}>
                    <div className="ns-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p className="ui-sub-label" style={{ marginBottom: '1.25rem', letterSpacing: '0.22em' }}>Connect</p>
                        <div className="ns-bento-socials" style={{ justifyContent: 'center', gap: '1.5rem' }}>
                            {socials.map((link) => (
                                <a key={link.label} href={link.href}
                                    target={link.external ? '_blank' : '_self'}
                                    rel={link.external ? 'noopener noreferrer' : ''}
                                    className="ns-bento-social-link" title={link.label}
                                    onMouseEnter={(e) => {
                                        gsap.to(e.currentTarget.querySelectorAll('svg, img'), {
                                            scale: 1.25,
                                            rotation: (Math.random() - 0.5) * 20,
                                            duration: 0.35,
                                            ease: 'back.out(3)'
                                        });
                                    }}
                                    onMouseLeave={(e) => {
                                        gsap.to(e.currentTarget.querySelectorAll('svg, img'), {
                                            scale: 1,
                                            rotation: 0,
                                            duration: 0.7,
                                            ease: 'elastic.out(1, 0.3)'
                                        });
                                    }}
                                >
                                    {getSocialIcon(link.label, theme)}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <SectionProgressIndicator sections={ABOUT_SECTIONS} />
            <DocViewerModal
                isOpen={isResumeModalOpen}
                onClose={() => setIsResumeModalOpen(false)}
                docUrl={data.resume}
                title="Curriculum Vitae"
            />
        </div>
    );
});

AboutDeepDive.displayName = 'AboutDeepDive';
export default React.memo(AboutDeepDive);
