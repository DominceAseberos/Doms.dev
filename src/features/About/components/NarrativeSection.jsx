import React, { forwardRef, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLinkedinIn, FaXTwitter, FaThreads, FaInstagram, FaFacebookF, FaEnvelope, FaHeart, FaRobot } from 'react-icons/fa6';
import { fetchAboutData } from '../../../shared/aboutService';
import { fetchPortfolioData } from '../../../shared/portfolioService';
import HrmsPipelineMotionCards from './HrmsPipelineMotionCards';
import { 
    SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiFastapi, SiFlutter, 
    SiSupabase, SiPrisma, SiVercel, SiFigma, SiRedux, SiTailwindcss, SiHuggingface, 
    SiGithubactions, SiFirebase, SiAngular, SiVuedotjs, SiAstro, SiVite, SiWordpress, 
    SiShopify, SiJupyter, SiTurborepo, SiPython, SiPostgresql, SiGreensock, SiScikitlearn,
    SiDocker, SiFramer, SiSvg
} from 'react-icons/si';
import { Database, Layout, Webhook, Box, Code, Layers } from 'lucide-react';
import portfolioDataDefault from '../../../data/portfolioData.json';
import aboutDataDefault from '../../../data/aboutData.json';
import ProfileMorphCard from '../../../components/ProfileMorphCard';
import PinnedFeedPost from './PinnedFeedPost';
import PremiumMotionCards from './PremiumMotionCards';
import PhilosophyCards from './PhilosophyCards';
import DocViewerModal from '../../../components/DocViewerModal';
import humanPortrait from '../../../assets/human-cutout.png';
import animePortrait from '../../../assets/anime-cutout.png';
import useLoadingStore from '../../../store/useLoadingStore';
import useLogoStore from '../../../store/useLogoStore';
import useThemeStore from '../../../store/useThemeStore';
import './NarrativeSection.css';
import './TechHoverPhysics.css';

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
                
                ScrollTrigger.batch('.ns-tech-reveal', {
                    start: 'top 95%',
                    onEnter: (batch) => {
                        gsap.to(batch, {
                            opacity: 1, 
                            scale: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'back.out(1.5)',
                            stagger: 0.04,
                            overwrite: 'auto'
                        });
                    },
                });
                gsap.set('.ns-tech-reveal', { opacity: 0, scale: 0.8, y: 20 });

                ScrollTrigger.refresh();
            }, containerRef);
            return () => ctx.revert();
        });

        return () => cancelAnimationFrame(raf);
    }, [dataReady, containerRef]);
}
// ── Lyrics Scrub Reveal Component ──────────────────────────────────────────
const LyricsScrubText = ({ text, highlights = [], className = '', style = {} }) => {
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current || typeof window === 'undefined') return;
        
        const ctx = gsap.context(() => {
            const words = gsap.utils.toArray('.lyric-word', textRef.current);
            gsap.set(words, { opacity: 0.15 });
            
            gsap.to(words, {
                opacity: 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                    end: 'bottom 45%',
                    scrub: 0.5,
                }
            });
        }, textRef);
        
        return () => ctx.revert();
    }, [text]);

    return (
        <p ref={textRef} className={`ns-lyrics-text ${className}`} style={style} suppressHydrationWarning>
            {text.split(' ').map((word, i) => {
                const cleanWord = word.replace(/[.,!?]/g, '');
                const isHighlight = highlights.some(h => h.toLowerCase() === cleanWord.toLowerCase());
                return (
                    <span key={i} className="lyric-word" style={{ 
                        marginRight: '0.25em', 
                        display: 'inline-block', 
                        willChange: 'opacity',
                        color: isHighlight ? 'var(--accent)' : 'inherit',
                        textShadow: isHighlight ? '0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)' : 'none'
                    }}>
                        {word}
                    </span>
                );
            })}
        </p>
    );
};

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


const getTechIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('react native')) return <SiReact />;
    if (n.includes('react')) return <SiReact />;
    if (n.includes('next.js')) return <SiNextdotjs />;
    if (n.includes('typescript')) return <SiTypescript />;
    if (n.includes('node.js')) return <SiNodedotjs />;
    if (n.includes('fastapi')) return <SiFastapi />;
    if (n.includes('flutter')) return <SiFlutter />;
    if (n.includes('supabase')) return <SiSupabase />;
    if (n.includes('prisma')) return <SiPrisma />;
    if (n.includes('vercel')) return <SiVercel />;
    if (n.includes('figma')) return <SiFigma />;
    if (n.includes('redux')) return <SiRedux />;
    if (n.includes('tailwind')) return <SiTailwindcss />;
    if (n.includes('hugging')) return <SiHuggingface />;
    if (n.includes('github action')) return <SiGithubactions />;
    if (n.includes('firebase')) return <SiFirebase />;
    if (n.includes('angular')) return <SiAngular />;
    if (n.includes('vue')) return <SiVuedotjs />;
    if (n.includes('astro')) return <SiAstro />;
    if (n.includes('vite')) return <SiVite />;
    if (n.includes('wordpress')) return <SiWordpress />;
    if (n.includes('shopify')) return <SiShopify />;
    if (n.includes('ipynb') || n.includes('jupyter')) return <SiJupyter />;
    if (n.includes('turbopack')) return <SiTurborepo />;
    if (n.includes('rest api')) return <Webhook />;
    if (n.includes('zod')) return <Code />;
    if (n.includes('tanstack')) return <Database />;
    if (n.includes('shadcn') || n.includes('base ui')) return <Layout />;
    if (n.includes('zustand') || n.includes('riverpod')) return <Box />;
    if (n.includes('lenis')) return <Code />;
    if (n.includes('python')) return <SiPython />;
    if (n.includes('postgres')) return <SiPostgresql />;
    if (n.includes('gsap')) return <SiGreensock />;
    if (n.includes('scikit-learn') || n.includes('scikitlearn')) return <SiScikitlearn />;
    if (n.includes('docker')) return <SiDocker />;
    if (n.includes('framer')) return <SiFramer />;
    if (n.includes('svg')) return <SiSvg />;
    if (n.includes('emailjs')) return <FaEnvelope />;
    if (n.includes('lovable')) return <FaHeart />;
    if (n.includes('uptimerobot')) return <FaRobot />;
    if (n.includes('lottiefiles')) return <Layers />;
    return null;
};

