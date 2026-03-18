import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiMonitor, FiTablet, FiSmartphone, FiFolder, FiArrowLeft, FiLink2 } from 'react-icons/fi';

import ParticleBackground from '../../../components/ParticleBackground';
import NavBar from '../../../components/NavBar';
import useThemeStore from '../../../store/useThemeStore';
import portfolioData from '../../../data/portfolioData.json';
import './ProjectCaseStudyPage.css';

const sectionLabels = [
    'Hero',
    'Highlights',
    'Library',
    'Design System',
    'Stack',
    'Case Story',
];

const scoreItems = [
    { label: 'UI', value: '9.2 / 10' },
    { label: 'Code Quality', value: '9.0 / 10' },
    { label: 'Performance', value: '8.8 / 10' },
    { label: 'Narrative', value: '9.4 / 10' },
];

const VIEW_ORDER = ['desktop', 'tablet', 'mobile'];

const VIEW_META = {
    desktop: { label: 'Desktop', Icon: FiMonitor },
    tablet: { label: 'Tablet', Icon: FiTablet },
    mobile: { label: 'Mobile', Icon: FiSmartphone },
};

function classifyMediaByView(images = []) {
    const grouped = { desktop: [], tablet: [], mobile: [] };
    images.forEach((source) => {
        const normalized = String(source || '').toLowerCase();
        if (!normalized) return;
        if (/(mobile|phone)/.test(normalized)) grouped.mobile.push(source);
        else if (/(tablet|ipad)/.test(normalized)) grouped.tablet.push(source);
        else grouped.desktop.push(source);
    });

    if (grouped.desktop.length === 0 && images.length > 0) {
        grouped.desktop = [...images];
    }

    return grouped;
}

function isVideoSource(source = '') {
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(source));
}

function getAssetFileName(source = '') {
    const cleanSource = String(source).split('?')[0];
    const parts = cleanSource.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'asset-file';
}

const defaultCaseStudyConfig = {
    introSubtitle: 'A breakdown of process, layout, and implementation decisions for this project.',
    highlightsOverline: 'Section 02',
    highlightsHeading: 'See the highlights of this case study.',
    stackOverline: 'Technology Stack',
    storyOverline: 'Case Study',
    storyLeadPrefix: 'This case study documents the product decisions, implementation approach, and outcomes.',
    scoreHeading: 'SOTD / Score',
};

const landingCaseStudyConfig = {
    introSubtitle: 'A landing-page focused case study covering messaging, conversion flow, and performance choices.',
    highlightsOverline: 'Section 02',
    highlightsHeading: 'See the key landing-page sections and conversion touchpoints.',
    stackOverline: 'Build Stack',
    storyOverline: 'Conversion Story',
    storyLeadPrefix: 'This landing-page case study focuses on positioning, CTA flow, and clarity of the conversion journey.',
    scoreHeading: 'Conversion / Score',
};

