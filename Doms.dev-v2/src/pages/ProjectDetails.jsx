import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectDetails } from '../features/projects/projectDetails/hooks/useProjectDetails';

// Feature Components
import ProjectHeader from '../features/projects/projectDetails/components/ProjectHeader';
import ProjectCarousel from '../features/projects/projectDetails/components/ProjectCarousel';
import ProjectMetadata from '../features/projects/projectDetails/components/ProjectMetadata';
import ProjectDocumentation from '../features/projects/projectDetails/components/ProjectDocumentation';

const ProjectDetails = () => {
    const { id } = useParams();
    const { project, containerRef } = useProjectDetails(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                    githubLink={project.githubLink}
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
