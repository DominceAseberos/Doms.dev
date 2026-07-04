import React, { forwardRef, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fetchAboutData } from '../../../shared/aboutService';
import { fetchPortfolioData } from '../../../shared/portfolioService';
import portfolioDataDefault from '../../../data/portfolioData.json';
import aboutDataDefault from '../../../data/aboutData.json';
import PinnedFeedPost from './PinnedFeedPost';
import DocViewerModal from '../../../components/DocViewerModal';
import useLoadingStore from '../../../store/useLoadingStore';
import useLogoStore from '../../../store/useLogoStore';
import useThemeStore from '../../../store/useThemeStore';
import AnimatedDivider from './ui/AnimatedDivider';

import useScrubReveal from '../hooks/useScrubReveal';
import HeroSection from './sections/HeroSection';
import AboutMeSection from './sections/AboutMeSection';
import ProjectsSection from './sections/ProjectsSection';
import TechStackSection from './sections/TechStackSection';
import ContactSection from './sections/ContactSection';

import './NarrativeSection.css';
import './TechHoverPhysics.css';

const NarrativeSection = forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const stripesRef = useRef([]);
    
    // Shared GSAP timeline: DOMINCE at t=0, ASEBEROS at t=NAME_DUR — both on one timeline
    // PAUSED initially so it waits for the loading screen (curtains) to finish!
    const nameTimeline = useRef(gsap.timeline({ paused: true })).current;
    
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
        
        // Start the handwriting animation with a slight delay so it draws AS the curtains open
        setTimeout(() => nameTimeline.play(), 500);

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
    }, [isLoading, nameTimeline]);

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
            .catch(() => {/* keep bundled default */ })
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
            .catch(() => {/* keep bundled default */ });
    }, []);

    const addStripe = (el) => {
        if (el && !stripesRef.current.includes(el)) stripesRef.current.push(el);
    };

    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

    // ── Destructure with safe fallbacks ───────────────────────────────────
    const hero = data.hero || {};
    const about = data.about || {};
    const techStack = data.techStack || [];
    const contact = data.contact || {};
    const socials = data.socials || [];

    const STRIPE_COUNT = 20;

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section" suppressHydrationWarning>

            {/* ══ STRIPE OVERLAY — fixed full-viewport, removed after animation ══ */}
            <div className="ns-stripes-overlay" aria-hidden>
                {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
                    <div key={i} ref={addStripe} className="ns-stripe" style={{ height: `${100 / STRIPE_COUNT}%` }} />
                ))}
            </div>

            {/* ══ SVG FILTERS ══════════════════════════════════════════════════════ */}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
                <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            <HeroSection 
                ref={heroRef} 
                hero={hero} 
                resumeUrl={data.resume} 
                totalProjectsCount={totalProjectsCount} 
                nameTimeline={nameTimeline} 
                onOpenResume={() => setIsResumeModalOpen(true)} 
            />

            <AboutMeSection 
                about={about} 
                socials={socials} 
            />

            <AnimatedDivider />

            <ProjectsSection 
                projects={projects} 
            />

            <TechStackSection 
                techStack={techStack} 
            />

            <AnimatedDivider />

            <PinnedFeedPost />

            <ContactSection 
                contact={contact} 
                theme={theme} 
            />

            <DocViewerModal
                isOpen={isResumeModalOpen}
                onClose={() => setIsResumeModalOpen(false)}
                docUrl={data.resume}
                title="Curriculum Vitae"
            />
        </div>
    );
});

export default NarrativeSection;