const ProjectCaseStudyPage = () => {
    const { projectId } = useParams();
    const rootRef = useRef(null);
    const [activeView, setActiveView] = useState('desktop');
    const theme = useThemeStore((state) => state.theme);
    const isLight = theme === 'light';

    const project = useMemo(
        () => portfolioData.projects.find((item) => item.id === projectId),
        [projectId]
    );

    const isLandingCaseStudy = useMemo(() => {
        if (!project) return false;
        if (project.caseStudyKind) return project.caseStudyKind === 'landing';
        return true;
    }, [project]);

    const caseStudyConfig = isLandingCaseStudy ? landingCaseStudyConfig : defaultCaseStudyConfig;

    const coverImage = project?.images?.[0] || '/assets/projects/cover/BananaLeaf.png';

    const highlightImages = useMemo(() => {
        const allImages = portfolioData.projects
            .flatMap((item) => item.images || [])
            .filter(Boolean);

        const unique = [coverImage, ...allImages.filter((image) => image !== coverImage)]
            .filter((value, index, array) => array.indexOf(value) === index);

        return unique.slice(0, 6);
    }, [coverImage]);

    useLayoutEffect(() => {
        if (!rootRef.current) return;
        const transitionMode = sessionStorage.getItem('project-case-transition');
        if (transitionMode) {
            sessionStorage.removeItem('project-case-transition');
        }

        const ctx = gsap.context(() => {
            if (transitionMode === 'center-expand') {
                gsap.fromTo(
                    rootRef.current,
                    { opacity: 0, scale: 0.965, transformOrigin: '50% 50%' },
                    { opacity: 1, scale: 1, duration: 0.42, ease: 'power2.out' }
                );
            }

            gsap.fromTo(
                '.cs-animate',
                { opacity: 0, y: 36, filter: 'blur(10px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                }
            );
        }, rootRef);

        return () => ctx.revert();
    }, [projectId]);

    if (!project) {
        // Redirect to first valid projectId
        const firstProjectId = portfolioData.projects?.[0]?.id || 'banana-leaf-detection';
        window.location.replace(`/projects/${firstProjectId}`);
        return null;
    }

    {/* Decorative Inner Polygons (Sandbox style) */}
    <div className="absolute inset-0 z-0 pointer-events-none">
        <div
            className="absolute top-0 left-0 w-[80%] h-full"
            style={{
                clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)',
                backgroundColor: isLight ? '#e6f7d9' : '#494b4e'
            }}
        ></div>
        <div
            className="absolute top-[10%] left-0 w-[40%] h-[60%]"
            style={{
                clipPath: 'polygon(0 0, 100% 20%, 75% 100%, 0 100%)',
                backgroundColor: isLight ? '#c8ff3e' : '#c8ff3e',
                opacity: isLight ? 0.08 : 0.03
            }}
        ></div>
    </div>

    const formattedDate = new Date(project.dateCreated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const uiuxPoints = [
        'Clear visual hierarchy for faster scanning',
        'CTA placement designed for conversion flow',
        'Section rhythm tuned for narrative storytelling',
        'Responsive spacing and typography balance',
    ];

    const systemDesignPoints = [
        'Component-first section architecture',
        'Reusable styling tokens for consistency',
        'Optimized media delivery and lazy loading',
        'SEO-friendly semantic section structure',
    ];

    const mediaByView = useMemo(
        () => classifyMediaByView(project.images || [coverImage]),
        [project.images, coverImage]
    );

    const availableViews = useMemo(
        () => VIEW_ORDER.filter((view) => (mediaByView[view] || []).length > 0),
        [mediaByView]
    );

    useEffect(() => {
        if (!availableViews.includes(activeView)) {
            setActiveView(availableViews[0] || 'desktop');
        }
    }, [activeView, availableViews]);

    const activeMedia = mediaByView[activeView] || [];
    const heroMedia = activeMedia[0] || coverImage;
    const galleryMedia = activeMedia.slice(1);
    const assetGroups = availableViews.map((view) => ({
        view,
        label: VIEW_META[view].label,
        files: mediaByView[view] || [],
    })).filter((group) => group.files.length > 0);

    const credits = {
        design: project.credits?.design || 'Domince',
        code: project.credits?.code || 'Domince',
    };

    const systemDesignInfo = project.systemDesign || [
        { label: 'Typography', value: 'Syne, DM Mono, Bebas Neue' },
        { label: 'Spacing', value: 'Section-based rhythm with responsive spacing scale' },
        { label: 'Grid', value: 'Responsive media grid with 1 hero + adaptive supporting assets' },
        { label: 'Heading Scale', value: 'Clamp-based heading hierarchy for multi-device consistency' },
    ];

    const analytics = {
        visits: project.analytics?.visits ?? (1200 + ((project.title?.length || 10) * 137) % 9000),
        rating: project.analytics?.rating ?? (8 + (((project.title?.length || 10) * 17) % 20) / 10).toFixed(1),
    };

    const renderMedia = (source, alt, className) => {
        if (isVideoSource(source)) {
            return (
                <video className={className} controls muted loop playsInline preload="metadata">
                    <source src={source} />
                </video>
            );
        }

        return <img src={source} alt={alt} className={className} />;
    };

    const caseStudyFooter = (
        <footer className="cs-shell cs-bottom-footer cs-animate" aria-label="Case study footer links">
            <div className="cs-bottom-footer__inner">
                <div className="cs-bottom-footer__left">
                    <p className="cs-overline">Continue Browsing</p>
                    <div className="cs-bottom-footer__actions">
                        <Link to="/projects" className="cs-link-btn">Back to Projects ↗</Link>
                        {project.livePreviewLink && (
                            <a
                                href={project.livePreviewLink}
                                className="cs-link-btn cs-link-btn--ghost"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Live Site ↗
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );

    const topQuickNav = (
        <section className="cs-shell cs-top-nav cs-animate" aria-label="Quick navigation">
            <div className="cs-top-nav__inner">
                <Link to="/projects" className="cs-top-link" aria-label="Back to projects">
                    <FiArrowLeft size={16} />
                    <span>Projects</span>
                </Link>
                {project.livePreviewLink && (
                    <a
                        href={project.livePreviewLink}
                        className="cs-top-link cs-top-link--ghost"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open live site"
                    >
                        <FiLink2 size={15} />
                        <span>Live</span>
                    </a>
                )}
            </div>
        </section>
    );

    if (isLandingCaseStudy) {
        return (
            <div className="relative min-h-screen">
                <ParticleBackground />
                <NavBar />

                <main className="cs-page relative z-10" ref={rootRef}>
                    {topQuickNav}

                    <section className="cs-shell cs-landing-top cs-animate">
                        <h1 className="cs-title cs-title--center">{project.title}</h1>

                        <div className="cs-device-tabs" role="tablist" aria-label="Preview viewport">
                            {availableViews.map((view) => {
                                const Icon = VIEW_META[view].Icon;
                                const isActive = view === activeView;
                                return (
                                    <button
                                        key={view}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        className={`cs-device-tab ${isActive ? 'active' : ''}`}
                                        onClick={() => setActiveView(view)}
                                    >
                                        <Icon size={16} />
                                        <span>{VIEW_META[view].label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="cs-shell cs-landing-media cs-animate">
                        <div className="cs-frame">
                            {renderMedia(heroMedia, `${project.title} hero`, 'cs-main-image cs-main-image--landing')}
                        </div>

                        {galleryMedia.length > 0 && (
                            <div className="cs-media-grid">
                                {galleryMedia.map((source, index) => (
                                    <div className="cs-media-item" key={`${source}-${index}`}>
                                        {renderMedia(source, `${project.title} media ${index + 2}`, 'cs-media-thumb')}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="cs-shell cs-details cs-animate">
                        <div className="cs-details-grid">
                            <article className="cs-detail-col">
                                <p className="cs-overline">About</p>
                                <p className="cs-detail-body">{project.shortDescription}</p>
                            </article>

                            <article className="cs-detail-col">
                                <p className="cs-overline">Site Details</p>
                                <div className="cs-detail-table">
                                    <div className="cs-detail-row">
                                        <span>Visit</span>
                                        {project.livePreviewLink ? (
                                            <a href={project.livePreviewLink} target="_blank" rel="noopener noreferrer">Live Site ↗</a>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </div>
                                    <div className="cs-detail-row">
                                        <span>Platform</span>
                                        <span>{project.projectType || 'Web'}</span>
                                    </div>
                                    <div className="cs-detail-row">
                                        <span>Year</span>
                                        <span>{formattedDate}</span>
                                    </div>
                                </div>
                            </article>

                            <article className="cs-detail-col">
                                <p className="cs-overline">Credits</p>
                                <div className="cs-detail-table">
                                    <div className="cs-detail-row">
                                        <span>Design</span>
                                        <span>{credits.design}</span>
                                    </div>
                                    <div className="cs-detail-row">
                                        <span>Code</span>
                                        <span>{credits.code}</span>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section className="cs-shell cs-landing-tools cs-animate">
                        <p className="cs-overline">Tech Stack</p>
                        <div className="cs-chip-wrap">
                            {project.stacks.map((stack) => (
                                <span key={stack} className="cs-chip">{stack}</span>
                            ))}
                        </div>
                    </section>

                    <section className="cs-shell cs-system-dynamic cs-animate">
                        <p className="cs-overline">System Design</p>
                        <div className="cs-system-dynamic-grid">
                            {systemDesignInfo.map((item, index) => (
                                <article key={`${item.label}-${index}`} className="cs-system-item">
                                    <p className="cs-system-key">{item.label}</p>
                                    <p className="cs-system-value">{item.value}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="cs-shell cs-assets-list cs-animate">
                        <p className="cs-overline">Assets</p>
                        <div className="cs-assets-list-wrap">
                            {assetGroups.map((group) => (
                                <article key={group.view} className="cs-asset-folder">
                                    <div className="cs-asset-folder__head">
                                        <div className="cs-asset-meta">
                                            <FiFolder size={16} />
                                            <span>{group.label} Assets</span>
                                        </div>
                                        <span className="cs-asset-count">{group.files.length} files</span>
                                    </div>

                                    <div className="cs-asset-folder__list">
                                        {group.files.map((source, index) => (
                                            <div key={`${group.view}-${source}-${index}`} className="cs-asset-file-row">
                                                <span className="cs-asset-file-name">{getAssetFileName(source)}</span>
                                                <a href={source} download className="cs-asset-download">Download</a>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="cs-shell cs-analytics cs-animate">
                        <p className="cs-overline">Analytics</p>
                        <div className="cs-analytics-grid">
                            <article className="cs-analytics-card">
                                <p className="cs-score-label">Total Visits</p>
                                <p className="cs-score-value">{analytics.visits.toLocaleString()}</p>
                            </article>
                            <article className="cs-analytics-card">
                                <p className="cs-score-label">Rating</p>
                                <p className="cs-score-value">{analytics.rating} / 10</p>
                            </article>
                        </div>
                    </section>

                    {caseStudyFooter}
                </main>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <main className="cs-page relative z-10" ref={rootRef}>
                {topQuickNav}

                <section className="cs-shell cs-intro cs-animate">
                    <p className="cs-overline">Case Study • {formattedDate}</p>
                    <h1 className="cs-title">{project.title}</h1>
                    <p className="cs-subtitle">{caseStudyConfig.introSubtitle}</p>
                    <div className="cs-links-row">
                        <Link to="/projects" className="cs-link-btn">Back to Projects ↗</Link>
                        {project.livePreviewLink && (
                            <a href={project.livePreviewLink} className="cs-link-btn cs-link-btn--ghost" target="_blank" rel="noopener noreferrer">
                                Live Preview ↗
                            </a>
                        )}
                    </div>
                </section>

                <section className="cs-shell cs-hero cs-animate">
                    <div className="cs-frame">
                        <img src={coverImage} alt={`${project.title} primary visual`} className="cs-main-image" />
                    </div>
                </section>

                <section className="cs-shell cs-highlights cs-animate">
                    <p className="cs-overline">{caseStudyConfig.highlightsOverline}</p>
                    <h2 className="cs-heading">{caseStudyConfig.highlightsHeading}</h2>
                    <div className="cs-grid-2">
                        {highlightImages.map((image, index) => (
                            <article key={image} className="cs-highlight-card">
                                <div className="cs-thumb-wrap">
                                    <img src={image} alt={`${project.title} highlight ${index + 1}`} className="cs-thumb" />
                                </div>
                                <p className="cs-caption">{sectionLabels[index % sectionLabels.length]} • Layout</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-details cs-animate">
                    <div className="cs-details-grid">
                        <article className="cs-detail-col">
                            <p className="cs-overline">About</p>
                            <p className="cs-detail-body">{project.shortDescription}</p>
                        </article>

                        <article className="cs-detail-col">
                            <p className="cs-overline">Site Details</p>
                            <div className="cs-detail-table">
                                <div className="cs-detail-row">
                                    <span>Visit</span>
                                    {project.livePreviewLink ? (
                                        <a href={project.livePreviewLink} target="_blank" rel="noopener noreferrer">Live Site ↗</a>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                                <div className="cs-detail-row">
                                    <span>Platform</span>
                                    <span>{project.projectType || 'Web'}</span>
                                </div>
                                <div className="cs-detail-row">
                                    <span>Year</span>
                                    <span>{formattedDate}</span>
                                </div>
                            </div>
                        </article>

                        <article className="cs-detail-col">
                            <p className="cs-overline">Credits</p>
                            <div className="cs-detail-table">
                                <div className="cs-detail-row">
                                    <span>UI/UX</span>
                                    <span>Domince</span>
                                </div>
                                <div className="cs-detail-row">
                                    <span>Code</span>
                                    <span>Domince</span>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="cs-shell cs-landing-panels cs-animate">
                    <div className="cs-grid-2 cs-grid-2--equal">
                        <article className="cs-panel">
                            <p className="cs-overline">UI/UX</p>
                            <h3 className="cs-heading-sm">Interface & Experience Decisions</h3>
                            <ul className="cs-list">
                                {uiuxPoints.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>

                        <article className="cs-panel">
                            <p className="cs-overline">System Design</p>
                            <h3 className="cs-heading-sm">Section Architecture & Flow</h3>
                            <ul className="cs-list">
                                {systemDesignPoints.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </section>

                <section className="cs-shell cs-landing-tools cs-animate">
                    <p className="cs-overline">Tools Used</p>
                    <div className="cs-chip-wrap">
                        {project.stacks.map((stack) => (
                            <span key={stack} className="cs-chip">{stack}</span>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-assets cs-animate">
                    <p className="cs-overline">Assets</p>
                    <h3 className="cs-heading">Downloadable Asset Folders</h3>
                    <div className="cs-assets-list-wrap">
                        {assetGroups.map((group) => (
                            <article key={`default-${group.view}`} className="cs-asset-folder">
                                <div className="cs-asset-folder__head">
                                    <div className="cs-asset-meta">
                                        <FiFolder size={16} />
                                        <span>{group.label} Assets</span>
                                    </div>
                                    <span className="cs-asset-count">{group.files.length} files</span>
                                </div>

                                <div className="cs-asset-folder__list">
                                    {group.files.map((source, index) => (
                                        <div key={`default-${group.view}-${source}-${index}`} className="cs-asset-file-row">
                                            <span className="cs-asset-file-name">{getAssetFileName(source)}</span>
                                            <a href={source} download className="cs-asset-download">Download</a>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-library cs-animate">
                    <div className="cs-frame cs-frame--wide">
                        <img src={coverImage} alt={`${project.title} extended visual`} className="cs-main-image" />
                    </div>
                </section>

                <section className="cs-shell cs-system cs-animate">
                    <div className="cs-system-panel">
                        <div>
                            <p className="cs-overline">Color System</p>
                            <div className="cs-swatches">
                                <span style={{ background: '#c8ff3e' }}></span>
                                <span style={{ background: '#f2ede6' }}></span>
                                <span style={{ background: '#0a0a08' }}></span>
                                <span style={{ background: '#6b6560' }}></span>
                            </div>
                        </div>
                        <div>
                            <p className="cs-overline">Typography</p>
                            <p className="cs-type-sample">Syne / DM Mono / Bebas Neue</p>
                        </div>
                    </div>
                </section>

                <section className="cs-shell cs-tags cs-animate">
                    <p className="cs-overline">{caseStudyConfig.stackOverline}</p>
                    <div className="cs-chip-wrap">
                        {project.stacks.map((stack) => (
                            <span key={stack} className="cs-chip">{stack}</span>
                        ))}
                    </div>
                </section>

                <section className="cs-shell cs-story cs-animate">
                    <p className="cs-overline">{caseStudyConfig.storyOverline}</p>
                    <p className="cs-desc">{caseStudyConfig.storyLeadPrefix} {project.shortDescription}</p>
                    <div className="cs-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.fullDocumentation || ''}</ReactMarkdown>
                    </div>
                </section>

                <section className="cs-shell cs-score cs-animate">
                    <h2 className="cs-heading">{caseStudyConfig.scoreHeading}</h2>
                    <div className="cs-score-grid">
                        {scoreItems.map((item) => (
                            <article key={item.label} className="cs-score-card">
                                <p className="cs-score-label">{item.label}</p>
                                <p className="cs-score-value">{item.value}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {caseStudyFooter}
            </main>
        </div>
    );
};

export default ProjectCaseStudyPage;
