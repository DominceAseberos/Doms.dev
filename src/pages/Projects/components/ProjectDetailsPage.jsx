import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

import useThemeStore from '../../../store/useThemeStore';
import portfolioDataImport from '../../../data/portfolioData.json';
import LandingPageTemplate from '../templates/LandingPageTemplate';
import { saveProjectContent, fetchPortfolioData } from '../../../shared/portfolioService';
import './ProjectDetailsPage.css';

const ProjectDetailsPage = ({ isAdmin = false }) => {
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

    if (!projectDraft) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <h2>Project Loading or Not Found</h2>
                <Link to="/projects" className="mt-4 text-[#c8ff3e] underline">Back to Projects</Link>
            </div>
        );
    }

    const projectCategory = (projectDraft.projectType || '').toLowerCase();

    if (projectCategory === 'landing page') {
        return (
            <LandingPageTemplate 
                project={projectDraft}
                rootRef={rootRef}
                isAdminPreview={isAdmin}
                onAddField={onAddField}
                onUpdateField={onUpdateField}
                onSave={onSave}
                saveStatus={saveStatus}
            />
        );
    }

    // Default fallback for other categories
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white p-8">
            <div className="max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-4">{projectDraft.title}</h1>
                <p className="text-gray-400 mb-8">
                    This project is categorized as <strong className="text-white">"{projectDraft.projectType}"</strong>. 
                    <br />Currently, there is no specific template designed for this category.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/projects" className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
                        Back to Projects
                    </Link>
                    {isAdmin && (
                        <Link to="/admin/projects" className="px-6 py-3 bg-[#c8ff3e] text-black font-bold rounded-lg hover:bg-white transition-colors">
                            Admin Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
