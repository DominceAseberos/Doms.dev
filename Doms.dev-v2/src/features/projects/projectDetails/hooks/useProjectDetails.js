import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../../data/dataProjects.json';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for managing project details data and animations
 * @param {string} projectId - ID of the project to load
 * @returns {Object} Project data, refs, and loading state
 */
export const useProjectDetails = (projectId) => {
    const containerRef = useRef(null);
    const project = projectData.find(p => p.id === projectId);

    // Set document title and meta description
    useEffect(() => {
        if (project) {
            document.title = `${project.title} | Domince A. Aseberos`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', project.shortDescription);
            }
        }
        return () => {
            document.title = 'Domince A. Aseberos - Portfolio';
        };
    }, [project]);

    // GSAP animations
    useGSAP(() => {
        if (!containerRef.current) return;
        const mm = gsap.matchMedia();

        // Desktop animations
        mm.add("(min-width: 768px)", () => {
            gsap.from(".project-card", {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: "power3.out",
                onComplete: () => {
                    document.querySelectorAll('.project-card').forEach(el => {
                        el.classList.add('animation-complete');
                    });
                }
            });

            gsap.from(".card-content", {
                opacity: 0,
                y: 15,
                delay: 0.4,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out"
            });

            gsap.from(".doc-paragraph", {
                opacity: 0,
                y: 10,
                delay: 0.6,
                stagger: 0.05,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        // Mobile animations with scroll triggers
        mm.add("(max-width: 767px)", () => {
            gsap.from(".project-card", {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: "power3.out"
            });

            gsap.from(".card-content", {
                opacity: 0,
                y: 15,
                delay: 0.4,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out"
            });

            gsap.utils.toArray(".doc-paragraph").forEach(p => {
                gsap.from(p, {
                    scrollTrigger: {
                        trigger: p,
                        start: "top 85%",
                        once: true
                    },
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
        });

    }, { scope: containerRef, dependencies: [projectId] });

    return {
        project,
        containerRef,
        isLoading: false
    };
};
