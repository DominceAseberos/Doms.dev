import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../features/projects/data/dataProjects.json';

// Feature Components
import ProjectHeader from '../features/projects/projectDetails/components/ProjectHeader';
import ProjectCarousel from '../features/projects/projectDetails/components/ProjectCarousel';
import ProjectMetadata from '../features/projects/projectDetails/components/ProjectMetadata';
import ProjectDocumentation from '../features/projects/projectDetails/components/ProjectDocumentation';

gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projectData.find(p => p.id === id);

    const containerRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // SEO - Dynamic Meta Tags
    useEffect(() => {
        if (project) {
            document.title = `${project.title} | Domince A.Aseberos`;

            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', project.shortDescription);
            }
        }

        // Cleanup on unmount
        return () => {
            document.title = 'Domince A.Aseberos - Portfolio';
        };
    }, [project]);

    // GSAP Animations
    useGSAP(() => {
        if (!containerRef.current) return;

        // SAFE MODE: Only animate the documentation text on scroll
        // This avoids the "blank page" issue for the main content (Carousel/Header)

        const animateScrollText = () => {
            const docParagraphs = gsap.utils.toArray(".doc-paragraph");

            if (docParagraphs.length > 0) {
                // Determine start position based on device (mobile vs desktop)
                const isMobile = window.innerWidth < 768;
                const startTrigger = isMobile ? "top 90%" : "top 85%";

                docParagraphs.forEach(p => {
                    gsap.fromTo(p,
                        {
                            opacity: 0,
                            y: 20
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: p,
                                start: startTrigger,
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });
            }
        };

        // 100ms delay to ensure Markdown has parsed and DOM is ready
        const timer = setTimeout(animateScrollText, 100);
        return () => clearTimeout(timer);

    }, { scope: containerRef, dependencies: [id] });

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

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--body-Linear-rgb))' }}>
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
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* 1. Image Carousel (md:col-span-8) */}
                <ProjectCarousel
                    images={project.images}
                    title={project.title}
                    currentImageIndex={currentImageIndex}
                    nextImage={nextImage}
                    prevImage={prevImage}
                />

                {/* 2. Metadata Card (md:col-span-4) */}
                <ProjectMetadata
                    title={project.title}
                    dateCreated={project.dateCreated}
                    projectType={project.projectType}
                    stacks={project.stacks}
                    livePreviewLink={project.livePreviewLink}
                />

                {/* 3. Documentation (md:col-span-12) */}
                <ProjectDocumentation
                    documentation={project.fullDocumentation}
                    documentationFiles={project.documentationFiles}
                />
            </div>
        </div>
    );
};

export default ProjectDetails;
