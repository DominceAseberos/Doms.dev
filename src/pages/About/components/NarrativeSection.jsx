import React, { forwardRef, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchAboutData } from '../../../shared/aboutService';
import { fetchPortfolioData } from '../../../shared/portfolioService';
import portfolioDataDefault from '../../../data/portfolioData.json';
import aboutDataDefault from '../../../data/aboutData.json';
import ProfileMorphCard from '../../../components/ProfileMorphCard';
import EducationSection from './EducationSection';
import GithubContributionSection from './GithubContributionSection';
import FeedSection from './FeedSection';
import CityscapeContact from '../../Contact/components/CityscapeContact';
import humanPortrait from '../../../assets/human-cutout.png';
import animePortrait from '../../../assets/anime-cutout.png';
import useLoadingStore from '../../../store/useLoadingStore';
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
                els.forEach((el, i) => {
                    // Force initial hidden state in JS (not CSS) so GSAP owns it
                    gsap.set(el, { opacity: 0, y: 36, immediateRender: true });
                    gsap.to(el, {
                        opacity: 1, y: 0,
                        duration: 0.7,
                        ease: 'power2.out',
                        delay: (i % 4) * 0.05,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 92%',
                            toggleActions: 'play none none none',
                        },
                    });
                });
                ScrollTrigger.refresh();
            }, containerRef);
            return () => ctx.revert();
        });

        return () => cancelAnimationFrame(raf);
    }, [dataReady, containerRef]);
}