// ── Main component ────────────────────────────────────────────────────────
const NarrativeSection = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const stripesRef = useRef([]);
    const isLoading = useLoadingStore((state) => state.isLoading);
    const setLogoFullView = useLogoStore((state) => state.setLogoFullView);
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

    // Projects from portfolioData.json
    const [projects, setProjects] = useState(() => {
        const all = portfolioDataDefault.projects || [];
        const featured = all.filter(p => p.featuredOnHome);
        return featured.length > 0 ? featured : all.slice(0, 4);
    });
    const [totalProjectsCount, setTotalProjectsCount] = useState(() =>
        (portfolioDataDefault.projects || []).length
    );

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

    // ── Parallax on hero card ─────────────────────────────────────────────
    useEffect(() => {
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
            .then((d) => {
                const all = d.projects || [];
                const featured = all.filter(p => p.featuredOnHome);
                setProjects(featured.length > 0 ? featured : all.slice(0, 4));
                setTotalProjectsCount(all.length);
            })
            .catch(() => {/* keep bundled default */});
    }, []);

    const addStripe = (el) => {
        if (el && !stripesRef.current.includes(el)) stripesRef.current.push(el);
    };

    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

    // ── Destructure with safe fallbacks ───────────────────────────────────
    const hero       = data.hero       || {};
    const about      = data.about      || {};
    const experience = data.experience || [];
    const testimonials = data.testimonials || [];
    const techStack  = data.techStack  || [];
    const techExtra  = data.techStackExtra || [];
    const contact    = data.contact    || {};
    const socials    = data.socials    || [];

    const STRIPE_COUNT = 20;
    const isPlaceholderImage = (src) =>
        typeof src === 'string' && /placehold\.co|placeholder/i.test(src);

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section" suppressHydrationWarning>

            {/* ══ STRIPE OVERLAY — fixed full-viewport, removed after animation ══ */}
            <div className="ns-stripes-overlay" aria-hidden>
                {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
                    <div key={i} ref={addStripe} className="ns-stripe" style={{ height: `${100 / STRIPE_COUNT}%` }} />
                ))}
            </div>

            {/* ══ HERO ═════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="ns-hero-section" id="hero">

                <div className="ns-hero-inner">
                    <div className="ns-hero-text lit-content-block lit-transparent" suppressHydrationWarning>
                        {hero.role && (
                            <div className="ns-reveal" suppressHydrationWarning>
                                <p className="ns-hero-location">{hero.role}</p>
                            </div>
                        )}
                        <h1 className="ns-hero-name ns-reveal" suppressHydrationWarning>
                            {(() => {
                                const nameParts = (hero.fullName || 'Domince Aseberos').split(' ');
                                const first = nameParts[0];
                                const last = nameParts.slice(1).join(' ');
                                return (
                                    <>
                                        <span className="name-first">{first}</span>
                                        {last && <span className="name-last">{last}</span>}
                                    </>
                                );
                            })()}
                        </h1>


                        <div className="ns-hero-actions ns-reveal">
                            {data.resume && (
                                <button 
                                    onClick={(e) => { e.preventDefault(); setIsResumeModalOpen(true); }}
                                    className="btn-primary ns-btn"
                                >
                                    View CV
                                </button>
                            )}
                            {data.resume && (
                                <a href={data.resume} download className="btn-ghost ns-btn">
                                    Download CV
                                </a>
                            )}
                            <a href="/projects" className="btn-ghost ns-btn">
                                Projects
                            </a>
                        </div>

                        {(hero.metrics || []).length > 0 && (
                            <div className="ns-metrics ns-reveal">
                                {hero.location && (
                                    <React.Fragment>
                                        <div className="ns-metric">
                                            <span className="ns-metric-val" style={{ fontSize: '1.2rem', marginTop: '0.1rem' }}>📍</span>
                                            <span className="ns-metric-lbl">{hero.location.split(',')[0]}</span>
                                        </div>
                                        <div className="ns-metric-div" />
                                    </React.Fragment>
                                )}
                                {hero.metrics.map((m, i) => {
                                    let displayValue = m.value;
                                    if (m.label && m.label.toLowerCase() === 'projects shipped') {
                                        displayValue = totalProjectsCount;
                                    }
                                    return (
                                        <React.Fragment key={i}>
                                            {i > 0 && <div className="ns-metric-div" />}
                                            <div className="ns-metric">
                                                <span className="ns-metric-val">{displayValue}<sup>{m.unit}</sup></span>
                                                <span className="ns-metric-lbl">{m.label}</span>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="ns-hero-card ns-reveal lit-content-block">
                        <ProfileMorphCard realSrc={humanPortrait} animeSrc={animePortrait} alt="Domince portrait" />
                    </div>
                </div>
            </section>



            {/* ══ ABOUT ════════════════════════════════════════════════════ */}
            <section className="ns-section" id="about">
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '10vh' }}>
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>About</p>
                <div className="ns-about-grid">
                    <div className="ns-about-main lit-content-block lit-transparent">
                        <h2 className="ns-section-heading ns-reveal">
                            {about.heading || 'Engineering'}{' '}
                            <span className="ns-accent">{about.headingAccent || 'Digital Poetry'}</span>
                        </h2>
                        {about.intro && (
                            <LyricsScrubText 
                                text={about.intro} 
                                highlights={['Computer', 'Science', 'full-stack', 'engineering', 'mobile', 'apps', 'motion-heavy', 'interfaces', 'AI/ML', 'software']} 
                            />
                        )}
                        {/* Philosophy Cards will be rendered outside the grid below */}
                    </div>
                    
                    {/* Socials Column */}
                    {socials.length > 0 && (
                        <aside className="ns-about-sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <div className="ns-reveal lit-content-block lit-transparent">
                                <p className="ui-sub-label" style={{ marginBottom: '1.25rem', letterSpacing: '0.22em' }}>Connect</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                                    {socials.map((link) => (
                                        <a key={link.label} href={link.href}
                                            target={link.external ? '_blank' : '_self'}
                                            rel={link.external ? 'noopener noreferrer' : ''}
                                            className="ns-social-link" style={{ fontSize: '1.5rem', color: 'var(--ns-link-color)', display: 'inline-block' }} title={link.label}
                                            onMouseEnter={(e) => { 
                                                gsap.to(e.currentTarget, {
                                                    y: -6,
                                                    scale: 1.25,
                                                    rotation: (Math.random() - 0.5) * 20,
                                                    color: 'var(--accent-color)',
                                                    duration: 0.35,
                                                    ease: 'back.out(3)'
                                                });
                                            }}
                                            onMouseLeave={(e) => { 
                                                gsap.to(e.currentTarget, {
                                                    y: 0,
                                                    scale: 1,
                                                    rotation: 0,
                                                    color: 'var(--ns-link-color)',
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
                </div>
                
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '10vh' }}>
                    <div className="ns-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                        <div style={{ flex: '1 1 400px' }}>
                            <h2 className="ns-section-heading">
                                How I <span className="ns-accent">Build</span>
                            </h2>
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

            {/* ══ RECENT PROJECTS ══════════════════════════════════════════ */}
            {projects.length > 0 && (
                <section className="ns-section" id="projects">
                    <div className="ns-projects-header ns-reveal">
                        <div>
                            <p className="ui-sub-label ns-section-label">Selected Work</p>
                            <h2 className="ns-section-heading">Projects</h2>
                        </div>
                        <a href="/projects" className="ns-view-all">View All →</a>
                    </div>
                    <div className="ns-projects-grid">
                        {projects.map((p) => (
                            <a key={p.id} href={`/projects/${p.id}`} className="ns-project-card ns-reveal lit-content-block">
                                {(p.mainImage || p.desktopImage) && !isPlaceholderImage(p.mainImage || p.desktopImage) ? (
                                    <div className="ns-project-img-wrap">
                                        <img src={p.mainImage || p.desktopImage} alt={p.title} className="ns-project-img" loading="lazy" />
                                    </div>
                                ) : (
                                    <div className="ns-project-img-placeholder">
                                        <span>{p.projectType || 'Case Study'}</span>
                                        <strong>{p.title}</strong>
                                    </div>
                                )}
                                <div className="ns-project-info">
                                    <div className="ns-project-meta">
                                        <span className="ui-sub-label ns-project-type">{p.projectType}</span>
                                        <span className="ns-project-arrow">↗</span>
                                    </div>
                                    <h3 className="ns-project-title">{p.title}</h3>
                                    <p className="ns-project-desc ui-body-copy">{p.shortDescription}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* ══ PINNED POST ══════════════════════════════════════════════ */}
            <PinnedFeedPost />

            {/* ══ TECH STACK ═══════════════════════════════════════════════ */}
            {techStack.length > 0 && (
                <section className="ns-section" id="stack">
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Technical Skills</p>
                    <h2 className="ns-section-heading ns-reveal">Technology Stack</h2>
                    <div className="ns-stack-grid">
                        {techStack.map((group) => (
                            <div key={group.group} className="ns-stack-group ns-reveal lit-content-block lit-transparent">
                                <h3 className="ns-stack-group-title">{group.group}</h3>
                                <div className="ns-pill-group">
                                    {(group.items || []).map((item) => {
                                        const Icon = getTechIcon(item);
                                        return (
                                            <div key={item} className="ns-tech-item ns-tech-reveal">
                                                {Icon && (
                                                    <div className="ns-tech-icon" data-tech={item.toLowerCase().replace(/\s+/g, '-')}>
                                                        {Icon}
                                                    </div>
                                                )}
                                                <span className="ns-pill" style={{ textAlign: 'center', width: 'max-content' }}>
                                                    {item}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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

            {/* ══ CONTACT ══════════════════════════════════════════════════ */}
            <section className="ns-contact-section" id="contact">
                <div className="ns-contact-header lit-content-block lit-transparent">
                    <p className="ui-sub-label ns-section-label ns-reveal" suppressHydrationWarning>Contact</p>
                    <h2 className="ns-section-heading ns-reveal">{contact.heading || "Open to Opportunities"}</h2>
                    {contact.subtext && (
                        <p className="ui-body-copy ns-contact-sub ns-reveal" suppressHydrationWarning>{contact.subtext}</p>
                    )}
                    <div className="ns-contact-cta-wrapper ns-reveal" style={{ position: 'relative', display: 'inline-block', marginTop: '10rem' }}>
                        <img 
                            src="/assets/GIF/tobe-sleep.gif" 
                            alt="toby sleeping" 
                            className="ns-cat-sleep-vid" 
                            style={{ opacity: theme === 'dark' ? 1 : 0 }} 
                        />
                        <img 
                            src="/assets/GIF/tobe-peek.gif" 
                            alt="cat peeking" 
                            className="ns-cat-peek" 
                            style={{ opacity: theme === 'light' ? 1 : 0 }} 
                        />
                        <a href="/contact" className="btn-primary ns-contact-cta" style={{ margin: 0, position: 'relative', zIndex: 2 }}>
                            Start a Conversation
                        </a>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
            <footer className="ns-footer" style={{ position: 'relative' }}>
                <div className="ns-footer-inner">
                    <div className="ns-footer-left">
                        <p className="ns-footer-name">Domince Aseberos</p>
                        <p className="ns-footer-role">{hero.role || 'Full Stack Developer'}</p>
                    </div>
                    <nav className="ns-footer-links" aria-label="Footer navigation">
                        <a href="/projects" className="ns-footer-link">Projects</a>
                        <a href="/contact" className="ns-footer-link">Contact</a>
                        {hero.githubUrl && (
                            <a href={hero.githubUrl} target="_blank" rel="noopener noreferrer" className="ns-footer-link">GitHub</a>
                        )}
                        {hero.linkedinUrl && (
                            <a href={hero.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ns-footer-link">LinkedIn</a>
                        )}
                        {socials.filter(s => s.href && !['EMAIL', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'].includes(s.label.toUpperCase()) && !s.href.match(/facebook\.com$|instagram\.com$/)).slice(0, 3).map(s => (
                            <a key={s.label} href={s.href} target={s.external ? '_blank' : '_self'} rel="noopener noreferrer" className="ns-footer-link">{s.label}</a>
                        ))}
                    </nav>
                    <p className="ns-footer-copy">© {new Date().getFullYear()} Domince Aseberos · Tagum City, Philippines</p>
                </div>
            </footer>

            <DocViewerModal 
                isOpen={isResumeModalOpen} 
                onClose={() => setIsResumeModalOpen(false)} 
                docUrl={data.resume} 
                title="Curriculum Vitae"
            />
        </div>
    );
});

NarrativeSection.displayName = 'NarrativeSection';
export default NarrativeSection;
