import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import NavBar from '../components/NavBar';
import ProjectTabs from '../components/ProjectTabs';
import ExpandedProjectOverlay from '../components/ExpandedProjectOverlay';

const ProjectsPage = () => {
    const [expandedProject, setExpandedProject] = useState(null);

    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <NavBar />

            <div className="relative z-10">
                <ProjectTabs onView={setExpandedProject} />

                {expandedProject && (
                    <div
                        className="ep-overlay"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        <ExpandedProjectOverlay project={expandedProject} onClose={() => setExpandedProject(null)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;