// ── Icons ─────────────────────────────────────────────────────────────────
const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
);
const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// ── Main component ────────────────────────────────────────────────────────
const NarrativeSection = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const stripesRef = useRef([]);
    const isLoading = useLoadingStore((state) => state.isLoading);

    // All content from aboutData.json — bundled default, refreshed from server
    const [data, setData] = useState(() => aboutDataDefault);
    const [dataReady, setDataReady] = useState(false);

    // Projects from portfolioData.json
    const [projects, setProjects] = useState(() =>
        (portfolioDataDefault.projects || []).slice(0, 4)
    );

    useScrubReveal(containerRef, dataReady);

    // ── Stripe intro ──────────────────────────────────────────────────────
    useLayoutEffect(() => {
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

    // ── Parallax on hero card ─────────────────────────────────────────────
    useLayoutEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            gsap.to('.ns-hero-card', {
                yPercent: 18, ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // ── Data fetch ────────────────────────────────────────────────────────
    useEffect(() => {
        fetchAboutData()
            .then((d) => setData(d))
            .catch(() => {/* keep bundled default */})
            .finally(() => setDataReady(true));
    }, []);

    useEffect(() => {
        fetchPortfolioData()
            .then((d) => setProjects((d.projects || []).slice(0, 4)))
            .catch(() => {/* keep bundled default */});
    }, []);

    const addStripe = (el) => {
        if (el && !stripesRef.current.includes(el)) stripesRef.current.push(el);
    };

    // ── Destructure with safe fallbacks ───────────────────────────────────
    const hero       = data.hero       || {};
    const about      = data.about      || {};
    const experience = data.experience || [];
    const techStack  = data.techStack  || [];
    const techExtra  = data.techStackExtra || [];
    const contact    = data.contact    || {};
    const socials    = data.socials    || [];

    const STRIPE_COUNT = 20;

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section">

            {/* ══ STRIPE OVERLAY — fixed full-viewport, removed after animation ══ */}
            <div className="ns-stripes-overlay" aria-hidden>
                {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
                    <div key={i} ref={addStripe} className="ns-stripe" style={{ height: `${100 / STRIPE_COUNT}%` }} />
                ))}
            </div>

            {/* ══ HERO ═════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="ns-hero-section" id="hero">

                <div className="ns-hero-inner">
                    <div className="ns-hero-text">
                        {hero.location && (
                            <p className="ns-hero-location ui-sub-label">{hero.location}</p>
                        )}
                        <h1 className="ns-hero-name">
                            {(hero.fullName || 'Domince\nAseberos').split('\n').map((line, i, arr) => (
                                <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                            ))}
                        </h1>
                        {hero.role && <p className="ns-hero-role">{hero.role}</p>}
                        {hero.bio  && <p className="ns-hero-bio ui-body-copy">{hero.bio}</p>}

                        {(hero.badges || []).length > 0 && (
                            <div className="ns-hero-badges">
                                {hero.badges.map((b) => (
                                    <span key={b} className="ui-pill ns-badge">{b}</span>
                                ))}
                            </div>
                        )}

                        <div className="ns-hero-actions">
                            {data.resume && (
                                <a href={data.resume} download className="btn-primary ns-btn">
                                    Download Resume
                                </a>
                            )}
                            {hero.githubUrl && (
                                <a href={hero.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost ns-btn ns-btn-icon">
                                    <GithubIcon /> GitHub
                                </a>
                            )}
                            {hero.linkedinUrl && (
                                <a href={hero.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost ns-btn ns-btn-icon">
                                    <LinkedInIcon /> LinkedIn
                                </a>
                            )}
                        </div>

                        {(hero.metrics || []).length > 0 && (
                            <div className="ns-metrics">
                                {hero.metrics.map((m, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <div className="ns-metric-div" />}
                                        <div className="ns-metric">
                                            <span className="ns-metric-val">{m.value}<sup>{m.unit}</sup></span>
                                            <span className="ns-metric-lbl">{m.label}</span>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="ns-hero-card">
                        <ProfileMorphCard realSrc={humanPortrait} animeSrc={animePortrait} alt="Domince portrait" />
                    </div>
                </div>
            </section>

            {/* ══ ABOUT ════════════════════════════════════════════════════ */}
            <section className="ns-section ns-reveal" id="about">
                <p className="ui-sub-label ns-section-label">About</p>
                <div className="ns-about-grid">
                    <div className="ns-about-main">
                        <h2 className="ns-section-heading">
                            {about.heading || 'Engineering'}{' '}
                            <span className="ns-accent">{about.headingAccent || 'Digital Poetry'}</span>
                        </h2>
                        {about.intro && (
                            <p className="ns-body-lg ui-body-copy">{about.intro}</p>
                        )}
                        <div className="ns-about-blocks">
                            {(about.blocks || []).map((block, i) => (
                                <div key={i} className="ns-about-block ns-reveal">
                                    <h3 className="ns-about-block-title">{block.title}</h3>
                                    <p className="ui-body-copy">{block.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="ns-about-sidebar">
                        {about.location && (
                            <div className="ns-sidebar-block ns-reveal">
                                <p className="ns-sidebar-label ui-sub-label">Location</p>
                                <p className="ns-sidebar-text">{about.location}</p>
                            </div>
                        )}
                        {(about.capabilities || []).length > 0 && (
                            <div className="ns-sidebar-block ns-reveal">
                                <p className="ns-sidebar-label ui-sub-label">Capabilities</p>
                                <div className="ns-pill-group">
                                    {about.capabilities.map((item) => (
                                        <span key={item} className="ns-pill">{item}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(about.aiTools || []).length > 0 && (
                            <div className="ns-sidebar-block ns-reveal">
                                <p className="ns-sidebar-label ui-sub-label">AI-Augmented Stack</p>
                                <div className="ns-pill-group">
                                    {about.aiTools.map((tool) => (
                                        <span key={tool} className="ns-ai-pill">✦ {tool}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {socials.length > 0 && (
                            <div className="ns-sidebar-block ns-reveal">
                                <p className="ns-sidebar-label ui-sub-label">Social</p>
                                <div className="ns-social-links">
                                    {socials.map((link) => (
                                        <a key={link.label} href={link.href}
                                            target={link.external ? '_blank' : '_self'}
                                            rel={link.external ? 'noopener noreferrer' : ''}
                                            className="ns-social-link">
                                            {link.label} <span className="ns-arrow">↗</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            {/* ══ EXPERIENCE ═══════════════════════════════════════════════ */}
            {experience.length > 0 && (
                <section className="ns-section" id="experience">
                    <p className="ui-sub-label ns-section-label ns-reveal">Experience</p>
                    <h2 className="ns-section-heading ns-reveal">Things I've done.</h2>
                    <div className="ns-timeline">
                        {experience.map((item, i) => (
                            <div key={i} className="ns-timeline-item ns-reveal">
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

            {/* ══ TECH STACK ═══════════════════════════════════════════════ */}
            {techStack.length > 0 && (
                <section className="ns-section" id="stack">
                    <p className="ui-sub-label ns-section-label ns-reveal">Tech Stack</p>
                    <h2 className="ns-section-heading ns-reveal">What I work with.</h2>
                    <div className="ns-stack-grid">
                        {techStack.map((group) => (
                            <div key={group.group} className="ns-stack-group ns-reveal">
                                <h3 className="ns-stack-group-title">{group.group}</h3>
                                <div className="ns-pill-group">
                                    {(group.items || []).map((item) => (
                                        <span key={item} className="ns-pill">{item}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {techExtra.length > 0 && (
                        <div className="ns-stack-more ns-reveal">
                            <p className="ui-sub-label">Also comfortable with</p>
                            <div className="ns-pill-group" style={{ marginTop: '0.75rem' }}>
                                {techExtra.map((item) => (
                                    <span key={item} className="ns-pill">{item}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ══ RECENT PROJECTS ══════════════════════════════════════════ */}
            {projects.length > 0 && (
                <section className="ns-section" id="projects">
                    <div className="ns-projects-header ns-reveal">
                        <div>
                            <p className="ui-sub-label ns-section-label">Recent Projects</p>
                            <h2 className="ns-section-heading">Things I've built.</h2>
                        </div>
                        <Link to="/projects" className="ns-view-all">View All →</Link>
                    </div>
                    <div className="ns-projects-grid">
                        {projects.map((p) => (
                            <Link key={p.id} to={`/projects/${p.id}`} className="ns-project-card ns-reveal">
                                {p.mainImage || p.desktopImage ? (
                                    <div className="ns-project-img-wrap">
                                        <img src={p.mainImage || p.desktopImage} alt={p.title} className="ns-project-img" loading="lazy" />
                                    </div>
                                ) : (
                                    <div className="ns-project-img-placeholder" />
                                )}
                                <div className="ns-project-info">
                                    <div className="ns-project-meta">
                                        <span className="ui-sub-label ns-project-type">{p.projectType}</span>
                                        <span className="ns-project-arrow">↗</span>
                                    </div>
                                    <h3 className="ns-project-title">{p.title}</h3>
                                    <p className="ns-project-desc ui-body-copy">{p.shortDescription}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ══ EDUCATION ════════════════════════════════════════════════ */}
            <div className="ns-reveal"><EducationSection /></div>

            {/* ══ GITHUB ═══════════════════════════════════════════════════ */}
            <div className="ns-reveal"><GithubContributionSection /></div>

            {/* ══ FEED ═════════════════════════════════════════════════════ */}
            <div className="ns-reveal"><FeedSection /></div>

            {/* ══ CONTACT ══════════════════════════════════════════════════ */}
            <section className="ns-contact-section" id="contact">
                <div className="ns-contact-header ns-reveal">
                    <p className="ui-sub-label ns-section-label">Contact</p>
                    <h2 className="ns-section-heading">{contact.heading || "Let's build something."}</h2>
                    {contact.subtext && (
                        <p className="ui-body-copy ns-contact-sub">{contact.subtext}</p>
                    )}
                </div>
                <div className="ns-cityscape-wrap">
                    <CityscapeContact />
                </div>
            </section>
        </div>
    );
});

NarrativeSection.displayName = 'NarrativeSection';
export default NarrativeSection;
