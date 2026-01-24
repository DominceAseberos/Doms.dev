import React, { useState, useRef } from 'react';
import ProjectCard from './ProjectCard';
import projectData from '../data/dataProjects.json';

const Projects = () => {
    const [expandedId, setExpandedId] = useState(null);
    const containerRef = useRef(null);

    const handleExpand = (id) => {
        setExpandedId(id);
    };

    const handleCollapse = () => {
        setExpandedId(null);
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden rounded-2xl"
            style={{
                background: `linear-gradient(
          to bottom,
          rgba(var(--box-Linear-1-rgb)),
          rgba(var(--box-Linear-2-rgb))
        )`
            }}
        >
            {/* Main Snap Carousel */}
            <div
                ref={containerRef}
                className={`w-full h-full flex flex-col gap-4 p-4 overflow-y-auto snap-y snap-mandatory transition-opacity duration-300 ${expandedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{
                    scrollBehavior: 'smooth'
                }}
            >
                {projectData.map((project) => (
                    <div key={project.id} className="w-full h-full shrink-0 snap-center animate-item">
                        <ProjectCard
                            project={project}
                            isExpanded={false}
                            onExpand={handleExpand}
                        />
                    </div>
                ))}

                {/* Visual Indicator for scrolling */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 animate-pulse pointer-events-none">
                    <span className="text-[8px] font-inter font-bold uppercase tracking-widest" style={{ color: 'rgb(var(--contrast-rgb) / 0.5)' }}>Scroll</span>
                    <div className="w-px h-4" style={{ backgroundColor: 'rgb(var(--contrast-rgb) / 0.2)' }} />
                </div>
            </div>

            {/* Expanded View Wrapper */}
            {expandedId && (
                <ProjectCard
                    project={projectData.find(p => p.id === expandedId)}
                    isExpanded={true}
                    onCollapse={handleCollapse}
                />
            )}
        </div>
    );
};

export default Projects;
