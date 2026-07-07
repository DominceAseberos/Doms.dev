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

import firstSvg from '../../../assets/1st.svg?url';
import secondSvg from '../../../assets/2nd.svg?url';
import thirdSvg from '../../../assets/3rd.svg?url';
import fourthSvg from '../../../assets/4th.svg?url';

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
    const svg1Ref = useRef(null);
    const svg2Ref = useRef(null);
    const svg3Ref = useRef(null);
    const svg4Ref = useRef(null);

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

    // ── Animate Background SVGs in strict sequence ────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true, // instant scroll lock
                }
            });

            // Using linear gradient mask for a soft top-to-bottom wipe
            const mask1 = { val: -10 };
            const mask2 = { val: -10 };
            const mask3 = { val: -10 };
            const mask4 = { val: -10 };

            const updateMask = (ref, obj) => () => {
                if (!ref.current) return;
                gsap.set(ref.current, {
                    WebkitMaskImage: `linear-gradient(to bottom, black ${obj.val}%, transparent ${obj.val + 10}%)`,
                    maskImage: `linear-gradient(to bottom, black ${obj.val}%, transparent ${obj.val + 10}%)`
                });
            };

            // Init fully hidden
            updateMask(svg1Ref, mask1)();
            updateMask(svg2Ref, mask2)();
            updateMask(svg3Ref, mask3)();
            updateMask(svg4Ref, mask4)();

            // Strict sequence mapping to scroll
            tl.to(mask1, { val: 110, duration: 1, ease: 'none', onUpdate: updateMask(svg1Ref, mask1) })
                .to(mask2, { val: 110, duration: 2, ease: 'none', onUpdate: updateMask(svg2Ref, mask2) })
                .to(mask3, { val: 110, duration: 1, ease: 'none', onUpdate: updateMask(svg3Ref, mask3) })
                .to({}, { duration: 0.5 }) // <--- DELAY before 4th SVG
                .to(mask4, { val: 110, duration: 1, ease: 'none', onUpdate: updateMask(svg4Ref, mask4) })
                .to({}, { duration: 1.0 }); // Reduced from 1.5 to keep the math balanced!

        }, containerRef);
        return () => ctx.revert();
    }, []);

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
    
    // Change this value to adjust the visibility of all 4 background SVG waves
    const bgSvgFilter = 'brightness(3.5)';

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section" style={{ position: 'relative' }} suppressHydrationWarning>

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

            <div style={{ position: 'relative', width: '100%', zIndex: -1 }}>
                <img ref={svg1Ref} src={firstSvg} alt="" className="bg-svg-line" style={{ position: 'absolute', bottom: '-90vh', right: '-5vw', width: '200vw', minWidth: '1200px', opacity: 1, filter: bgSvgFilter, pointerEvents: 'none' }} />
            </div>

            <AboutMeSection
                about={about}
                socials={socials}
            />

            <div style={{ position: 'relative', width: '100%', zIndex: -1 }}>
                <img ref={svg2Ref} src={secondSvg} alt="" className="bg-svg-line" style={{ position: 'absolute', top: '-190vh', left: '-5vw', width: '20vw', minWidth: '300px', opacity: 1, filter: bgSvgFilter, pointerEvents: 'none' }} />
            </div>

            <ProjectsSection
                projects={projects}
            />

            <div style={{ position: 'relative', width: '100%', zIndex: -1 }}>
                <img ref={svg3Ref} src={thirdSvg} alt="" className="bg-svg-line" style={{ position: 'absolute', top: '-160vh', right: '5vw', width: '120vw', minWidth: '1100px', opacity: 1, filter: bgSvgFilter, pointerEvents: 'none' }} />
            </div>

            <TechStackSection
                techStack={techStack}
                compact={true}
            />

            <PinnedFeedPost />

            <div style={{ position: 'relative', width: '100%', zIndex: -1 }}>
                <img ref={svg4Ref} src={fourthSvg} alt="" className="bg-svg-line" style={{ position: 'absolute', bottom: '10vh', left: '0', top: '-120vh', width: '90vw', minWidth: '800px', opacity: 1, filter: bgSvgFilter, pointerEvents: 'none' }} />
            </div>

            <ContactSection
                contact={contact}
                socials={socials}
                projects={projects}
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
