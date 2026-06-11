import React, { forwardRef, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLinkedinIn, FaXTwitter, FaThreads, FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa6';
import { fetchAboutData } from '../../../shared/aboutService';
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
import DocViewerModal from '../../../components/DocViewerModal';
import SectionProgressIndicator from '../../../components/SectionProgressIndicator';
import useLoadingStore from '../../../store/useLoadingStore';
import useLogoStore from '../../../store/useLogoStore';
import useThemeStore from '../../../store/useThemeStore';
import './NarrativeSection.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

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
const getSocialIcon = (label) => {
    const l = label.toLowerCase();
    if (l === 'linkedin') return <FaLinkedinIn />;
    if (l === 'x' || l === 'twitter') return <FaXTwitter />;
    if (l === 'threads') return <FaThreads />;
    if (l === 'instagram') return <FaInstagram />;
    if (l === 'facebook') return <FaFacebookF />;
    if (l === 'email') return <FaEnvelope />;
    return <span className="ns-arrow">↗</span>;
};

// ── Main component ────────────────────────────────────────────────────────
const AboutDeepDive = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
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

    // ── Stripe intro ──────────────────────────────────────────────────────
    useEffect(() => {
        if (isLoading || !heroRef.current) return;
        const stripes = stripesRef.current.filter(Boolean);
        if (!stripes.length) return;

        // Find the overlay element (parent of stripes)
        const overlay = stripes[0]?.parentElement;

        const ctx = gsap.context(() => {
            gsap.set(stripes, { xPercent: 0 });
            gsap.to(stripes, {
                xPercent: (i) => (i % 2 === 0 ? 100 : -100),
                duration: 1.5,
                ease: 'power2.inOut',
                stagger: { amount: 0.8, from: 'center' },
                delay: 0.2,
                onComplete: () => {
                    // Hide overlay after animation so it never blocks clicks
                    if (overlay) overlay.style.display = 'none';
                },
            });
        }, heroRef);
        return () => ctx.revert();
    }, [isLoading]);

    // ── Data fetch ────────────────────────────────────────────────────────
    useEffect(() => {
        fetchAboutData()
            .then((d) => setData(d))
            .catch(() => {/* keep bundled default */})
            .finally(() => setDataReady(true));
    }, []);

    const addStripe = (el) => {
        if (el && !stripesRef.current.includes(el)) stripesRef.current.push(el);
    };

    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

    // ── Destructure with safe fallbacks ───────────────────────────────────
    const about      = data.about      || {};
    const experience = data.experience || [];
    const testimonials = data.testimonials || [];
    const socials    = data.socials    || [];

    const STRIPE_COUNT = 20;

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section" suppressHydrationWarning>

            {/* ══ STRIPE OVERLAY — fixed full-viewport, removed after animation ══ */}
            <div className="ns-stripes-overlay" aria-hidden>
                {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
                    <div key={i} ref={addStripe} className="ns-stripe" style={{ height: `${100 / STRIPE_COUNT}%` }} />
                ))}
            </div>

            {/* ══ HERO ═════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="ns-hero-section" id="hero" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="ns-hero-inner" style={{ textAlign: 'center' }}>
                    <div className="ns-hero-text lit-content-block lit-transparent" suppressHydrationWarning>
                        <h1 className="ns-hero-name ns-reveal" suppressHydrationWarning>
                            <span className="name-first">Behind</span>
                            <span className="name-last">the Code</span>
                        </h1>
                        <p className="ns-hero-bio ui-body-copy ns-reveal" style={{ marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }} suppressHydrationWarning>
                            A deeper dive into my experience, education, daily contributions, and what others have to say about working with me.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══ ABOUT ════════════════════════════════════════════════════ */}
            <section className="ns-section" id="about">
                <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>About</p>
                <div className="ns-about-grid">
                    <div className="ns-about-main lit-content-block lit-transparent">
                        <h2 className="ns-section-heading ns-reveal">
                            {about.heading || 'Engineering'}{' '}
                            <span className="ns-accent">{about.headingAccent || 'Digital Poetry'}</span>
                        </h2>
                        {about.intro && (
                            <p className="ns-body-lg ui-body-copy ns-reveal" suppressHydrationWarning>{about.intro}</p>
                        )}
                    </div>
                    
                    {/* Socials Column */}
                    {socials.length > 0 && (
                        <aside className="ns-about-sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <div className="ns-reveal lit-content-block lit-transparent">
                                <p className="ui-sub-label" style={{ marginBottom: '1.25rem', letterSpacing: '0.22em' }}>Connect</p>
                                <div className="ns-bento-socials">
                                    {socials.map((link) => (
                                        <a key={link.label} href={link.href}
                                            target={link.external ? '_blank' : '_self'}
                                            rel={link.external ? 'noopener noreferrer' : ''}
                                            className="ns-bento-social-link" title={link.label}
                                            onMouseEnter={(e) => { 
                                                gsap.to(e.currentTarget.querySelector('svg'), {
                                                    scale: 1.25,
                                                    rotation: (Math.random() - 0.5) * 20,
                                                    duration: 0.35,
                                                    ease: 'back.out(3)'
                                                });
                                            }}
                                            onMouseLeave={(e) => { 
                                                gsap.to(e.currentTarget.querySelector('svg'), {
                                                    scale: 1,
                                                    rotation: 0,
                                                    duration: 0.7,
                                                    ease: 'elastic.out(1, 0.3)'
                                                });
                                            }}
                                        >
                                            {getSocialIcon(link.label)}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </section>


            {/* ══ EXPERIENCE ═══════════════════════════════════════════════ */}
            {experience.length > 0 && (
                <section className="ns-section" id="experience">
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Work History</p>
                    <h2 className="ns-section-heading ns-reveal">Experience</h2>
                    <div className="ns-timeline">
                        {experience.map((item, i) => (
                            <div key={i} className="ns-timeline-item ns-reveal lit-content-block lit-transparent">
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

            {/* ══ EDUCATION ════════════════════════════════════════════════ */}
            <EducationSection />

            {/* ══ FEED ═════════════════════════════════════════════════════ */}
            <FeedSection />

            {/* ══ GITHUB ═══════════════════════════════════════════════════ */}
            <GithubContributionSection />

            {/* ══ TESTIMONIALS ═════════════════════════════════════════════ */}
            {testimonials.length > 0 && (
                <section className="ns-section" id="testimonials">
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Endorsements</p>
                    <h2 className="ns-section-heading ns-reveal">Testimonials</h2>
                    <div className="ns-testimonials-wrapper ns-reveal">
                        <div className="ns-testimonials-track">
                            {[...testimonials, ...testimonials].map((t, i) => (
                                <div key={i} className="ns-testimonial-card lit-content-block">
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

            {/* FOOTER & CONTACT REMOVED AS THEY ARE ON LAYOUT OR MAIN PAGE */}

            <SectionProgressIndicator />
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
