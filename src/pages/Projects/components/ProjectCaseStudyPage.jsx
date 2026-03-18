import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

import useThemeStore from '../../../store/useThemeStore';
import portfolioDataImport from '../../../data/portfolioData.json';
import LandingPageTemplate from '../templates/LandingPageTemplate';
import { saveProjectContent, fetchPortfolioData } from '../../../shared/portfolioService';
import './ProjectCaseStudyPage.css';

const ProjectCaseStudyPage = ({ isAdmin = false }) => {
    const { projectId } = useParams();
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const rootRef = useRef(null);

    // Initial project state from the JSON import
    const [projectDraft, setProjectDraft] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

    // Sync from disk on mount to ensure we have the most up-to-date content
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await fetchPortfolioData();
                const found = data.projects.find(p => p.id === projectId);
                if (found) setProjectDraft(found);
            } catch (e) {
                // Fallback to import if fetch fails
                const found = portfolioDataImport.projects.find(p => p.id === projectId);
                if (found) setProjectDraft(found);
            }
        };
        fetchProject();
    }, [projectId]);

    const activeMedia = useMemo(() => {
        if (!projectDraft) return [];
        return projectDraft.mainImage ? [projectDraft.mainImage, ...(projectDraft.galleryImages || [])] : (projectDraft.galleryImages || []);
    }, [projectDraft]);

    const coverImage = useMemo(() => {
        if (!projectDraft) return '';
        return projectDraft.images?.[0] || '';
    }, [projectDraft]);

    const [activeView, setActiveView] = useState('desktop');

    const VIEW_META = {
        desktop: { icon: <FiMonitor size={14} />, label: 'Desktop' },
        tablet: { icon: <FiTablet size={14} />, label: 'Tablet' },
        mobile: { icon: <FiSmartphone size={14} />, label: 'Mobile' }
    };

    const heroMedia = useMemo(() => activeMedia[0] || '', [activeMedia]);
    const galleryMedia = useMemo(() => activeMedia.slice(1), [activeMedia]);

    const formattedDate = useMemo(() => {
        if (!projectDraft) return '---';
        return new Date(projectDraft.dateCreated).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }, [projectDraft]);

    const renderMedia = (source, alt, className) => {
        if (!source || source === '') return null;

        const isVideo = source.match(/\.(mp4|webm|ogg)$/i);
        if (isVideo) {
            return (
                <video 
                    src={source} 
                    className={className} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster={coverImage}
                />
            );
        }

        return <img src={source} alt={alt} className={className} loading="lazy" />;
    };

    useLayoutEffect(() => {
        if (!rootRef.current) return;
        
        const ctx = gsap.context(() => {
            gsap.from('.cs-animate', {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power4.out',
                clearProps: 'all'
            });
        }, rootRef.current);

        return () => ctx.revert();
    }, [projectId]);

    const onUpdateField = (fieldPath, value) => {
        setProjectDraft(prev => {
            if (!prev) return prev;
            const next = { ...prev };
            const keys = fieldPath.split('.');
            let current = next;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return next;
        });
    };

    const onSave = async () => {
        if (!projectDraft) return;
        try {
            setSaveStatus('saving');
            await saveProjectContent(projectId, projectDraft);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 2000);
        } catch (err) {
            setSaveStatus('error');
        }
    };

    if (!projectDraft) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <h2>Project Loading or Not Found</h2>
                <Link to="/projects" className="mt-4 text-[#c8ff3e] underline">Back to Projects</Link>
            </div>
        );
    }

    const assetGroups = projectDraft.assets || {};
    const analytics = {
        visits: 1240, 
        rating: 9.8    
    };

    const caseStudyFooter = (
        <section className="cs-shell cs-bottom-footer cs-animate">
            <div className="cs-bottom-footer__inner">
                <div className="cs-bottom-footer__left">
                    <p className="cs-overline">Next Phase</p>
                    <h2 className="cs-heading">Interested in the process?</h2>
                    <p className="cs-desc">
                        Every project has a story of challenges and breakthroughs. Let's discuss how we can build something impactful together.
                    </p>
                </div>
                <div className="cs-bottom-footer__actions">
                    <Link to="/contact" className="cs-link-btn">Initiate Collaboration</Link>
                    <Link to="/projects" className="cs-link-btn cs-link-btn--ghost">Explore Full Archive</Link>
                </div>
            </div>
        </section>
    );

    return (
        <LandingPageTemplate 
            project={projectDraft}
            rootRef={rootRef}
            availableViews={['desktop', 'tablet', 'mobile']}
            activeView={activeView}
            setActiveView={setActiveView}
            VIEW_META={VIEW_META}
            renderMedia={renderMedia}
            heroMedia={heroMedia}
            galleryMedia={galleryMedia}
            formattedDate={formattedDate}
            credits={projectDraft.credits || { design: 'Domince', code: 'Domince' }}
            systemDesignInfo={projectDraft.systemDesign || []}
            assetGroups={assetGroups}
            analytics={analytics}
            caseStudyFooter={caseStudyFooter}
            isAdminPreview={isAdmin}
            onUpdateField={onUpdateField}
            onSave={onSave}
            saveStatus={saveStatus}
        />
    );
};

export default ProjectCaseStudyPage;
