import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageLoader from '../components/PageLoader';

gsap.registerPlugin(ScrollTrigger);
import { useProjectDetails } from '../features/projects/projectDetails/hooks/useProjectDetails';

// Feature Components
import ProjectHeader from '../features/projects/projectDetails/components/ProjectHeader';
import ProjectCarousel from '../features/projects/projectDetails/components/ProjectCarousel';
import ProjectMetadata from '../features/projects/projectDetails/components/ProjectMetadata';
import ProjectDocumentation from '../features/projects/projectDetails/components/ProjectDocumentation';
import MoreProjects from '../features/projects/projectDetails/components/MoreProjects';

const ProjectDetails = () => {
    const { id } = useParams();
    const { project, containerRef, isLoading } = useProjectDetails(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [revealReady, setRevealReady] = useState(false);

    // Refs for animation
    const carouselRef = useRef(null);
    const metadataRef = useRef(null);
    const docsRef = useRef(null);

    // Coordinated Reveal Animations
    useEffect(() => {
        if (!revealReady || !project) return;

        // 1. Animate main sections first
        const sections = [carouselRef.current, metadataRef.current, docsRef.current].filter(Boolean);

        gsap.fromTo(sections,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            }
        );

        // 2. Set up text paragraph animations (after a brief delay to ensure DOM is ready)
        setTimeout(() => {
            const docParagraphs = containerRef.current?.querySelectorAll(".doc-paragraph");
            if (!docParagraphs || docParagraphs.length === 0) return;

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
                            once: true
                        }
                    }
                );
            });
        }, 200);

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [revealReady, project]);

    const handleLoadComplete = useCallback(() => {
        setRevealReady(true);
    }, []);

    // Carousel navigation
    const nextImage = () => {
        if (!project?.images) return;
        setCurrentImageIndex((prev) =>
            prev === project.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        if (!project?.images) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? project.images.length - 1 : prev - 1
        );
    };

    if (!project && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        Project Not Found
                    </h1>
                    <Link to="/" className="text-blue-400 hover:text-blue-300">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageLoader
                isLoading={isLoading || !project}
                onLoadComplete={handleLoadComplete}
            />
            <div
                ref={containerRef}
                className="min-h-screen w-full py-8 px-4 md:px-12"
                style={{
                    background: `linear-gradient(
                    to bottom,
                    rgba(var(--body-Linear-1-rgb)),
                    rgba(var(--body-Linear-2-rgb))
                )`
                }}
            >
                {/* Header with Back Button */}
                <ProjectHeader />

                {/* Bento Grid Container */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                    {/* 1. Image Carousel (Top on mobile, Left on desktop) */}
                    <div className="md:col-span-8" ref={carouselRef} style={{ opacity: 0 }}>
                        {project ? (
                            <ProjectCarousel
                                images={project.images}
                                title={project.title}
                                currentImageIndex={currentImageIndex}
                                nextImage={nextImage}
                                prevImage={prevImage}
                            />
                        ) : (
                            <div className="w-full aspect-video bg-white/5 rounded-2xl animate-pulse" />
                        )}
                    </div>

                    {/* 2. Metadata Card (Middle on mobile, Sticky Right on desktop) */}
                    <div className="md:col-span-4 md:row-span-2 md:sticky md:top-8" ref={metadataRef} style={{ opacity: 0 }}>
                        {project ? (
                            <ProjectMetadata
                                title={project.title}
                                dateCreated={project.dateCreated}
                                projectType={project.projectType}
                                stacks={project.stacks}
                                livePreviewLink={project.livePreviewLink}
                                githubLink={project.githubLink}
                            />
                        ) : (
                            <div className="w-full h-96 bg-white/5 rounded-2xl animate-pulse" />
                        )}
                    </div>

                    {/* 3. Documentation (Bottom on mobile, Left on desktop) */}
                    <div className="md:col-span-8" ref={docsRef} style={{ opacity: 0 }}>
                        {project ? (
                            <ProjectDocumentation
                                documentation={project.fullDocumentation}
                                documentationFiles={project.documentationFiles}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="w-full h-8 bg-white/5 rounded animate-pulse" />
                                <div className="w-full h-32 bg-white/5 rounded animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. More Projects Section (Full Width) */}
                <MoreProjects currentProjectId={project?.id} />
            </div>
        </>
    );
};

export default ProjectDetails;
