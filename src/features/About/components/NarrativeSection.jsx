import React, { forwardRef, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fetchAboutData } from '../../../shared/aboutService';
import { fetchPortfolioData } from '../../../shared/portfolioService';
import portfolioDataDefault from '../../../data/portfolioData.json';
import aboutDataDefault from '../../../data/aboutData.json';
import PinnedFeedPost from './PinnedFeedPost';
import DocViewerModal from '../../../components/DocViewerModal';
import SectionProgressIndicator from '../../../components/SectionProgressIndicator';
import useLoadingStore from '../../../store/useLoadingStore';
import useLogoStore from '../../../store/useLogoStore';
import useThemeStore from '../../../store/useThemeStore';

import firstSvg from '../../../assets/1st.svg?url';
import secondSvg from '../../../assets/2nd.svg?url';
import thirdSvg from '../../../assets/3rd.svg?url';
import fourthSvg from '../../../assets/4th.svg?url';

import firstSvgMobile from '../../../assets/mobie-view-svg-flow/1st.svg?url';
import secondSvgMobile from '../../../assets/mobie-view-svg-flow/2nd.svg?url';
import thirdSvgMobile from '../../../assets/mobie-view-svg-flow/3rd.svg?url';
import fourthSvgMobile from '../../../assets/mobie-view-svg-flow/4th.svg?url';

import useScrubReveal from '../hooks/useScrubReveal';
import HeroSection from './sections/HeroSection';
import AboutMeSection from './sections/AboutMeSection';
import ProjectsSection from './sections/ProjectsSection';
import TechStackSection from './sections/TechStackSection';
import ContactSection from './sections/ContactSection';

import './NarrativeSection.css';
import './TechHoverPhysics.css';

const HOME_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'feed', label: 'Dev Log' },
  { id: 'contact', label: 'Contact' },
];

