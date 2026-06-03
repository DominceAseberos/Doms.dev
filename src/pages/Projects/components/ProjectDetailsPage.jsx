import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

import useThemeStore from '../../../store/useThemeStore';
import portfolioDataImport from '../../../data/portfolioData.json';
import ProjectTemplate from '../templates/ProjectTemplate';
import { saveProjectContent, fetchPortfolioData } from '../../../shared/portfolioService';
import NotFoundPage from '../../NotFound/index';
import './ProjectDetailsPage.css';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ProjectDetailsPage = ({ isAdmin = false, initialProject = null }) => {
    const projectId = initialProject ? initialProject.id : (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
    const { theme } = useThemeStore();
    const isLight = theme === 'light';
    const rootRef = useRef(null);

    // Initial project state from the JSON import
    const [projectDraft, setProjectDraft] = useState(initialProject);
    const [loading, setLoading] = useState(!initialProject);
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

    // Sync from disk on mount to ensure we have the most up-to-date content
    useEffect(() => {
        if (initialProject) return; // Skip if Astro pre-fetched it
        
        const fetchProject = async () => {
            setLoading(true);
            try {
                const data = await fetchPortfolioData();
                const found = data.projects.find(p => p.id === projectId);
                if (found) setProjectDraft(found);
            } catch (e) {
                // Fallback to import if fetch fails
                const found = portfolioDataImport.projects.find(p => p.id === projectId);
                if (found) setProjectDraft(found);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId, initialProject]);

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

    const onAddField = (type, url) => {
        setProjectDraft(prev => {
            if (!prev) return prev;
            if (type === 'mainImage') return { ...prev, mainImage: url };
            if (type === 'galleryImage') return { ...prev, galleryImages: [...(prev.galleryImages || []), url] };
            return prev;
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

    useLayoutEffect(() => {
        if (!rootRef.current) return;
        
        // Small RAF delay so the DOM has fully painted before measuring
        const raf = requestAnimationFrame(() => {
            const ctx = gsap.context(() => {
                const els = gsap.utils.toArray('.cs-animate');
                
                // Set initial state
                gsap.set(els, { opacity: 0, y: 40, immediateRender: true });
                
                // Batch trigger reveals when scrolled into view
                ScrollTrigger.batch(els, {
                    start: 'top 92%',
                    onEnter: (batch) => {
                        gsap.to(batch, {
                            opacity: 1, 
                            y: 0,
                            duration: 1,
                            stagger: 0.15,
                            ease: 'power4.out',
                            clearProps: 'all'
                        });
                    },
                });
                
                ScrollTrigger.refresh();
            }, rootRef.current);
            
            return () => ctx.revert();
        });

        return () => cancelAnimationFrame(raf);
    }, [projectId, projectDraft]);

    if (loading) {
        return null; // Let GlobalLoader handle the initial wait if necessary
    }

    if (!projectDraft) {
        return <NotFoundPage />;
    }

    // Render universal template
    return (
        <ProjectTemplate 
            project={projectDraft}
            rootRef={rootRef}
            isAdminPreview={isAdmin}
            onAddField={onAddField}
            onUpdateField={onUpdateField}
            onSave={onSave}
            saveStatus={saveStatus}
        />
    );
};

export default ProjectDetailsPage;
