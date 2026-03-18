import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { FiMonitor, FiTablet, FiSmartphone, FiArrowLeft, FiLink2 } from 'react-icons/fi';

import useThemeStore from '../../../store/useThemeStore';
import portfolioDataDefault from '../../../data/portfolioData.json';
import LandingPageTemplate from '../templates/LandingPageTemplate';
import CaseStudyTemplate from '../templates/CaseStudyTemplate';
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
    const { pathname } = useLocation();
    const rootRef = useRef(null);
    const [activeView, setActiveView] = useState('desktop');
    const isAdminPreview = pathname.startsWith('/admin/');
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(isAdminPreview);
    const theme = useThemeStore((state) => state.theme);
    
    // UPDATED: Sync from disk + localStorage in admin mode
    useEffect(() => {
        if (!isAdminPreview) return;
        
        const syncData = async () => {
            try {
                // 1. Fetch from disk (Vite dev server handles this)
                const res = await fetch('/src/data/portfolioData.json');
                const diskData = await res.json();
                
                // 2. Merge with localStorage draft (if any)
                const stored = localStorage.getItem('portfolioData');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setAdminData(parsed);
                } else {
                    setAdminData(diskData);
                }
            } catch (e) {
                console.error("Failed to sync admin data", e);
            } finally {
                setLoading(false);
            }
        };

        syncData();
    }, [isAdminPreview, projectId]);

    const project = useMemo(() => {
        const sourceData = isAdminPreview && adminData ? adminData : portfolioDataDefault;
        return sourceData.projects.find((item) => item.id === projectId);
    }, [projectId, adminData, isAdminPreview]);

    const isLandingCaseStudy = useMemo(() => {
        if (!project) return false;
        // Map to "Landing Page" category or caseStudyKind
        return project.projectType === 'Landing Page' || project.caseStudyKind === 'landing';
    }, [project]);

    const caseStudyConfig = isLandingCaseStudy ? landingCaseStudyConfig : defaultCaseStudyConfig;

    const coverImage = project?.mainImage || project?.images?.[0] || '/assets/projects/cover/BananaLeaf.png';

    const highlightImages = useMemo(() => {
        const sourceProjects = (isAdminPreview && adminData ? adminData : portfolioDataDefault).projects;
        const allImages = sourceProjects
            .flatMap((item) => item.images || [])
            .filter(Boolean);

        const unique = [coverImage, ...allImages.filter((image) => image !== coverImage)]
            .filter((value, index, array) => array.indexOf(value) === index);

        return unique.slice(0, 6);
    }, [coverImage, adminData, isAdminPreview]);

    useLayoutEffect(() => {
        if (!rootRef.current || !project) return;
        const ctx = gsap.context(() => {
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
    }, [project?.id]);

    // Move state-sync effects and derived data hooks above early returns
    // Images for landing vs standard
    const imagesToClassify = useMemo(() => {
        if (!project) return [];
        return isLandingCaseStudy
            ? [project.mainImage, ...(project.galleryImages || []), ...(Object.values(project.assets || {}))].filter(Boolean)
            : (project.images || [coverImage]);
    }, [project, isLandingCaseStudy, coverImage]);

    const mediaByView = useMemo(() => classifyMediaByView(imagesToClassify), [imagesToClassify]);
    const availableViews = useMemo(() => VIEW_ORDER.filter((view) => (mediaByView[view] || []).length > 0), [mediaByView]);

    // Ensure activeView is valid - this MUST be above early returns
    useEffect(() => {
        if (project && availableViews.length > 0 && !availableViews.includes(activeView)) {
            setActiveView(availableViews[0]);
        }
    }, [availableViews, activeView, project]);

    if (loading) {
        return <div className="p-20 text-white text-center">Loading live data...</div>;
    }

    if (!project) {
        if (isAdminPreview) return <div className="p-20 text-white text-center">Project "{projectId}" not found in disk data or drafts.</div>;
        const firstProjectId = portfolioDataDefault.projects?.[0]?.id || 'banana-leaf-detection';
        window.location.replace(`/projects/${firstProjectId}`);
        return null;
    }

    const formattedDate = new Date(project.dateCreated || Date.now()).toLocaleDateString('en-US', {
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

    const activeMedia = mediaByView[activeView] || [];
    const heroMedia = isLandingCaseStudy ? project.mainImage : (activeMedia[0] || coverImage);
    const galleryMedia = isLandingCaseStudy ? (project.galleryImages || []) : activeMedia.slice(1);
    
    const assetGroups = isLandingCaseStudy && project.assets 
        ? Object.entries(project.assets).map(([key, value]) => ({
            view: key,
            label: VIEW_META[key]?.label || key,
            files: value ? [value] : []
        })).filter(g => g.files.length > 0)
        : availableViews.map((view) => ({
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
                            <a href={project.livePreviewLink} className="cs-link-btn cs-link-btn--ghost" target="_blank" rel="noopener noreferrer">
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
                <Link to={isAdminPreview ? "/admin/projects" : "/projects"} className="cs-top-link" aria-label="Back">
                    <FiArrowLeft size={16} />
                    <span>{isAdminPreview ? "Back to Admin" : "Projects"}</span>
                </Link>
                {project.livePreviewLink && (
                    <a href={project.livePreviewLink} className="cs-top-link cs-top-link--ghost" target="_blank" rel="noopener noreferrer">
                        <FiLink2 size={15} />
                        <span>Live</span>
                    </a>
                )}
            </div>
        </section>
    );

    const handleAdminSave = async () => {
        if (!isAdminPreview || !adminData) return;
        try {
            const res = await fetch('/__write-json?file=portfolioData.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminData),
            });
            if (res.ok) alert("Project data synced to disk! 🚀");
            else alert("Sync failed.");
        } catch (e) {
            console.error(e);
            alert("Error syncing data.");
        }
    };

    const handleAddField = (type, existingUrl = null) => {
        const url = existingUrl || prompt(`Enter image URL for ${type}:`);
        if (!url) return;

        const newAdminData = { ...adminData };
        const pIdx = newAdminData.projects.findIndex(p => p.id === project.id);
        if (pIdx === -1) return;

        if (type === 'mainImage') {
            newAdminData.projects[pIdx].mainImage = url;
            // Also update the first item in images for legacy support
            if (!newAdminData.projects[pIdx].images) newAdminData.projects[pIdx].images = [];
            newAdminData.projects[pIdx].images[0] = url;
        } else if (type === 'galleryImage') {
            if (!newAdminData.projects[pIdx].galleryImages) newAdminData.projects[pIdx].galleryImages = [];
            newAdminData.projects[pIdx].galleryImages.push(url);
        }

        setAdminData(newAdminData);
        localStorage.setItem('portfolioData', JSON.stringify(newAdminData));
    };

    if (isLandingCaseStudy) {
        return (
            <LandingPageTemplate 
                project={project}
                rootRef={rootRef}
                topQuickNav={topQuickNav}
                availableViews={availableViews}
                activeView={activeView}
                setActiveView={setActiveView}
                VIEW_META={VIEW_META}
                renderMedia={renderMedia}
                heroMedia={heroMedia}
                galleryMedia={galleryMedia}
                formattedDate={formattedDate}
                credits={credits}
                systemDesignInfo={systemDesignInfo}
                assetGroups={assetGroups}
                analytics={analytics}
                caseStudyFooter={caseStudyFooter}
                isAdminPreview={isAdminPreview}
                onAddField={handleAddField}
                onSave={handleAdminSave}
            />
        );
    }

    return (
        <CaseStudyTemplate 
            project={project}
            rootRef={rootRef}
            topQuickNav={topQuickNav}
            formattedDate={formattedDate}
            caseStudyConfig={caseStudyConfig}
            coverImage={coverImage}
            highlightImages={highlightImages}
            sectionLabels={sectionLabels}
            uiuxPoints={uiuxPoints}
            systemDesignPoints={systemDesignPoints}
            assetGroups={assetGroups}
            scoreItems={scoreItems}
            caseStudyFooter={caseStudyFooter}
        />
    );
};

export default ProjectCaseStudyPage;