// ── EASY CONFIGURATION FOR BACKGROUND SVGS ─────────────────────────────────
// Tweak these values to adjust the SVGs without hunting through CSS or GSAP
export const SVG_CONFIG = {
    desktop: {
        // Durations control how fast each SVG draws relative to the whole page scroll
        duration1: 1.0,
        duration2: 2.0,
        duration3: 1.0,
        delayBefore4: 0.5,
        duration4: 1.0,
        opacity: 1.0, // Desktop opacity
    },
    mobile: {
        // 1st SVG (Hero Section)
        svg1: {
            zIndex: -1,
            opacity: 0.15,
            top: '-80vh',
            left: '50%',
            right: 'auto',
            width: '150vw',
            transform: 'translateX(-50%)',
            triggerStart: 'top',
            triggerEnd: '+=200', // scrub length
        },
        // 2nd SVG (About Section)
        svg2: {
            zIndex: -1,
            opacity: 0.15,
            top: '-125vh',
            left: '-22vw',
            right: 'auto',
            width: '110vw',
            transform: 'none',
            triggerStart: 'top 85%',
            triggerEnd: 'bottom 40%',
        },
        // 3rd SVG (Projects Section)
        svg3: {
            zIndex: -1,
            opacity: 0.15,
            top: '-80vh',
            left: '-40vw',
            right: 'auto',
            width: '110vw',
            transform: 'none',
            triggerStart: 'top 85%',
            triggerEnd: 'bottom 40%',
        },
        // 4th SVG (Tech Stack Section)
        svg4: {
            zIndex: -1,
            opacity: 0.15,
            top: '-90vh',
            left: '-5vw',
            right: 'auto',
            width: '110vw',
            transform: 'none',
            triggerStart: 'top 85%',
            triggerEnd: 'bottom 40%',
        }
    }
};
// ───────────────────────────────────────────────────────────────────────────

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

    // ── Animate Background SVGs ────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
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

            const mm = gsap.matchMedia();

            // Desktop: Strict sequence mapping to scroll
            mm.add("(min-width: 769px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                    }
                });

                tl.to(mask1, { val: 110, duration: SVG_CONFIG.desktop.duration1, ease: 'none', onUpdate: updateMask(svg1Ref, mask1) })
                    .to(mask2, { val: 110, duration: SVG_CONFIG.desktop.duration2, ease: 'none', onUpdate: updateMask(svg2Ref, mask2) })
                    .to(mask3, { val: 110, duration: SVG_CONFIG.desktop.duration3, ease: 'none', onUpdate: updateMask(svg3Ref, mask3) })
                    .to({}, { duration: SVG_CONFIG.desktop.delayBefore4 })
                    .to(mask4, { val: 110, duration: SVG_CONFIG.desktop.duration4, ease: 'none', onUpdate: updateMask(svg4Ref, mask4) })
                    .to({}, { duration: 1.0 });
            });

            // Mobile: Individual Scroll Triggers mapped to each SVG's position
            mm.add("(max-width: 768px)", () => {
                const setupMobileTrigger = (ref, maskObj, configKey, customTrigger) => {
                    const cfg = SVG_CONFIG.mobile[configKey];
                    gsap.to(maskObj, {
                        val: 110,
                        ease: 'none',
                        onUpdate: updateMask(ref, maskObj),
                        scrollTrigger: customTrigger || {
                            trigger: ref.current,
                            start: cfg.triggerStart,
                            end: cfg.triggerEnd,
                            scrub: true,
                        }
                    });
                };

                // SVG 1 is in the Hero section, so we scrub from the very top of the page
                setupMobileTrigger(svg1Ref, mask1, 'svg1', {
                    trigger: document.body,
                    start: SVG_CONFIG.mobile.svg1.triggerStart,
                    end: SVG_CONFIG.mobile.svg1.triggerEnd,
                    scrub: true,
                });

                setupMobileTrigger(svg2Ref, mask2, 'svg2');
                setupMobileTrigger(svg3Ref, mask3, 'svg3');
                setupMobileTrigger(svg4Ref, mask4, 'svg4');
            });

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

    // Dynamically adjust SVG color based on theme
    const bgSvgFilter = theme === 'dark' ? 'invert(1)' : 'brightness(3.5)';

    return (
        <div ref={(el) => { containerRef.current = el; if (ref) ref.current = el; }} className="narrative-section" suppressHydrationWarning
            style={{
                position: 'relative',
                '--d-svg-opacity': SVG_CONFIG.desktop.opacity,
                '--m-svg1-opacity': SVG_CONFIG.mobile.svg1.opacity,
                '--m-svg2-opacity': SVG_CONFIG.mobile.svg2.opacity,
                '--m-svg3-opacity': SVG_CONFIG.mobile.svg3.opacity,
                '--m-svg4-opacity': SVG_CONFIG.mobile.svg4.opacity,
                '--m-svg1-top': SVG_CONFIG.mobile.svg1.top,
                '--m-svg1-left': SVG_CONFIG.mobile.svg1.left,
                '--m-svg1-right': SVG_CONFIG.mobile.svg1.right,
                '--m-svg1-width': SVG_CONFIG.mobile.svg1.width,
                '--m-svg1-transform': SVG_CONFIG.mobile.svg1.transform,

                '--m-svg2-top': SVG_CONFIG.mobile.svg2.top,
                '--m-svg2-left': SVG_CONFIG.mobile.svg2.left,
                '--m-svg2-right': SVG_CONFIG.mobile.svg2.right,
                '--m-svg2-width': SVG_CONFIG.mobile.svg2.width,
                '--m-svg2-transform': SVG_CONFIG.mobile.svg2.transform,

                '--m-svg3-top': SVG_CONFIG.mobile.svg3.top,
                '--m-svg3-left': SVG_CONFIG.mobile.svg3.left,
                '--m-svg3-right': SVG_CONFIG.mobile.svg3.right,
                '--m-svg3-width': SVG_CONFIG.mobile.svg3.width,
                '--m-svg3-transform': SVG_CONFIG.mobile.svg3.transform,

                '--m-svg4-top': SVG_CONFIG.mobile.svg4.top,
                '--m-svg4-left': SVG_CONFIG.mobile.svg4.left,
                '--m-svg4-right': SVG_CONFIG.mobile.svg4.right,
                '--m-svg4-width': SVG_CONFIG.mobile.svg4.width,
                '--m-svg4-transform': SVG_CONFIG.mobile.svg4.transform,
            }}>

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

            <div style={{ position: 'relative', width: '100%', zIndex: SVG_CONFIG.mobile.svg1.zIndex }}>
                <picture>
                    <source media="(max-width: 768px)" srcSet={firstSvgMobile} />
                    <img ref={svg1Ref} src={firstSvg} alt="" className="bg-svg-line ns-bg-svg-1" style={{ position: 'absolute', filter: bgSvgFilter, pointerEvents: 'none' }} />
                </picture>
            </div>

            <AboutMeSection
                about={about}
                socials={socials}
            />

            <div style={{ position: 'relative', width: '100%', zIndex: SVG_CONFIG.mobile.svg2.zIndex }}>
                <picture>
                    <source media="(max-width: 768px)" srcSet={secondSvgMobile} />
                    <img ref={svg2Ref} src={secondSvg} alt="" className="bg-svg-line ns-bg-svg-2" style={{ position: 'absolute', filter: bgSvgFilter, pointerEvents: 'none' }} />
                </picture>
            </div>

            <ProjectsSection
                projects={projects}
            />

            <div style={{ position: 'relative', width: '100%', zIndex: SVG_CONFIG.mobile.svg3.zIndex }}>
                <picture>
                    <source media="(max-width: 768px)" srcSet={thirdSvgMobile} />
                    <img ref={svg3Ref} src={thirdSvg} alt="" className="bg-svg-line ns-bg-svg-3" style={{ position: 'absolute', filter: bgSvgFilter, pointerEvents: 'none' }} />
                </picture>
            </div>

            <TechStackSection
                techStack={techStack}
                compact={true}
            />

            <PinnedFeedPost />

            <div style={{ position: 'relative', width: '100%', zIndex: SVG_CONFIG.mobile.svg4.zIndex }}>
                <picture>
                    <source media="(max-width: 768px)" srcSet={fourthSvgMobile} />
                    <img ref={svg4Ref} src={fourthSvg} alt="" className="bg-svg-line ns-bg-svg-4" style={{ position: 'absolute', filter: bgSvgFilter, pointerEvents: 'none' }} />
                </picture>
            </div>

            <ContactSection
                contact={contact}
                socials={socials}
                projects={projects}
                theme={theme}
            />

            <SectionProgressIndicator sections={HOME_SECTIONS} />

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
