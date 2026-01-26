import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '../../../../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for managing project details data and animations
 * @param {string} projectId - ID of the project to load
 * @returns {Object} Project data, refs, and loading state
 */
export const useProjectDetails = (projectId) => {
    const containerRef = useRef(null);
    const { projects: projectData, profile } = usePortfolioData();
    const project = projectData.find(p => p.id === projectId);

    // Set document title and meta description
    useEffect(() => {
        if (project) {
            document.title = `${project.title} | ${profile.name}`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', project.shortDescription);
            }
        }
        return () => {
            document.title = `${profile.name} - Portfolio`;
        };
    }, [project, profile.name]);

    // GSAP animations
    useGSAP(() => {
        if (!containerRef.current) return;

        // SAFE MODE: Only animate text on scroll to avoid "blank page" flickering
        // 100ms delay ensures content is fully rendered before GSAP scans the DOM
        const timer = setTimeout(() => {
            const docParagraphs = gsap.utils.toArray(".doc-paragraph");
            if (docParagraphs.length === 0) return;

            const isMobile = window.innerWidth < 768;
            const startTrigger = isMobile ? "top 90%" : "top 85%";

            docParagraphs.forEach(p => {
                gsap.fromTo(p,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: p,
                            start: startTrigger,
                            toggleActions: "play none none reverse",
                            once: true // Performance: Only run once
                        }
                    }
                );
            });
        }, 150);

        return () => clearTimeout(timer);
    }, { scope: containerRef, dependencies: [projectId] });

    return {
        project,
        containerRef,
        isLoading: false
    };
};
